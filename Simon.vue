<template>
  <v-container>
    <div class="game-container">
        <div class="simon-button" id="red" @click="playerTurn('red')"></div>
        <div class="simon-button" id="green" @click="playerTurn('green')"></div>
        <div class="simon-button" id="blue" @click="playerTurn('blue')"></div>
        <div class="simon-button" id="yellow" @click="playerTurn('yellow')"></div>
    </div>
    <div id="controls">
        <button id="start" v-show="!hasStarted" @click="startCountdown">Commencer</button>
        <div id="message">{{ message }}</div>
    </div>
    <div id="countdown" v-show="countdown > 0">
        {{ countdown }}
    </div>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  data() {
    return {
      state,
      buttons: ['red', 'green', 'blue', 'yellow'],
      sequence: [],
      playerSequence: [],
      level: 0,
      countdown: 3,
      message: '',
      hasStarted: false
    }
  },
  methods: {
    startCountdown() {
        this.hasStarted = true
        this.message = '';
        this.countdown = 3;
        
        const countdownInterval = setInterval(() => {
            this.countdown--;
            if (count === 0) {
                clearInterval(countdownInterval);
                this.startGame();
            }
        }, 1000);
    },

    startGame() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 0;
        this.nextRound();
    },

    nextRound() {
        this.level++;
        this.playerSequence = [];
        this.message = `Niveau ${this.level}`;
        this.addToSequence();
        this.playSequence();
    },

    addToSequence() {
        const randomColor = this.buttons[Math.floor(Math.random() * this.buttons.length)];
        this.sequence.push(randomColor);
    },

    playSequence() {
        let i = 0;
        const intervalId = setInterval(() => {
            this.lightUpButton(this.sequence[i]);
            i++;
            if (i >= this.sequence.length) {
                clearInterval(intervalId);
            }
        }, 600);
    },

    lightUpButton(color) {
        const button = document.getElementById(color);
        button.classList.add('lit');
        setTimeout(() => {
            button.classList.remove('lit');
        }, 300);
    },

    playerTurn(color) {
        this.playerSequence.push(color);
        this.lightUpButton(color);
        this.checkPlayerInput();
    },

    checkPlayerInput() {
        if (this.playerSequence[this.playerSequence.length - 1] !== this.sequence[this.playerSequence.length - 1]) {
            this.gameOver();
            return;
        }
        
        if (this.playerSequence.length === this.sequence.length) {
            if (this.playerSequence.length === 20) {
                this.message = 'Félicitations ! Vous avez gagné !';
                return;
            }
            setTimeout(this.nextRound, 1000);
        }
    },

    gameOver() {
        this.hasStarted = false
        this.message = 'Game Over ! Appuyez sur Commencer pour rejouer.';
    }
  },
}
</script>

<style scoped>
.game-container {
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
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
.simon-button:hover {
  opacity: 0.9;
}
.simon-button.lit {
  opacity: 1;
  box-shadow: inset 0 0 50px white;
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
#controls {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
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
  font-size: 1.5em;
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 5px;
}
#countdown {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10vw;
  z-index: 20;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
</style>