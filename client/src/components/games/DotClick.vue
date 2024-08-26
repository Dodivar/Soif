<template>
  <div id="game-container">
    <Timer v-if="startTime" :time="gameTime / 1000" @end-timer="endGame()"></Timer>
    <Countdown @countdown-end="startGame"></Countdown>

    <div id="score" :style="{ color: scoreColor }">
      {{ score }}
    </div>
    <canvas id="gameCanvas"></canvas>
  </div>
</template>

<script>
import { state, socket } from '@/socket'
import Countdown from '@/components/Countdown.vue'
import Timer from '@/components/Timer.vue'

export default {
  components: {
    Countdown,
    Timer
  },
  data() {
    return {
      state,
      score: 0,
      scoreColor: '',
      gameTime: 15000,
      startTime: 0,
      dots: [],
      canvas: null,
      canvasCtx: null,
      gameFinished: false
    }
  },
  mounted() {
    this.canvas = document.getElementById('gameCanvas')
    this.canvasCtx = this.canvas.getContext('2d')

    window.addEventListener('resize', this.resizeCanvas)
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      this.checkCollision(x, y)
    })
    this.resizeCanvas()
  },
  methods: {
    createDot() {
      const baseRadius = 20
      const x = Math.random() * (this.canvas.width - baseRadius * 2) + baseRadius
      const y = Math.random() * (this.canvas.height - baseRadius * 2) + baseRadius
      const colorRandom = Math.random()
      let color, lifespan, growthRate
      if (colorRandom < 0.65) {
        color = 'blue'
        lifespan = 2000
        growthRate = 0
      } else if (colorRandom < 0.95) {
        color = 'orange'
        lifespan = this.gameTime
        growthRate = baseRadius / this.gameTime // Growth rate to double size over game duration
      } else {
        color = 'green'
        lifespan = 1000
        growthRate = 0
      }
      const creationTime = Date.now()
      this.dots.push({
        x,
        y,
        baseRadius,
        radius: baseRadius,
        color,
        creationTime,
        lifespan,
        growthRate
      })
    },

    drawDots() {
      const currentTime = Date.now()
      this.dots.forEach((dot) => {
        const age = currentTime - dot.creationTime
        if (dot.color === 'orange') {
          dot.radius = dot.baseRadius + dot.growthRate * age
        }
        this.canvasCtx.beginPath()
        this.canvasCtx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        this.canvasCtx.fillStyle = dot.color
        this.canvasCtx.fill()
      })
    },

    updateScore(points) {
      this.score += points
      this.scoreColor = points > 0 ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'
      setTimeout(() => {
        this.scoreColor = 'rgba(255, 255, 255, 0.2)'
      }, 300)
    },

    checkCollision(x, y) {
      if (this.gameFinished) return

      this.dots.forEach((dot, index) => {
        const distance = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2)
        if (distance < dot.radius) {
          if (dot.color === 'blue') {
            this.updateScore(2)
          } else if (dot.color === 'orange') {
            this.updateScore(-5)
          } else if (dot.color === 'green') {
            this.updateScore(5)
          }
          this.dots.splice(index, 1)
        }
      })
    },

    gameLoop() {
      if (this.gameFinished) return

      this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      // Remove dots that have exceeded their lifespan
      const currentTime = Date.now()
      this.dots = this.dots.filter((dot) => currentTime - dot.creationTime < dot.lifespan)

      this.drawDots()

      if (Math.random() < 0.1) {
        // Adjust this value to control dot creation frequency
        this.createDot()
      }

      requestAnimationFrame(this.gameLoop)
    },

    endGame() {
      this.gameFinished = true

      // Send score after 2s
      setTimeout(() => {
        socket.emit('Game:PlayGame', this.score)
      }, 1000)
    },

    startGame() {
      this.score = 0
      this.startTime = Date.now()
      this.dots = []
      this.gameLoop()
    },

    resizeCanvas() {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
    }
  }
}
</script>

<style scoped>
#gameCanvas {
  position: absolute;
  top: 0;
  left: 0;
}
#score {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20vw;
  color: rgba(255, 255, 255, 0.2);
  pointer-events: none;
  transition: color 0.3s ease;
  z-index: 1;
}
#timer {
  position: absolute;
  top: 15px;
  left: 0;
  width: 100%;
  height: 10px;
  background-color: #ddd;
}
#timerBar {
  width: 100%;
  height: 100%;
  background-color: #4caf50;
  transition: width 0.1s linear;
}
</style>
