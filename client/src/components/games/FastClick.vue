<template>
  <div :style="{ 'background-color': backgroundColor }" @click="clickAction" id="game-container">
    <countdown @countdown-end="startGame"></countdown>
    <Timer v-if="hasStart" :time="10" @end-timer="endGame()"></Timer>

    <span id="click-count" v-show="hasStart" :style="clickCount.style">
      {{ clickCount.value }}
    </span>
  </div>
</template>

<script>
import { state, socket } from '@/socket'
import countdown from '@/components/Countdown.vue'
import Timer from '@/components/Timer.vue'

export default {
  components: {
    Timer,
    countdown
  },
  data() {
    return {
      state,
      hasStart: false,
      timeLeft: 10,
      // progressBarWidth: '100%',
      backgroundColor: '#f0f0f0',
      clickCount: {
        style: {},
        value: 0
      }
    }
  },
  methods: {
    startGame() {
      this.hasStart = true
    },

    endGame() {
      this.hasStart = false

      // Send score after 2s
      setTimeout(() => {
        socket.emit('playGame', this.clickCount.value)
      }, 2000)
    },

    updateBackgroundColor() {
      const hue = (this.clickCount.value * 10) % 360
      const saturation = 100
      const lightness = 50
      this.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    },

    animateClickCount() {
      this.clickCount.style.transform = `scale(1.2) rotate(${Math.random() * 10 - 5}deg)`
      setTimeout(() => {
        this.clickCount.style.transform = 'scale(1) rotate(0deg)'
      }, 100)
    },

    clickAction() {
      if (!this.hasStart) {
        return
      }
      this.clickCount.value++
      this.updateBackgroundColor()
      this.animateClickCount()
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
  top: 65px;
  left: 0;
}
#progress {
  width: 100%;
  height: 100%;
  background-color: #4caf50;
  transition: width 0.1s linear;
  float: left;
}

#click-count {
  font-size: 10em;
  color: rgba(200, 200, 200, 0.3);
  transition: transform 0.1s ease;
  user-select: none;
}
</style>
