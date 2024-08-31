<template>
  <v-container class="text-center">
    <Timer :time="60" @end-timer="endGame(false)"></Timer>
    <h1 class="my-10">Devinez le nombre entre 1 et 100</h1>

    <v-slider
      v-model="inputNumber"
      :ticks="tickLabels"
      show-ticks="always"
      :min="minNumber"
      :max="maxNumber"
      :step="1"
      :thumb-size="36"
      thumb-label="always"
    >
      <template v-slot:prepend>
        <v-btn
          elevation="3"
          color="red"
          icon="mdi-minus"
          size="small"
          variant="outlined"
          @click="decrement"
        ></v-btn>
      </template>

      <template v-slot:append>
        <v-btn
          elevation="3"
          color="green"
          icon="mdi-plus"
          size="small"
          variant="outlined"
          @click="increment"
        ></v-btn>
      </template>
    </v-slider>

    <v-btn
      class="bg-gradient-success rounded-xl text-white my-5"
      v-show="submitButtonVisible"
      @click="playerGuess"
      >Deviner</v-btn
    >
    <p>
      {{ message }}
    </p>
    <div class="arrow arrow-up" v-show="arrowToShow === 'up'">⬆️</div>
    <div class="arrow arrow-down" v-show="arrowToShow === 'down'">⬇️</div>
    <ul id="guesses-list">
      <li v-for="(guess, idx) in guesses" :key="idx">
        {{ guess }}
      </li>
    </ul>
    <canvas id="confetti"></canvas>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import confetti from 'canvas-confetti'
import Timer from '@/components/Timer.vue'

export default {
  components: {
    Timer
  },
  data() {
    return {
      state,
      inputNumber: 50,
      maxNumber: 100,
      minNumber: 1,
      targetNumber: null,
      submitButtonVisible: true,
      attempts: 3,
      guesses: [],
      arrowToShow: null,
      message: 'Tu as 3 essais',
      tickLabels: {
        1: '1',
        100: '100'
      }
    }
  },
  created() {
    this.initGame()
    this.targetNumber = state.room.actualGame.targetNumber
  },
  methods: {
    initGame() {
      this.attempts = 3
      this.guesses = []
      this.inputNumber = 50
      this.submitButtonVisible = true
      this.arrowToShow = null
    },

    endGame(win) {
      this.submitButtonVisible = false
      if (win) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
      this.arrowToShow = null
    },

    playerGuess() {
      if (isNaN(this.inputNumber) || this.inputNumber < 1 || this.inputNumber > 100) {
        this.message = 'Veuillez entrer un nombre valide entre 1 et 100.'
        return
      }

      this.attempts--
      this.guesses.push(this.inputNumber)

      if (this.inputNumber === this.targetNumber) {
        this.message = `Bravo ! Tu as trouvé le nombre ${this.targetNumber} !`
        socket.emit('Game:PlayGame', this.inputNumber)
        this.endGame(true)
      } else if (this.attempts === 0) {
        this.message = `Dommage ! Le nombre était ${this.targetNumber}. Vous avez épuisé vos essais.`
        socket.emit('Game:PlayGame', this.inputNumber)
        this.endGame(false)
      } else {
        this.message = `Ce n'est pas le bon nombre. Il te reste ${this.attempts} essai${this.attempts > 1 ? 's' : ''}.`
        this.badGuess()
      }
    },

    badGuess() {
      const secretNumberIsBigger = this.inputNumber < this.targetNumber
      this.arrowToShow = secretNumberIsBigger ? 'up' : 'down'

      if (secretNumberIsBigger) {
        this.inputNumber++
        delete this.tickLabels[this.minNumber]
        this.minNumber = this.inputNumber
        this.tickLabels[this.minNumber] = this.minNumber.toString()
      } else {
        this.inputNumber--
        delete this.tickLabels[this.maxNumber]
        this.maxNumber = this.inputNumber
        this.tickLabels[this.maxNumber] = this.maxNumber.toString()
      }
    },

    increment() {
      if (this.inputNumber === this.maxNumber) return
      this.inputNumber++
    },

    decrement() {
      if (this.inputNumber === this.minNumber) return
      this.inputNumber--
    }
  }
}
</script>

<style scoped>
h1 {
  color: #333;
}

.arrow {
  font-size: 3rem;
}
#confetti {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}
#guesses-list {
  margin-top: 1rem;
  padding: 0;
  list-style-type: none;
}
#guesses-list li {
  display: inline-block;
  margin: 0.25rem;
  padding: 0.5rem;
  background-color: #e0e0e0;
  border-radius: 5px;
}
</style>
