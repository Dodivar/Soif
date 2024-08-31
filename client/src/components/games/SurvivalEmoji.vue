<template>
  <div id="game-area">
    <Countdown @countdown-end="startGame"></Countdown>

    <div id="player" v-show="!isGameOver && startTime"></div>
    <div id="score" v-show="startTime" :class="isGameOver ? 'finish' : ''">
      {{ score.toFixed(1) }}
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
      score: 0.0,
      gameLoop: null,
      emojis: [],
      gameSpeed: 1,
      spawnRate: 1000,
      isGameOver: false,
      initialEmojis: 10,
      startTime: null,
      emojisLib: ['🍆', '🍑', '🤖', '👻', '🚀', '🌈', '🍕', '🎉'],
      gameArea: null,
      player: null
    }
  },
  mounted() {
    this.player = document.getElementById('player')
    this.gameArea = document.getElementById('game-area')
    this.gameArea.addEventListener('mousemove', this.updatePlayerPosition)
    this.gameArea.addEventListener('touchmove', this.updatePlayerPosition, { passive: false })
    this.gameArea.addEventListener('touchend', this.handleBadEnd, { passive: false })
  },
  methods: {
    updatePlayerPosition(e) {
      e.preventDefault()
      const x = e.clientX || e.touches[0].clientX
      const y = e.clientY || e.touches[0].clientY
      this.player.style.left = `${x - 10}px`
      this.player.style.top = `${y - 10}px`
    },

    spawnEmoji() {
      if (this.isGameOver) return

      const emoji = document.createElement('div')
      emoji.classList.add('emoji')
      emoji.textContent = this.emojisLib[Math.floor(Math.random() * this.emojisLib.length)]

      let startX, startY, endX, endY
      const side = Math.floor(Math.random() * 4)

      switch (side) {
        case 0: // top
          startX = Math.random() * this.gameArea.clientWidth
          startY = -30
          endX = Math.random() * this.gameArea.clientWidth
          endY = this.gameArea.clientHeight + 30
          break
        case 1: // right
          startX = this.gameArea.clientWidth + 30
          startY = Math.random() * this.gameArea.clientHeight
          endX = -30
          endY = Math.random() * this.gameArea.clientHeight
          break
        case 2: // bottom
          startX = Math.random() * this.gameArea.clientWidth
          startY = this.gameArea.clientHeight + 30
          endX = Math.random() * this.gameArea.clientWidth
          endY = -30
          break
        case 3: // left
          startX = -30
          startY = Math.random() * this.gameArea.clientHeight
          endX = this.gameArea.clientWidth + 30
          endY = Math.random() * this.gameArea.clientHeight
          break
      }

      emoji.style.left = `${startX}px`
      emoji.style.top = `${startY}px`
      this.gameArea.appendChild(emoji)

      const duration = 7000 / this.gameSpeed
      const animation = emoji.animate(
        [
          { left: `${startX}px`, top: `${startY}px` },
          { left: `${endX}px`, top: `${endY}px` }
        ],
        {
          duration: duration,
          easing: 'linear',
          fill: 'forwards'
        }
      )

      this.emojis.push({ element: emoji, animation: animation })

      animation.onfinish = () => {
        if (!this.isGameOver) {
          emoji.remove()
          this.emojis = this.emojis.filter((e) => e.element !== emoji)
        }
      }
    },

    checkCollision() {
      const playerRect = this.player.getBoundingClientRect()
      for (const emoji of this.emojis) {
        const emojiRect = emoji.element.getBoundingClientRect()
        if (
          playerRect.left < emojiRect.right &&
          playerRect.right > emojiRect.left &&
          playerRect.top < emojiRect.bottom &&
          playerRect.bottom > emojiRect.top
        ) {
          this.gameOver()
          return
        }
      }
    },

    updateGame() {
      const currentTime = new Date().getTime()
      this.score = (currentTime - this.startTime) / 1000
      this.gameSpeed += 0.001

      // Randomly increase spawn rate
      if (Math.random() < 0.2) {
        this.spawnRate = Math.max(200, this.spawnRate - 50)
      }
    },

    handleBadEnd(e) {
      e.preventDefault()
      if (this.startTime !== null) {
        this.gameOver()
      }
    },

    gameOver() {
      this.isGameOver = true
      clearInterval(this.gameLoop)

      // Stop all emoji animations
      this.emojis.forEach((emoji) => {
        emoji.animation.pause()
      })

      // Send score
      setTimeout(() => {
        socket.emit('Game:PlayGame', this.score)
      }, 4000)
    },

    startGame() {
      this.isGameOver = false
      this.score = 0
      this.gameSpeed = 1
      this.spawnRate = 1000
      this.emojis.forEach((emoji) => emoji.element.remove())
      this.emojis = []
      this.startTime = new Date().getTime()

      // Spawn initial emojis
      for (let i = 0; i < this.initialEmojis; i++) {
        this.spawnEmoji()
      }

      this.gameLoop = setInterval(() => {
        this.updateGame()
        this.checkCollision()
      }, 1000 / 60)

      this.spawnLoop()
    },

    spawnLoop() {
      if (this.isGameOver) {
        return
      }
      this.spawnEmoji()
      setTimeout(() => {
        this.spawnLoop()
      }, this.spawnRate)
    }
  }
}
</script>

<style>
#game-area {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-color: #f0f0f0;
  cursor: none;
  overflow: hidden;
  user-select: none;
}
#player {
  width: 20px;
  height: 20px;
  background-color: #ff0000;
  border-radius: 50%;
  position: absolute;
  pointer-events: none;
}
.emoji {
  position: absolute;
  font-size: 24px;
}
#score {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
#score.finish {
  font-size: 150px;
  color: #ff0000;
  z-index: 1;
}
</style>
