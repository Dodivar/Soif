<template>
  <v-container :style="{'background-color': backgroundColor}" @click="clickAction">
    <div id="timeline">
        <div id="progress" :style="{'width': progressBarWidth}"></div>
    </div>

    <div id="game-area" :style="{'pointer-events': gameAreaPointerEvents}">
        <div id="click-count" v-show="hasStart" :style="clickCount.style">
            {{ clickCount.text }}
        </div>
        <div id="countdown" v-show="countdownStarted">
            {{ countdown }}
        </div>
    </div>

    <button id="start-button" v-show="!countdownStarted">Commencer</button>
    <button id="replay-button" v-show="hasFinished">Rejouer</button>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  data() {
    return {
      state,
      hasStart: false,
      hasFinished: false,
      countdownStarted: false,
      countdown: 3,
      timeLeft: 10,
      progressBarWidth: "100%",
      gameAreaPointerEvents: 'none',
      backgroundColor: '#f0f0f0'
      clickCount: {
        style: {},
        value: 0
      }
    }
  },
  methods: {
    startCountdown() {
        this.countdownStarted = true
        
        const countdownInterval = setInterval(() => {
            this.countdown--;
            
            if (this.countdown === 0) {
                this.countdownStarted = false
                clearInterval(countdownInterval);
                startGame();
            }
        }, 1000);
    },

    startGame() {
        this.hasStart = true;
        this.timeLeft = 10;
        this.clickCount.value = 0
        
        this.progressBarWidth = '100%';
        this.gameAreaPointerEvents = 'auto';
        this.backgroundColor = '#f0f0f0';

        const gameInterval = setInterval(() => {
            this.timeLeft -= 0.1;
            this.progressBarWidth = `${(this.timeLeft / 10) * 100}%`;

            if (this.timeLeft <= 0) {
                clearInterval(gameInterval);
                this.endGame();
            }
        }, 100);
    },

    endGame() {
        this.hasFinished = true
        this.hasStart = false
        this.gameAreaPointerEvents = 'none';
    },

    updateBackgroundColor() {
        const hue = (this.clickCount * 10) % 360;
        const saturation = 100;
        const lightness = 50;
        this.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },

    animateClickCount() {
        this.clickCount.style.transform = `scale(1.2) rotate(${Math.random() * 10 - 5}deg)`;
        setTimeout(() => {
            this.clickCount.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
    },

    clickAction() {
        if (this.timeLeft > 0) {
            this.updateBackgroundColor();
            this.animateClickCount();
        }
    }
  }
}
</script>

<style scoped>
#timeline {
    width: 100%;
    height: 10px;
    background-color: #ddd;
    position: fixed;
    top: 0;
    left: 0;
}
#progress {
    width: 100%;
    height: 100%;
    background-color: #4CAF50;
    transition: width 0.1s linear;
    float: left;
}
#game-area {
    width: 100%;
    height: calc(100vh - 10px);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
#click-count {
    font-size: 10vw;
    color: rgba(0, 0, 0, 0.1);
    transition: transform 0.1s ease;
}
#replay-button, #start-button {
    font-size: 1.5em;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
#replay-button {
    display: none;
}
#countdown {
    font-size: 10vw;
    color: #4CAF50;
    display: none;
}
</style>