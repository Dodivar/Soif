<template>
  <v-progress-linear
    class="position-fixed top-0 left-0"
    :bg-color="`${color}-lighten-3`"
    :color="color"
    height="6"
    v-model="progressValue"
  ></v-progress-linear>
</template>

<script>
export default {
  data() {
    return {
      progressValue: 100,
      interval: null,
      toReduce: 1
    }
  },
  props: {
    time: {
      type: Number,
      default: 10
    }
  },
  created() {
    this.toReduce = this.progressValue / this.time
  },
  mounted() {
    this.startTimer()
  },
  computed: {
    color() {
      if (this.progressValue <= 20) return 'red'
      if (this.progressValue < 40) return 'orange'
      if (this.progressValue < 60) return 'yellow'
      return 'green'
    }
  },
  methods: {
    startTimer() {
      setTimeout(() => {
        this.progressValue -= this.toReduce
        if (this.progressValue > 0) {
          this.startTimer()
          return
        }
        this.endTimer()
      }, 1000)
    },
    endTimer() {
      this.$emit('end-timer')
    }
  }
}
</script>
