<template>
  <div class="ma-5">
    <div class="ui-wheel-of-fortune w-100">
      <ul>
        <li class="common">COMMUN</li>
        <li class="nothing">RIEN</li>
        <li class="epic">EPIQUE</li>
        <li class="common">COMMUN</li>
        <li class="nothing">RIEN</li>
        <li class="common">COMMUN</li>
        <li class="nothing">RIEN</li>
        <li class="common">COMMUN</li>
        <li class="rare">RARE</li>
        <li class="common">COMMUN</li>
        <li class="nothing">RIEN</li>
        <li class="common">COMMUN</li>
        <li class="nothing">RIEN</li>
        <li class="epic">EPIQUE</li>
        <li class="rare">RARE</li>
        <li class="nothing">RIEN</li>
        <li class="common">COMMUN</li>
        <li class="legendary">LEGENDAIRE</li>
        <li class="nothing">RIEN</li>
        <li class="rare">RARE</li>
        <li class="nothing">RIEN</li>
        <li class="common">COMMUN</li>
        <li class="nothing">RIEN</li>
        <li class="rare">RARE</li>
        <li class="nothing">RIEN</li>
        <li class="common">COMMUN</li>
        <li class="nothing">RIEN</li>
        <li class="epic">EPIQUE</li>
        <li class="nothing">RIEN</li>
        <li class="rare">RARE</li>
        <li class="nothing">RIEN</li>
        <li class="common">COMMUN</li>
        <li class="nothing">RIEN</li>
        <li class="rare">RARE</li>
        <li class="nothing">RIEN</li>
        <li class="legendary">LEGENDAIRE</li>
      </ul>
      <v-btn @click="launch" :disabled="animation !== null" type="button">SPIN</v-btn>
    </div>
  </div>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  components: {},
  data() {
    return {
      state,
      spin: null,
      wheel: null,
      animation: null,
      previousEndDegree: 0,
      selector: '.ui-wheel-of-fortune'
    }
  },
  computed: {},
  mounted() {
    this.wheelOfFortune()
  },
  methods: {
    wheelOfFortune() {
      const node = document.querySelector(this.selector)
      if (!node) return

      this.spin = node.querySelector('button')
      this.wheel = node.querySelector('ul')
      this.animation = null
      this.previousEndDegree = 0
    },
    launch() {
      if (this.animation) {
        return
        // this.animation.cancel() // Reset the animation if it already exists
      }

      const randomAdditionalDegrees = Math.random() * 360 + 1800
      const newEndDegree = this.previousEndDegree + randomAdditionalDegrees

      this.animation = this.wheel.animate(
        [
          { transform: `rotate(${this.previousEndDegree}deg)` },
          { transform: `rotate(${newEndDegree}deg)` }
        ],
        {
          duration: 4000,
          direction: 'normal',
          easing: 'cubic-bezier(0.440, -0.205, 0.000, 1.130)',
          fill: 'forwards',
          iterations: 1
        }
      )

      this.previousEndDegree = newEndDegree

      setTimeout(this.getPrize, 4000)
    },
    getPrize() {
      // const node = document.querySelector(this.selector)
      // const li = Array.from(node.querySelectorAll('li'))
      // const elementsY = Math.min(...li.map((item) => item.getBoundingClientRect().y))
      // const heighestElement = li.find((e) => e.getBoundingClientRect().y === elementsY)
      const heighestElement = document.elementFromPoint(
        window.innerWidth / 2 + 5,
        window.innerHeight / 3
      )
      const jokerRarity = heighestElement.className
      socket.emit('Game:GetJokerOfRarity', jokerRarity)
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.ui-wheel-of-fortune {
  height: 90vh;

  --_items: 36;
  all: unset;
  aspect-ratio: 1 / 1;
  container-type: inline-size;
  direction: ltr;
  display: grid;
  position: relative;

  &::after {
    aspect-ratio: 1 / cos(10deg);
    background-color: crimson;
    clip-path: polygon(50% 100%, 100% 0, 0 0);
    content: '';
    height: 4cqi;
    position: absolute;
    place-self: start center;
    scale: 1.4;
  }

  & > * {
    position: absolute;
  }

  button {
    aspect-ratio: 1 / 1;
    background: hsla(0, 100%, 50%, 0.8);
    color: white;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    font-size: 5cqi;
    font-weight: bold;
    place-self: center;
    width: 20cqi;
    border-radius: 100px !important;
    height: 60px;
  }

  ul {
    all: unset;
    clip-path: inset(0 0 0 0 round 50%);
    display: grid;
    inset: 0;
    place-content: center start;

    li {
      align-content: center;
      aspect-ratio: 1 / calc(2 * tan(180deg / var(--_items)));
      // background: hsl(calc(360deg / var(--_items) * calc(var(--_idx))), 100%, 75%);
      clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
      display: grid;
      font-size: 5cqi;
      grid-area: 1 / -1;
      padding-left: 1ch;
      rotate: calc(360deg / var(--_items) * calc(var(--_idx) - 1));
      transform-origin: center right;
      user-select: none;
      width: 50cqi;
      color: white;
      text-transform: uppercase;
      font-size: 18px;

      &.nothing {
        background-image: linear-gradient(310deg, #6a6a6a, #b6b6b6) !important;
      }
      &.common {
        background-image: linear-gradient(310deg, #17ad37, #98ec2d) !important;
      }
      &.rare {
        background-image: linear-gradient(310deg, #2152ff, #21d4fd) !important;
      }
      &.epic {
        background-image: linear-gradient(310deg, #580fa1, #d400ff) !important;
      }
      &.legendary {
        background-image: linear-gradient(310deg, #f53939, #fbcf33) !important;
      }

      &:nth-of-type(1) {
        --_idx: 1;
      }
      &:nth-of-type(2) {
        --_idx: 2;
      }
      &:nth-of-type(3) {
        --_idx: 3;
      }
      &:nth-of-type(4) {
        --_idx: 4;
      }
      &:nth-of-type(5) {
        --_idx: 5;
      }
      &:nth-of-type(6) {
        --_idx: 6;
      }
      &:nth-of-type(7) {
        --_idx: 7;
      }
      &:nth-of-type(8) {
        --_idx: 8;
      }
      &:nth-of-type(9) {
        --_idx: 9;
      }
      &:nth-of-type(10) {
        --_idx: 10;
      }
      &:nth-of-type(11) {
        --_idx: 11;
      }
      &:nth-of-type(12) {
        --_idx: 12;
      }
      &:nth-of-type(13) {
        --_idx: 13;
      }
      &:nth-of-type(14) {
        --_idx: 14;
      }
      &:nth-of-type(15) {
        --_idx: 15;
      }
      &:nth-of-type(16) {
        --_idx: 16;
      }
      &:nth-of-type(17) {
        --_idx: 17;
      }
      &:nth-of-type(18) {
        --_idx: 18;
      }
      &:nth-of-type(19) {
        --_idx: 19;
      }
      &:nth-of-type(20) {
        --_idx: 20;
      }
      &:nth-of-type(21) {
        --_idx: 21;
      }
      &:nth-of-type(22) {
        --_idx: 22;
      }
      &:nth-of-type(23) {
        --_idx: 23;
      }
      &:nth-of-type(24) {
        --_idx: 24;
      }
      &:nth-of-type(25) {
        --_idx: 25;
      }
      &:nth-of-type(26) {
        --_idx: 26;
      }
      &:nth-of-type(27) {
        --_idx: 27;
      }
      &:nth-of-type(28) {
        --_idx: 28;
      }
      &:nth-of-type(29) {
        --_idx: 29;
      }
      &:nth-of-type(30) {
        --_idx: 30;
      }
      &:nth-of-type(31) {
        --_idx: 31;
      }
      &:nth-of-type(32) {
        --_idx: 32;
      }
      &:nth-of-type(33) {
        --_idx: 33;
      }
      &:nth-of-type(34) {
        --_idx: 34;
      }
      &:nth-of-type(35) {
        --_idx: 35;
      }
      &:nth-of-type(36) {
        --_idx: 36;
      }
    }
  }
}

/* for demo */
* {
  box-sizing: border-box;
}
body {
  font-family: system-ui, sans-serif;
  padding: 5cqi;
}
</style>
