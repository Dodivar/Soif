<template>
  <div>
    <div class="wheel">
      <div class="wheel-wrapper">
        <div class="wheel-item wheel-commone">
          <p></p>
        </div>
        <div class="wheel-item wheel-none">
          <p></p>
        </div>
        <div class="wheel-item wheel-none">
          <p></p>
        </div>
        <div class="wheel-item wheel-none">
          <p></p>
        </div>
        <div class="wheel-item wheel-none">
          <p></p>
        </div>
        <div class="wheel-item wheel-none">
          <p></p>
        </div>
        <div class="wheel-item wheel-none">
          <p></p>
        </div>
        <div class="wheel-item wheel-none">
          <p></p>
        </div>
        <div class="wheel-item wheel-none">
          <p></p>
        </div>
        <div class="wheel-item wheel-none">
          <p></p>
        </div>
        <div class="wheel-item wheel-none">
          <p></p>
        </div>
        <div class="wheel-item wheel-commone">
          <p></p>
        </div>
        <div class="wheel-item wheel-commone">
          <p></p>
        </div>
        <div class="wheel-item wheel-commone">
          <p></p>
        </div>
        <div class="wheel-item wheel-commone">
          <p></p>
        </div>
        <div class="wheel-item wheel-commone">
          <p></p>
        </div>
        <div class="wheel-item wheel-commone">
          <p></p>
        </div>
        <div class="wheel-item wheel-commone">
          <p></p>
        </div>
        <div class="wheel-item wheel-commone">
          <p></p>
        </div>
        <div class="wheel-item wheel-commone">
          <p></p>
        </div>
        <div class="wheel-item wheel-commone">
          <p></p>
        </div>
        <div class="wheel-item wheel-epic">
          <p></p>
        </div>
        <div class="wheel-item wheel-epic">
          <p></p>
        </div>
        <div class="wheel-item wheel-epic">
          <p></p>
        </div>
        <div class="wheel-item wheel-epic">
          <p></p>
        </div>
        <div class="wheel-item wheel-epic">
          <p></p>
        </div>
        <div class="wheel-item wheel-epic">
          <p></p>
        </div>
        <div class="wheel-item wheel-epic">
          <p></p>
        </div>
        <div class="wheel-item wheel-epic">
          <p></p>
        </div>
        <div class="wheel-item wheel-epic">
          <p></p>
        </div>
        <div class="wheel-item wheel-epic">
          <p></p>
        </div>
      </div>
    </div>

    <div class="wheel-pointer"></div>
    <v-btn @click="SpinWheel">LANCER</v-btn>
  </div>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  components: {},
  data() {
    return {
      state,
      speed: 0,
      startTime: new Date(),
      items: 20,
      itemsWidth: 30,
      spinTime: 3000,
      running: false,
      motion: 20,
      resultId: null,
      resultOffset: null
    }
  },
  computed: {},
  mounted() {
    this.el = document.querySelector('.wheel-wrapper')

    window.requestAnimFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
          window.setTimeout(callback, 1000 / 60)
        }
      )
    })()
  },
  methods: {
    SpinWheel() {
      this.resultId = parseInt(Math.random() * this.items)
      this.resultOffset = this.resultId * this.itemsWidth
      this.running = true
      this.gameLoop()
    },
    gameLoop() {
      this.update()
      if (this.speed >= this.items * this.itemsWidth + this.itemsWidth) {
        this.speed = 0
      }
      this.speed += this.motion
      if (this.running) {
        window.requestAnimFrame(this.gameLoop)
      }
    },
    update() {
      var now = new Date()
      this.el.style.transform = 'translateX(-' + this.speed + 'px)'

      if (now - this.startTime > this.spinTime) {
        if (this.speed == this.resultOffset && this.motion == 1) {
          this.running = false
        } else if (this.speed >= this.resultOffset) {
          this.motion = this.motion * 0.99
        }
        return
      }
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.wheel {
  width: 80%;
  height: 50px;
  // padding: 10px 9px;
  margin: 0 auto;
  overflow: hidden;
  &-wrapper {
    // display: flex;
    // flex-wrap: nowrap;
    width: 2000px;
  }
  &-item {
    float: left;
    width: 50px;
    height: 50px;
    color: white;
    text-align: center;
    p {
      line-height: 30px;
      margin: 0;
    }
  }
  &-none {
    background: grey;
  }
  &-commone {
    background: blue;
  }
  &-epic {
    background: violet;
  }
  &-green {
    background: #62c30c;
  }
  &-black {
    background: #3a3a3a;
  }
  &-red {
    background: #e63359;
  }
  &-pointer {
    width: 0;
    height: 50px;
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;
    margin: auto;
    border-left: 2px solid orange;
  }
}
</style>
