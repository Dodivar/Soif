<template>
  <div id="timer">
    <div id="timerBar" :style="{ width: `${timerBarWidth}%` }"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // timerBarWidth: '100%'
    }
  },
  props: {
    timerBarWidth: {
      type: Number,
      default: 100
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style>
#timer {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 10px;
  background-color: #ddd;
}
#timerBar {
  width: 100%;
  height: 100%;
  background-color: #4caf50;
  /* background: linear-gradient(90deg, rgb(241 0 2), rgb(255 110 0), rgb(241 178 0), rgb(49 211 0)); */
  transition: width 0.1s linear;
}
</style>
