<template>
  <v-container>
    <v-slider
      direction="vertical"
      :min="-50"
      :max="50"
      :model-value="sliderValue"
      disabled
    ></v-slider>

    <v-btn @click="stopSlider">STOP</v-btn>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  components: {},
  data() {
    return {
      state,
      score: null,
      sliderValue: -50,
      interval: null
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
  computed: {}
}
</script>
