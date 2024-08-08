<template>
  <div id="countdown" v-if="countdown > 0">
    {{ countdown }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      countdown: null
    }
  },
  props: {
    countdownNumber: {
      type: Number,
      default: 3
    }
  },
  created() {
    this.countdown = this.countdownNumber
  },
  mounted() {
    this.startCountdown()
  },
  methods: {
    startCountdown() {
      const countdownInterval = setInterval(() => {
        this.countdown--

        if (this.countdown === 0) {
          clearInterval(countdownInterval)
          this.$emit('countdown-end')
        }
      }, 1000)
    }
  }
}
</script>

<style>
#countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10rem;
  font-weight: bold;
  color: white;
  z-index: 10;
}
</style>
