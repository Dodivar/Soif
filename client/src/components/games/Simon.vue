<template>
  <v-container>
    <countdown @countdown-end="nextRound()"></countdown>
    <div id="game-container">
      <div class="simon-button" id="red" @click="playerTurn('red')"></div>
      <div class="simon-button" id="green" @click="playerTurn('green')"></div>
      <div class="simon-button" id="blue" @click="playerTurn('blue')"></div>
      <div class="simon-button" id="yellow" @click="playerTurn('yellow')"></div>
    </div>
    <span id="message" v-if="message !== null">
      {{ message }}
    </span>
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
      buttons: ['red', 'green', 'blue', 'yellow'],
      sequence: [],
      playerSequence: [],
      level: 0,
      message: null,
      userCanPlay: false
    }
  },
  created() {
    this.sequence = state.room.actualGame.sequence
  },
  methods: {
    nextRound() {
      this.level++
      this.playerSequence = []
      this.message = `${this.level}`
      this.playSequence()
    },

    playSequence() {
      let i = 0
      const intervalId = setInterval(() => {
        this.lightUpButton(this.sequence[i])
        i++

        if (i >= this.level) {
          clearInterval(intervalId)
          this.userCanPlay = true
        }
      }, 600)
    },

    lightUpButton(color) {
      const button = document.getElementById(color)
      button.classList.add('lit')
      setTimeout(() => {
        button.classList.remove('lit')
      }, 300)
    },

    playerTurn(color) {
      if (!this.userCanPlay) {
        return
      }
      this.playerSequence.push(color)
      this.lightUpButton(color)
      this.checkPlayerInput()
    },

    checkPlayerInput() {
      // Loose
      if (
        this.playerSequence[this.playerSequence.length - 1] !==
        this.sequence[this.playerSequence.length - 1]
      ) {
        this.gameOver()
        return
      }

      // Win
      if (this.playerSequence.length === this.sequence.length) {
        this.message = 'Félicitations ! Vous avez gagné !'

        // Send score after 2s
        setTimeout(() => {
          socket.emit('playGame', this.level)
        }, 2000)
        return
      }

      // Next round
      if (this.playerSequence.length === this.level) {
        this.userCanPlay = false
        setTimeout(this.nextRound, 1000)
      }
    },

    gameOver() {
      this.message = 'Game Over !'

      // Send score after 2s
      setTimeout(() => {
        socket.emit('playGame', 0)
      }, 2000)
    }
  }
}
</script>

<style scoped>
#game-container {
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
  width: 100vw;
}
.simon-button {
  width: 50%;
  height: 50%;
  opacity: 0.7;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.simon-button:hover {
  opacity: 0.9;
}
.simon-button.lit {
  opacity: 1;
  box-shadow: inset 0 0 50px 30px white;
}
#red {
  background-color: #ff4136;
}
#red.lit {
  background-color: #ff0000;
}
#green {
  background-color: #2ecc40;
}
#green.lit {
  background-color: #00ff00;
}
#blue {
  background-color: #0074d9;
}
#blue.lit {
  background-color: #0000ff;
}
#yellow {
  background-color: #ffdc00;
}
#yellow.lit {
  background-color: #ffff00;
}
#start {
  font-size: 1.2em;
  padding: 10px 20px;
  background-color: #01ff70;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
#start:hover {
  background-color: #2ecc40;
}
#message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  font-size: 120px;
  color: rgba(0, 0, 0, 0.2);
  user-select: none;
  pointer-events: none;
}
</style>
