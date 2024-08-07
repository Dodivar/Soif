<template>
  <v-container id="game-container">
    <countdown @countdown-end="startGame"></countdown>
    <div id="emoji-display"></div>

    <!-- <div id="countdown" v-if="countdown > 0">
      {{ countdown }}
    </div> -->

    <div id="result" v-if="reactionTime !== null">
      Votre temps de réaction : {{ this.reactionTime }}ms
      <!-- <v-btn @click="startGame">Rejouer</v-btn> -->
    </div>

    <!-- <div id="info-panel">
      <h1>Jeu de Rapidité de Réaction</h1>
      <div v-if="!hasStarted">
        <p>Cliquez sur l'emoji dès qu'il apparaît !</p>
        <v-btn id="start-button" @click="startGame">Commencer</v-btn>
      </div> -->

    <!-- </div> -->
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import countdown from '@/components/Countdown.vue'

export default {
  components: {
    countdown
  },
  data() {
    return {
      state,
      hasStarted: false,
      countdown: 3,
      gameContainer: null,
      emojiDisplay: {
        textContent: '',
        display: 'none'
      },
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

    this.startGame()
  },
  methods: {
    getRandomEmoji() {
      return this.emojis[Math.floor(Math.random() * this.emojis.length)]
    },

    getRandomPosition() {
      const maxX = this.gameContainer.clientWidth - this.emojiDisplay.clientWidth
      const maxY = this.gameContainer.clientHeight - this.emojiDisplay.clientHeight
      const x = Math.floor(Math.random() * maxX)
      const y = Math.floor(Math.random() * maxY)
      return { x, y }
    },

    startGame() {
      setTimeout(() => {
        this.emojiDisplay.textContent = this.getRandomEmoji()
        const { x, y } = this.getRandomPosition()
        this.emojiDisplay.style.left = `${x}px`
        this.emojiDisplay.style.top = `${y}px`
        this.emojiDisplay.style.display = 'block'
        this.startTime = new Date().getTime()
        this.emojiDisplay.addEventListener('click', this.stopGame)
      }, state.room.actualGame.randomDelay)
    },

    stopGame() {
      this.endTime = new Date().getTime()
      this.reactionTime = this.endTime - this.startTime
      this.emojiDisplay.removeEventListener('click', this.stopGame)
      this.emojiDisplay.style.display = 'none'

      // Send score after 2s
      setTimeout(() => {
        socket.emit('playGame', this.reactionTime)
      }, 2000)
    }
  }
}
</script>

<style>
/* body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f0f0;
} */
#game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

#emoji-display {
  position: absolute;
  font-size: 5rem;
  cursor: pointer;
  user-select: none;
}

#result {
  font-size: 1.2rem;
  margin-top: 1rem;
  color: white;
}

#countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10rem;
  font-weight: bold;
  color: white;
}
</style>
