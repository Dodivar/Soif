<template>
  <div id="game-container">
    <Countdown :countdown-number="3" @countdown-end="countdownOver = true" />
    <Timer v-if="countdownOver" :time="10" @end-timer="gameOver()"></Timer>

    <canvas id="gameCanvas"></canvas>

    <!-- || !gameActive -->
    <v-alert
      v-if="hasWin !== null"
      class="position-fixed mx-5"
      elevation="24"
      :color="alertColor"
      :icon="`$${alertColor}`"
      :text="message"
    ></v-alert>
  </div>
</template>

<script>
import { state, socket } from '@/socket'
import Timer from '@/components/Timer.vue'
import Countdown from '@/components/Countdown.vue'

export default {
  components: {
    Timer,
    Countdown
  },
  data() {
    return {
      state,
      canvas: null,
      ctx: null,
      gameActive: false,
      playerX: null,
      playerY: null,
      playerSize: 20,
      mazeWidth: 30,
      mazeSpacing: 50,
      maze: [],
      startZone: { width: 500, height: 120 },
      endZone: { width: 100, height: 50 },
      stars: [],
      collectedStars: 0,
      starEmoji: '⭐',
      starSize: 20,
      hasWin: null,
      startTime: null,
      countdownOver: false,
      message:
        'Touchez la zone verte en bas pour commencer. Collectez les 3 étoiles ⭐ et atteignez la zone bleue en haut pour gagner. Ne levez pas votre doigt pendant le jeu !'
    }
  },
  computed: {
    alertColor() {
      return this.hasWin !== null && this.hasWin
        ? 'success'
        : this.hasWin !== null && !this.hasWin
          ? 'error'
          : 'info'
    }
  },
  mounted() {
    this.canvas = document.getElementById('gameCanvas')
    this.ctx = this.canvas.getContext('2d')

    this.canvas.addEventListener('mousemove', this.handleMove)
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      this.handleMove(e.touches[0])
    })
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      this.handleMove(e.touches[0])
    })
    this.canvas.addEventListener('touchend', this.handleEnd)
    this.canvas.addEventListener('touchcancel', this.handleEnd)

    window.addEventListener('resize', this.resizeCanvas)
    this.resizeCanvas()
    this.update()
  },
  methods: {
    resizeCanvas() {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.startZone.x = this.canvas.width / 2 - this.startZone.width / 2
      this.startZone.y = this.canvas.height - this.startZone.height
      this.endZone.x = this.canvas.width / 2 - this.endZone.width / 2
      this.endZone.y = 0
      this.generateMaze()
      this.generateStars()
      this.drawGame()
    },

    generateMaze() {
      this.maze = []
      const rows = Math.floor(this.canvas.height / this.mazeSpacing)
      const cols = Math.floor(this.canvas.width / this.mazeSpacing)

      const startSafeRow = Math.floor(
        (this.canvas.height - this.startZone.height) / this.mazeSpacing
      )
      const endSafeRow = Math.ceil(this.endZone.height / this.mazeSpacing)
      const startSafeCol = Math.floor(this.startZone.x / this.mazeSpacing)
      const endSafeCol = Math.ceil((this.startZone.x + this.startZone.width) / this.mazeSpacing)

      for (let i = 0; i < rows; i++) {
        let row = []
        for (let j = 0; j < cols; j++) {
          if (
            i >= startSafeRow ||
            i < endSafeRow ||
            (j >= startSafeCol && j < endSafeCol && (i === 0 || i === rows - 1))
          ) {
            row.push(0)
          } else if (
            i === 0 ||
            i === rows - 1 ||
            j === 0 ||
            j === cols - 1 ||
            Math.random() < 0.3
          ) {
            row.push(1)
          } else {
            row.push(0)
          }
        }
        this.maze.push(row)
      }

      for (let i = 1; i < rows - 1; i++) {
        let hasPath = false
        for (let j = 1; j < cols - 1; j++) {
          if (this.maze[i][j] === 0) {
            hasPath = true
            break
          }
        }
        if (!hasPath) {
          const randomIndex = Math.floor(Math.random() * (cols - 2)) + 1
          this.maze[i][randomIndex] = 0
        }
      }
    },

    generateStars() {
      this.stars = []
      const rows = this.maze.length
      const cols = this.maze[0].length

      while (this.stars.length < 3) {
        const x = Math.floor(Math.random() * cols)
        const y = Math.floor(Math.random() * rows)

        if (this.maze[y][x] === 0 && !this.stars.some((star) => star.x === x && star.y === y)) {
          this.stars.push({
            x: x * this.mazeSpacing + this.mazeSpacing / 2,
            y: y * this.mazeSpacing + this.mazeSpacing / 2
          })
        }
      }
    },

    drawMaze() {
      this.ctx.fillStyle = '#000'
      for (let i = 0; i < this.maze.length; i++) {
        for (let j = 0; j < this.maze[i].length; j++) {
          if (this.maze[i][j] === 1) {
            this.ctx.fillRect(
              j * this.mazeSpacing,
              i * this.mazeSpacing,
              this.mazeWidth,
              this.mazeWidth
            )
          }
        }
      }
    },

    drawZones() {
      this.ctx.fillStyle = '#00ff00'
      this.ctx.fillRect(
        this.startZone.x,
        this.startZone.y,
        this.startZone.width,
        this.startZone.height
      )
      this.ctx.fillStyle = '#0000ff'
      this.ctx.fillRect(this.endZone.x, this.endZone.y, this.endZone.width, this.endZone.height)
    },

    drawPlayer() {
      this.ctx.fillStyle = '#ff0000'
      this.ctx.beginPath()
      this.ctx.arc(this.playerX, this.playerY, this.playerSize / 2, 0, Math.PI * 2)
      this.ctx.fill()
    },

    drawStars() {
      this.ctx.font = `${this.starSize}px Arial`
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.stars.forEach((star) => {
        this.ctx.fillText(this.starEmoji, star.x, star.y)
      })
    },

    drawGame() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.drawZones()
      this.drawMaze()
      this.drawStars()
      if (this.gameActive) {
        this.drawPlayer()
      }
    },

    startGame() {
      this.gameActive = true
      this.playerX = this.startZone.x + this.startZone.width / 2
      this.playerY = this.startZone.y + this.startZone.height / 2
      this.collectedStars = 0
      this.startTime = new Date().getTime()
    },

    checkCollision() {
      const row = Math.floor(this.playerY / this.mazeSpacing)
      const col = Math.floor(this.playerX / this.mazeSpacing)

      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (this.maze[i] && this.maze[i][j] === 1) {
            const wallX = j * this.mazeSpacing
            const wallY = i * this.mazeSpacing
            const dx =
              this.playerX - Math.max(wallX, Math.min(this.playerX, wallX + this.mazeWidth))
            const dy =
              this.playerY - Math.max(wallY, Math.min(this.playerY, wallY + this.mazeWidth))
            if (dx * dx + dy * dy < (this.playerSize / 2) * (this.playerSize / 2)) {
              this.gameOver()
              return
            }
          }
        }
      }

      this.stars = this.stars.filter((star) => {
        const dx = this.playerX - star.x
        const dy = this.playerY - star.y
        if (
          dx * dx + dy * dy <
          (this.playerSize / 2 + this.starSize / 2) * (this.playerSize / 2 + this.starSize / 2)
        ) {
          this.collectedStars++
          return false
        }
        return true
      })

      if (
        this.playerX >= this.endZone.x &&
        this.playerX <= this.endZone.x + this.endZone.width &&
        this.playerY >= this.endZone.y &&
        this.playerY <= this.endZone.y + this.endZone.height
      ) {
        if (this.collectedStars === 3) {
          this.gameWon()
        }
        // else {
        //   this.gameOver()
        // }
      }
    },

    gameOver() {
      if (this.hasWin) return
      this.gameActive = false
      this.hasWin = false
      this.message = 'Vous avez perdu !'

      // Send score after 2s
      setTimeout(() => {
        socket.emit('Game:PlayGame', { ms: 696969, win: false })
      }, 2000)
    },

    gameWon() {
      this.gameActive = false
      this.hasWin = true
      let endTime = new Date().getTime()
      let reactionTime = endTime - this.startTime
      this.message = `Vous avez gagné en ${reactionTime}ms !`

      // Send score after 2s
      setTimeout(() => {
        socket.emit('Game:PlayGame', { ms: reactionTime, win: true })
      }, 2000)
    },

    update() {
      if (this.gameActive) {
        this.checkCollision()
      }
      this.drawGame()
      requestAnimationFrame(this.update)
    },

    handleMove(e) {
      if (!this.countdownOver) return
      const rect = this.canvas.getBoundingClientRect()
      const x = (e.clientX || e.touches[0].clientX) - rect.left
      const y = (e.clientY || e.touches[0].clientY) - rect.top

      if (!this.gameActive) {
        if (
          x >= this.startZone.x &&
          x <= this.startZone.x + this.startZone.width &&
          y >= this.startZone.y &&
          y <= this.startZone.y + this.startZone.height
        ) {
          this.startGame()
        }
      } else {
        this.playerX = x
        this.playerY = y
      }
    },

    handleEnd() {
      if (this.gameActive) {
        this.gameOver()
      }
    },

    restartGame() {
      this.generateMaze()
      this.generateStars()
      this.gameActive = false
      this.drawGame()
    }
  }
}
</script>

<style>
#gameCanvas {
  display: block;
  background-color: #f0f0f0;
  width: 100%;
  height: 100%;
}
#gameOver,
#gameWon,
#instructions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 18px;
  display: none;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
}
</style>
