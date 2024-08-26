<template>
  <div>
    <div class="wheel">
      <div class="wheel-wrapper">
        <div class="wheel-item wheel-black">
          <p>17</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>18</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>19</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>20</p>
        </div>

        <div class="wheel-item wheel-green">
          <p>0</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>1</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>2</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>3</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>4</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>5</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>6</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>7</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>8</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>9</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>10</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>11</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>12</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>13</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>14</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>15</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>16</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>17</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>18</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>19</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>20</p>
        </div>

        <div class="wheel-item wheel-green">
          <p>0</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>1</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>2</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>3</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>4</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>5</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>6</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>7</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>8</p>
        </div>

        <div class="wheel-item wheel-black">
          <p>9</p>
        </div>

        <div class="wheel-item wheel-red">
          <p>10</p>
        </div>
      </div>
    </div>

    <div class="wheel-pointer"></div>
  </div>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  components: {},
  data() {
    return {
      state
    }
  },
  computed: {},
  mounted() {
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

    //will be passed in: 20 = number of items
    var resultId = parseInt(Math.random() * 20)

    var wheel = this.SpinWheel(resultId)
  },
  methods: {
    SpinWheel(id) {
      var _this = this

      _this.el = document.querySelector('.wheel-wrapper')
      _this.speed = 0
      _this.startTime = new Date()
      _this.items = 100
      _this.itemsWidth = 50
      _this.spinTime = 3000
      _this.running = false
      _this.motion = 20
      _this.resultId = id
      _this.resultOffset = null

      _this.setup = function () {
        _this.resultOffset = _this.resultId * _this.itemsWidth
        _this.loop()
      }

      _this.loop = function () {
        _this.running = true
        ;(function gameLoop() {
          _this.update()
          if (_this.speed >= _this.items * _this.itemsWidth + _this.itemsWidth) {
            _this.speed = 0
          }
          _this.speed += _this.motion
          if (_this.running) {
            window.requestAnimFrame(gameLoop)
          }
        })()
      }

      _this.update = function () {
        var now = new Date()
        _this.el.style.css({
          transform: 'translateX(-' + _this.speed + 'px)'
        })
        if (now - _this.startTime > _this.spinTime) {
          if (_this.speed == _this.resultOffset && _this.motion == 1) {
            _this.running = false
          } else if (_this.speed >= _this.resultOffset) {
            _this.motion = _this.motion * 0.99
          }
          return
        }
      }

      _this.init = function () {
        _this.setup()
      }

      _this.init()

      return _this
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.wheel {
  width: 470px;
  height: 50px;
  padding: 10px 9px;
  margin: 0 auto;
  overflow: hidden;
  &-wrapper {
    width: 1950px;
  }
  &-item {
    float: left;
    width: 50px;
    height: 30px;
    color: white;
    text-align: center;
    p {
      line-height: 30px;
      margin: 0;
    }
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
