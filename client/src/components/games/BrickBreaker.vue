<template>
  <div id="game-container">
    <Countdown @countdown-end="startGame"></Countdown>

    <canvas id="gameCanvas"></canvas>
    <div id="score" v-show="hasStart" :class="isGameOver ? 'finish' : ''">
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
      canvas: null,
      ctx: null,
      paddleHeight: 15,
      paddleWidth: 75,
      brickRowCount: 10,
      brickColumnCount: 5,
      brickWidth: 60,
      brickHeight: 20,
      brickPadding: 10,
      brickOffsetTop: 10,
      brickOffsetLeft: null,
      ballRadius: 10,
      x: null,
      y: null,
      dx: 2,
      dy: -2,
      paddleX: null,
      speed: 1,
      bricks: [],
      score: 0,
      isGameOver: false,
      lastTimestamp: 0,
      hasStart: false
    }
  },
  mounted() {
    this.canvas = document.getElementById('gameCanvas')
    this.ctx = this.canvas.getContext('2d')

    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.brickOffsetLeft =
      (this.canvas.width -
        ((this.brickWidth + this.brickPadding) * this.brickColumnCount - this.brickPadding)) /
      2
    this.paddleX = (this.canvas.width - this.paddleWidth) / 2

    this.x = this.canvas.width / 2
    this.y = this.canvas.height - 30

    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = []
      for (let r = 0; r < this.brickRowCount; r++) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1 }
      }
    }

    this.canvas.addEventListener('mousemove', this.touchHandler)
    this.canvas.addEventListener('touchmove', this.touchHandler)

    this.draw()
  },
  methods: {
    startGame() {
      this.hasStart = true
      requestAnimationFrame(this.gameLoop)
    },
    gameLoop(timestamp) {
      if (this.isGameOver) {
        setTimeout(() => {
          socket.emit('Game:PlayGame', this.score)
        }, 2000)
        return
      }
      this.draw(timestamp)
      requestAnimationFrame(this.gameLoop)
    },

    increaseSpeed() {
      this.speed *= 1.05
    },

    drawBall() {
      this.ctx.beginPath()
      this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2)
      this.ctx.fillStyle = '#000'
      this.ctx.fill()
      this.ctx.closePath()
    },

    drawPaddle() {
      this.ctx.beginPath()
      this.ctx.rect(
        this.paddleX,
        this.canvas.height - this.paddleHeight,
        this.paddleWidth,
        this.paddleHeight
      )
      this.ctx.fillStyle = '#0095DD'
      this.ctx.fill()
      this.ctx.closePath()
    },

    drawBricks() {
      for (let c = 0; c < this.brickColumnCount; c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
          if (this.bricks[c][r].status == 1) {
            const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft
            const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop
            this.bricks[c][r].x = brickX
            this.bricks[c][r].y = brickY
            this.ctx.beginPath()
            this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight)
            const hue = (c / this.brickColumnCount) * 360
            this.ctx.fillStyle = `hsl(${hue}, 100%, ${50 + (r / this.brickRowCount) * 50}%)`
            this.ctx.fill()
            this.ctx.closePath()
          }
        }
      }
    },

    collisionDetection() {
      for (let c = 0; c < this.brickColumnCount; c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
          const b = this.bricks[c][r]
          if (b.status == 1) {
            if (
              this.x > b.x &&
              this.x < b.x + this.brickWidth &&
              this.y > b.y &&
              this.y < b.y + this.brickHeight
            ) {
              this.dy = -this.dy
              b.status = 0
              this.increaseSpeed()
              this.score += 10
            }
          }
        }
      }
    },

    draw(timestamp) {
      if (!this.lastTimestamp) this.lastTimestamp = timestamp
      const deltaTime = (timestamp - this.lastTimestamp) / 16 // Normalize to 60 FPS
      this.lastTimestamp = timestamp

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.drawBricks()
      this.drawBall()
      this.drawPaddle()
      this.collisionDetection()

      if (
        this.x + this.dx > this.canvas.width - this.ballRadius ||
        this.x + this.dx < this.ballRadius
      ) {
        this.dx = -this.dx
      }
      if (this.y + this.dy < this.ballRadius) {
        this.dy = -this.dy
      } else if (this.y + this.dy > this.canvas.height - this.ballRadius) {
        if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
          const bounceAngle = this.calculateBounceAngle(this.x)
          const speedBounce = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
          this.dx = speedBounce * Math.sin(bounceAngle)
          this.dy = -speedBounce * Math.cos(bounceAngle)
          this.increaseSpeed()
        } else {
          this.isGameOver = true
        }
      }

      this.x += this.dx * this.speed //* deltaTime
      this.y += this.dy * this.speed //* deltaTime
    },

    calculateBounceAngle(hitX) {
      const relativeHitX = (hitX - this.paddleX) / this.paddleWidth
      const bounceAngle = ((relativeHitX - 0.5) * Math.PI) / 2
      return bounceAngle
    },

    touchHandler(e) {
      const touch = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
      const relativeX = touch - this.canvas.offsetLeft
      if (relativeX > 0 && relativeX < this.canvas.width) {
        this.paddleX = relativeX - this.paddleWidth / 2
      }
    }
  }
}
</script>

<style scoped>
#gameCanvas {
  display: block;
  background: #fff;
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
  z-index: 1;
}
</style>
