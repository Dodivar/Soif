<template>
  <div id="game-container">
    <Timer :time="30" @end-timer="playGame(30000)" />
    <Countdown :countdown-number="3" @countdown-end="startGame" />

    <v-sheet
      class="position-fixed t-0 r-O bg-gradient-info rounded-xl text-center d-flex align-center"
      elevation="8"
    >
      {{ targetEmoji }}
    </v-sheet>
    
    <v-alert v-if="message"
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
    Countdown,
  },
  data() {
    return {
      state,
      emojiList: [
        '😀',
        '😃',
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
      message: null,
    }
  },
  methods: {
    getRandomEmoji() {
      return this.emojiList[Math.floor(Math.random() * emojiList.length)]
    },

    getRandomPosition(max) {
      return Math.floor(Math.random() * (max - 10)) + 5 // 5% margin from edges
    },

    createEmoji(emoji, isTarget = false) {
      const emojiElement = document.createElement('div')
      emojiElement.textContent = emoji
      emojiElement.className = 'emoji'
      emojiElement.style.left = `${this.getRandomPosition(90)}%`
      emojiElement.style.top = `${this.getRandomPosition(90)}%`

      if (isTarget) {
        emojiElement.id = 'target-emoji-game'
        emojiElement.addEventListener('click', endGame)
      }

      return emojiElement
    },

    startGame() {
      if (this.gameRunning) return

      this.gameRunning = true
      const gameContainer = document.getElementById('game-container')

      this.targetEmoji = getRandomEmoji()
      // document.getElementById('target-emoji').textContent = `Trouvez : ${this.targetEmoji}`;

      // Increased emoji count by 50%
      const emojiCount = Math.floor((window.innerWidth * window.innerHeight) / 6667)

      for (let i = 0; i < emojiCount; i++) {
        const emoji = i === 0 ? this.targetEmoji : this.getRandomEmoji()
        const emojiElement = createEmoji(emoji, i === 0)
        gameContainer.appendChild(emojiElement)
      }

      this.startTime = new Date().getTime()
      // document.getElementById('start-button').textContent = 'Partie en cours';
      // document.getElementById('start-button').disabled = true;
      // updateTimer();
    },

    endGame() {
      if (!this.gameRunning) return

      this.gameRunning = false
      this.endTime = new Date().getTime()
      const timeTaken = (this.endTime - this.startTime) / 1000
      this.playGame(timeTaken.toFixed(3))

      this.message = `Vous avez trouvé l'emoji ${this.targetEmoji} en ${timeTaken.toFixed(3)} secondes!`

      // document.getElementById('target-emoji').textContent = 'Trouvez : ';
      // document.getElementById('timer').textContent = 'Temps : 0.000s';
    },

    updateTimer() {
      if (!gameRunning) return

      const currentTime = new Date().getTime()
      const elapsedTime = (currentTime - startTime) / 1000
      // document.getElementById('timer').textContent = `Temps : ${elapsedTime.toFixed(3)}s`;

      // requestAnimationFrame(updateTimer);
    },

    playGame(time) {
      setTimeout(() => {
        socket.emit('Game:Play', time)
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
