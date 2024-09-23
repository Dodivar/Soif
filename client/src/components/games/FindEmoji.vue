<template>
  <div id="game-container">
    <Timer v-if="gameRunning" :time="30" @end-timer="playGame(false, 696969)" />
    <Countdown :countdown-number="3" @countdown-end="startGame" />

    <v-sheet
      class="position-fixed top-0 right-0 text-h2 bg-gradient-danger pa-5 ma-3 rounded-lg text-center d-flex align-center pa-5"
      elevation="8"
    >
      {{ targetEmoji ?? '?' }}
    </v-sheet>

    <v-alert
      v-if="message"
      class="position-fixed top-50"
      elevation="24"
      color="success"
      icon="$success"
      :text="message"
    ></v-alert>
  </div>
</template>

<script>
import { state, socket } from '@/socket'
import Countdown from '@/components/Countdown.vue'
import Timer from '@/components/Timer.vue'

export default {
  components: {
    Timer,
    Countdown
  },
  data() {
    return {
      state,
      emojiList: [
        '😀',
        '😄',
        '😁',
        '😆',
        '😅',
        '😂',
        '🤣',
        '😊',
        '😇',
        '🙂',
        '🙃',
        '😉',
        '😌',
        '😍',
        '🥰',
        '😘',
        '😗',
        '😙',
        '😚',
        '😋',
        '😛',
        '😝',
        '😜',
        '🤪',
        '🤨',
        '🧐',
        '🤓',
        '😎',
        '🤩',
        '🥳',
        '😏',
        '😒',
        '😞',
        '😔',
        '😟',
        '😕',
        '🙁',
        '☹️',
        '😣',
        '😖',
        '😫',
        '😩',
        '🥺',
        '😢',
        '😭',
        '😤',
        '😠',
        '😡',
        '🤬',
        '🤯',
        '😳',
        '🥵',
        '🥶',
        '😱',
        '😨',
        '😰',
        '😥',
        '😓',
        '🤗',
        '🤔',
        '🤭',
        '🤫',
        '🤥',
        '😶',
        '😐',
        '😑',
        '😬',
        '🙄',
        '😯',
        '😦',
        '😧',
        '😮',
        '😲',
        '🥱',
        '😴',
        '🤤',
        '😪',
        '😵',
        '🤐',
        '🥴',
        '🤢',
        '🤮',
        '🤧',
        '😷',
        '🤒',
        '🤕'
      ],
      startTime: null,
      endTime: null,
      targetEmoji: null,
      gameRunning: false,
      message: null
    }
  },
  methods: {
    getRandomEmoji() {
      return this.emojiList[Math.floor(Math.random() * this.emojiList.length)]
    },

    getRandomPosition(max) {
      return Math.floor(Math.random() * (max - 10)) + 7 // 5% margin from edges
    },

    createEmoji(emoji, isTarget = false) {
      const emojiElement = document.createElement('div')
      emojiElement.textContent = emoji
      emojiElement.className = 'emoji'
      emojiElement.style.left = `${this.getRandomPosition(90)}%`
      emojiElement.style.top = `${this.getRandomPosition(90)}%`

      if (isTarget) {
        emojiElement.id = 'target-emoji-game'
        emojiElement.addEventListener('click', this.endGame)
      }

      return emojiElement
    },

    startGame() {
      if (this.gameRunning) return

      this.gameRunning = true
      const gameContainer = document.getElementById('game-container')

      // Increased emoji count by 50%
      const emojiCount = Math.floor((window.innerWidth * window.innerHeight) / 6667)

      // Create the one to found and delete it from the list
      this.targetEmoji = this.getRandomEmoji()
      this.emojiList = this.emojiList.filter((e) => e !== this.targetEmoji)
      const emojiToFoundElement = this.createEmoji(this.targetEmoji, true)
      gameContainer.appendChild(emojiToFoundElement)

      for (let i = 0; i < emojiCount; i++) {
        const emoji = this.getRandomEmoji()
        const emojiElement = this.createEmoji(emoji, i === 0)
        gameContainer.appendChild(emojiElement)
      }

      this.startTime = new Date().getTime()
    },

    endGame() {
      if (!this.gameRunning) return

      this.gameRunning = false
      this.endTime = new Date().getTime()
      const timeTaken = (this.endTime - this.startTime) / 1000
      this.playGame(true, Number(timeTaken.toFixed(3)))

      this.message = `Vous avez trouvé l'emoji ${this.targetEmoji} en ${timeTaken.toFixed(3)} secondes!`
    },

    playGame(win, time) {
      setTimeout(() => {
        socket.emit('Game:PlayGame', { win, ms: time })
      }, 2000)
    }
  },
  created() {}
}
</script>

<style scoped>
#game-container {
  user-select: none;
}
.emoji {
  position: absolute;
  font-size: 24px;
  user-select: none;
  transition: all 0.3s ease;
}
.emoji:hover {
  transform: scale(1.2);
}
#info-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}
#target-emoji,
#timer {
  font-size: 20px;
}
#start-button {
  font-size: 18px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
#start-button:hover {
  background-color: #45a049;
}
#start-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
