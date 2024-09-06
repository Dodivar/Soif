<template>
  <div id="game-container">
    <Countdown @countdown-end="startGame"></Countdown>

    <div id="ball"></div>
    <div id="score" v-show="hasStart === true" :class="isGameOver ? 'finish' : ''">
      {{ score }}
    </div>
  </div>
</template>

<script>
import { state, socket } from '@/socket'
import Countdown from '@/components/Countdown.vue'

export default {
  components: {
    Countdown
  },
  data() {
    return {
      state,
      ball: null,
      gameArea: null,
      score: 0,
      ballX: window.innerWidth / 2,
      ballY: window.innerHeight / 2,
      velocityX: 2,
      velocityY: 0,
      gravity: 0.20,
      damping: 0.98,
      isGameOver: false,
      lastTimestamp: 0,
      widthBall: 100,
      hasStart: false
    }
  },
  mounted() {
    this.ball = document.getElementById('ball')
    this.gameArea = document.getElementById('game-container')

    this.setBallWidth()

    // Ensure the ball is initially visible
    this.ball.style.left = `${this.ballX}px`
    this.ball.style.top = `${this.ballY}px`
    // this.ball.addEventListener('click', this.onBallClick)
    this.ball.addEventListener('mousedown', this.onBallClick)
    this.ball.addEventListener('touchstart', this.onBallClick)

    window.addEventListener('resize', () => {
      this.ballX = Math.min(
        Math.max(this.ballX, this.ball.offsetWidth / 2),
        window.innerWidth - this.ball.offsetWidth / 2
      )
      this.ballY = Math.min(
        Math.max(this.ballY, this.ball.offsetHeight / 2),
        window.innerHeight - this.ball.offsetHeight / 2
      )
    })
  },
  methods: {
    startGame() {
      this.hasStart = true
      requestAnimationFrame(this.gameLoop)
    },

    setBallWidth() {
      this.ball.style.width = `${this.widthBall}px`
      this.ball.style.height = `${this.widthBall}px`
    },

    updateBallPosition(timestamp) {
      if (!this.lastTimestamp) this.lastTimestamp = timestamp
      const deltaTime = (timestamp - this.lastTimestamp) / 16 // Normalize to 60 FPS
      this.lastTimestamp = timestamp

      this.velocityY += this.gravity * deltaTime
      this.ballX += this.velocityX * deltaTime
      this.ballY += this.velocityY * deltaTime

      if (
        this.ballX + this.ball.offsetWidth / 2 > window.innerWidth ||
        this.ballX - this.ball.offsetWidth / 2 < 0
      ) {
        this.velocityX = -this.velocityX * this.damping
        this.ballX =
          this.ballX < this.ball.offsetWidth / 2
            ? this.ball.offsetWidth / 2
            : window.innerWidth - this.ball.offsetWidth / 2
      }

      if (this.ballY - this.ball.offsetHeight / 2 < 0) {
        this.velocityY = -this.velocityY * this.damping
        this.ballY = this.ball.offsetHeight / 2
      }

      if (this.ballY + this.ball.offsetHeight / 2 > window.innerHeight) {
        this.gameOver()
      }

      this.ball.style.left = `${this.ballX}px`
      this.ball.style.top = `${this.ballY}px`
    },

    gameLoop(timestamp) {
      if (!this.isGameOver) {
        this.updateBallPosition(timestamp)
        // this.score++
        requestAnimationFrame(this.gameLoop)
      }
    },

    gameOver() {
      this.isGameOver = true
      setTimeout(() => {
        socket.emit('Game:PlayGame', this.score)
      }, 2000)
    },

    onBallClick(e) {
      this.widthBall -= 2
      this.setBallWidth()
      e.preventDefault()
      if (!this.isGameOver) {
        this.velocityY = -8
        this.velocityX = (Math.random() - 0.5) * 8 // Add some horizontal velocity for variety
        this.score += 10
      }
    }
  }
}
</script>

<style scoped>
#ball {
  border-radius: 50%;
  background-color: #ff4500;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 1;
}
#restartButton {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: none;
}
#score {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
  user-select: none;
}
#score.finish {
  font-size: 150px;
  color: #ff0000;
  z-index: 2;
}
</style>
