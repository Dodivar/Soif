<template>
  <v-container>
    <div class="game-container">
      <h1>Devinez le nombre entre 1 et 100</h1>
      <p>Vous avez 3 essais !</p>
      <input type="number" id="guess" min="1" max="100" v-model="inputNumber">
      <button id="submit" v-show="submitButtonVisible">Deviner</button>
      <p id="message">
        {{ message }}
      </p>
      <div class="arrow arrow-up" v-show="arrowToShow === 'up'">⬆️</div>
      <div class="arrow arrow-down" v-show="arrowToShow === 'down'">⬇️</div>
      <button id="replay" v-show="!submitButtonVisible" @click="initGame">Rejouer</button>
      <ul id="guesses-list">
        <li v-for="guess in guesses">
          {{ guess }}
        </li>
      </ul>
    </div>
    <canvas id="confetti"></canvas>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import confetti from 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js'

export default {
  data() {
    return {
      state,
      inputNumber: 50
      targetNumber: null,
      submitButtonVisible: true,
      attempts: 3,
      guesses: [],
      arrowToShow: null,
      message: ''
    }
  },
  created() {
    this.initGame()
  },
  methods: {
    initGame() {
      this.targetNumber = Math.floor(Math.random() * 100) + 1;
      this.attempts = 3;
      this.guesses = [];
      this.message = '';
      this.inputNumber = 50;
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
        });
      }
      this.arrowToShow = null
    },

    playerGuess() {
      if (isNaN(this.inputNumber) || this.inputNumber < 1 || this.inputNumber > 100) {
        this.message = 'Veuillez entrer un nombre valide entre 1 et 100.';
        return;
      }

      this.attempts--;
      this.guesses.push(this.inputNumber);

      if (this.inputNumber === this.targetNumber) {
        this.message = `Bravo ! Vous avez trouvé le nombre ${this.targetNumber} !`;
        this.endGame(true);
      } else if (attempts === 0) {
        this.message = `Dommage ! Le nombre était ${this.targetNumber}. Vous avez épuisé vos essais.`;
        this.endGame(false);
      } else {
        this.message = `Ce n'est pas le bon nombre. Il vous reste ${this.attempts} essai${this.attempts > 1 ? 's' : ''}.`;
        this.arrowToShow = this.inputNumber < this.targetNumber ? 'up' : 'down';
      }

      this.inputNumber = null;
    }
  },
}
</script>

<style scoped>
h1 {
  color: #333;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 100px;
  margin-right: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #45a049;
}
#message {
  margin-top: 1rem;
  font-weight: bold;
}
.arrow {
  font-size: 3rem;
  opacity: 0;
  transition: opacity 0.5s, transform 0.5s;
}
.arrow.show {
  opacity: 1;
}
.arrow-up {
  transform: translateY(20px);
}
.arrow-up.show {
  transform: translateY(0);
}
.arrow-down {
  transform: translateY(-20px);
}
.arrow-down.show {
  transform: translateY(0);
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