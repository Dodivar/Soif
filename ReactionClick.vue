<template>
  <div id="game-container">
    <Timer v-if="hasStarted" :time="11" @end-timer="stopGame"></Timer>
    <countdown @countdown-end="startGame"></countdown>
    <div id="emoji-display"></div>
    <h3 v-if="reactionTime !== null">Votre temps de réaction : {{ this.reactionTime }}ms</h3>
  </div>
</template>

<script>
import { state, socket } from '@/socket'
import countdown from '@/components/Countdown.vue'
import Timer from '@/components/Timer.vue'

export default {
  components: {
    countdown,
    Timer
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
      emojis: ['🍆', '🍑', '🤠', '🤩', '😻', '🦄', '🌈', '⚡️', '🍕', '🎉']
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

    getRandomPosition() {
      const maxX = this.gameContainer.clientWidth - this.emojiDisplay.clientWidth
      const maxY = this.gameContainer.clientHeight - this.emojiDisplay.clientHeight
      const x = Math.floor(Math.random() * maxX)
      const y = Math.floor(Math.random() * maxY)
      return { x, y }
    },

    startGame() {
      this.hasStarted = true
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
      this.reactionTime = this.endTime - this.startTime / 1000
      this.emojiDisplay.removeEventListener('click', this.stopGame)
      this.emojiDisplay.style.display = 'none'

      // Send score after 2s
      setTimeout(() => {
        socket.emit('Game:PlayGame', Number(this.reactionTime.toFixed(3))
      }, 2000)
    }
  }
}
</script>

<style scoped>
#emoji-display {
  position: absolute;
  font-size: 5rem;
  cursor: pointer;
  user-select: none;
}
</style>
