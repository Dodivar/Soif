<template>
  <v-container>
    <div id="game-container">
      <div id="emoji-display"></div>
      <div id="countdown">
        {{ countdown }}
      </div>
      <div id="info-panel">
        <h1>Jeu de Rapidité de Réaction</h1>
        <div v-if="!hasStarted">
          <p>Cliquez sur l'emoji dès qu'il apparaît !</p>
          <v-btn id="start-button" @click="startGame">Commencer</v-btn>
        </div>

        <div id="result" v-if="reactionTime !== null">
          Votre temps de réaction : {{ this.reactionTime }} ms
          <v-btn @click="startGame">Rejouer</v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  data() {
    return {
      state,
      hasStarted: false,
      countdown: 3,
      gameContainer: null,
      emojiDisplay: null,
      startTime: null,
      endTime: null,
      reactionTime: null,
      timeoutId: null,
      emojis: ['😃', '😎', '🤠', '🤩', '😻', '🦄', '🌈', '⚡️', '🍕', '🎉']
    }
  },
  mounted() {
    this.gameContainer = document.getElementById('game-container')
    this.emojiDisplay = document.getElementById('emoji-display')
  },
  methods: {
    getRandomEmoji() {
      return this.emojis[Math.floor(Math.random() * this.emojis.length)]
    },

    getRandomDelay() {
      return Math.floor(Math.random() * 9000) + 1000 // Entre 1000ms et 10000ms
    },

    getRandomPosition() {
      const maxX = this.gameContainer.clientWidth - this.emojiDisplay.clientWidth
      const maxY = this.gameContainer.clientHeight - this.emojiDisplay.clientHeight
      const x = Math.floor(Math.random() * maxX)
      const y = Math.floor(Math.random() * maxY)
      return { x, y }
    },

    startCountdown() {
      return new Promise(() => {
        this.countdown = 3

        function updateCount() {
          if (this.countdown > 0) {
            this.countdown--
            setTimeout(updateCount, 1000)
          }
        }

        updateCount()
      })
    },

    async startGame() {
      this.endTime = null
      this.startTime = null
      this.reactionTime = null

      this.emojiDisplay.textContent = ''
      this.emojiDisplay.style.display = 'none'

      await this.startCountdown()

      //   timeoutId =
      setTimeout(() => {
        this.emojiDisplay.textContent = this.getRandomEmoji()
        const { x, y } = this.getRandomPosition()
        this.emojiDisplay.style.left = `${x}px`
        this.emojiDisplay.style.top = `${y}px`
        this.emojiDisplay.style.display = 'block'
        this.startTime = new Date().getTime()
        this.emojiDisplay.addEventListener('click', this.stopGame)
      }, this.getRandomDelay())
    },

    stopGame() {
      this.endTime = new Date().getTime()
      this.reactionTime = this.endTime - this.startTime
      this.emojiDisplay.removeEventListener('click', this.stopGame)
      this.emojiDisplay.style.display = 'none'
    }
  }
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f0f0;
}
#game-container {
  position: relative;
  width: 100%;
  height: 100%;
}
#emoji-display {
  position: absolute;
  font-size: 5rem;
  cursor: pointer;
  user-select: none;
}
#info-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
#start-button,
#replay-button {
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
#start-button:hover,
#replay-button:hover {
  background-color: #45a049;
}
#result {
  font-size: 1.2rem;
  margin-top: 1rem;
}
#countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10rem;
  font-weight: bold;
  color: #333;
  display: none;
}
</style>
