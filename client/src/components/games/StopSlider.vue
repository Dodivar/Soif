<template>
  <v-container class="d-flex flex-column align-center">
    <Timer :time="10" @end-timer="stopSlider"></Timer>
    <v-slider
      direction="vertical"
      :min="-50"
      :max="50"
      :color="color"
      :ticks="tickLabels"
      show-ticks="always"
      :model-value="sliderValue"
      :thumb-size="24"
    ></v-slider>

    <v-btn
      class="w-100 ma-5 position-fixed bottom-0 bg-gradient-success rounded-xl text-white"
      @click="stopSlider"
      >STOP</v-btn
    >
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import Timer from '@/components/Timer.vue'

export default {
  components: { Timer },
  data() {
    return {
      state,
      score: null,
      sliderValue: -50,
      interval: null,
      tickLabels: {
        '-50': '0',
        0: '100',
        50: '0'
      }
    }
  },
  methods: {
    stopSlider() {
      clearInterval(this.interval)
      let double = this.sliderValue * 2
      let negValue = double < 0 ? double : -double
      this.score = Math.round(negValue + 100)
      // Send score after 2s
      setTimeout(() => {
        socket.emit('playGame', this.score)
      }, 1000)
    }
  },
  created() {
    var velocity = 10
    var goUp = true

    this.interval = setInterval(() => {
      if (this.sliderValue >= 49) {
        goUp = false
      } else if (this.sliderValue <= -49) {
        goUp = true
      }

      var value = Math.abs(Math.abs(this.sliderValue) - 50)
      velocity = value === 0 ? 1 : value * 0.5

      if (goUp) this.sliderValue += 1 * velocity
      else this.sliderValue -= 1 * velocity
    }, 100)
  },
  computed: {
    color() {
      if (this.sliderValue < -30 || this.sliderValue > 30) return 'red'
      if (this.sliderValue < -20 || this.sliderValue > 20) return 'orange'
      if (this.sliderValue < -10 || this.sliderValue > 10) return 'yellow'
      return 'green'
    }
  }
}
</script>

<style scoped>
.v-slider {
  transition: color 0.1s linear;
}
</style>
