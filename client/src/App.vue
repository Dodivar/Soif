<template>
  <v-app>
    <v-main>
      <StartMenu id="content-app" />
    </v-main>
    <div id="background-app">
      <div class="circle shade1 xxlarge"></div>
      <div class="circle shade2 xlarge"></div>
      <div class="circle shade3 large"></div>
      <div class="circle shade4 medium"></div>
      <div class="circle shade5 small"></div>
    </div>
  </v-app>
</template>

<script>
import StartMenu from './components/StartMenu.vue'

export default {
  components: {
    StartMenu
  },
  data() {
    return {}
  },
  created() {}
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

.v-main {
  // background-color: #afeeff !important;
  // background: radial-gradient(#1027c0, #1388d1);
  background: #3399ff;
}

#content-app {
  position: sticky;
  z-index: 50;
}

.v-alert {
  z-index: 999;
}

#background-app {
  height: 100vh;
  width: 100vw;
  bottom: 0;
  position: absolute;
  overflow: hidden;
  .circle {
    position: absolute;
    border-radius: 50%;
    background: white;
    box-shadow: 0px -5px 12px 0px #508fb9;
  }

  .small {
    width: 200px;
    height: 200px;
    bottom: -100px;
    left: calc(50% - 100px);
    animation: ripple1 12s infinite;
  }

  .medium {
    width: 400px;
    height: 400px;
    bottom: -200px;
    left: calc(50% - 200px);
    animation: ripple2 12s infinite;
    animation-delay: 0.5s;
  }

  .large {
    width: 600px;
    height: 600px;
    bottom: -300px;
    left: calc(50% - 300px);
    animation: ripple3 12s infinite;
    animation-delay: 1s;
  }

  .xlarge {
    width: 800px;
    height: 800px;
    bottom: -400px;
    left: calc(50% - 400px);
    animation: ripple4 12s infinite;
    animation-delay: 1.5s;
  }

  .xxlarge {
    width: 1000px;
    height: 1000px;
    bottom: -500px;
    left: calc(50% - 500px);
    animation: ripple5 12s infinite;
    animation-delay: 2s;
  }

  .shade1 {
    opacity: 0.2;
  }
  .shade2 {
    opacity: 0.5;
  }

  .shade3 {
    opacity: 0.7;
  }

  .shade4 {
    opacity: 0.8;
  }

  .shade5 {
    opacity: 0.9;
  }

  $total: 5;
  @for $i from 1 through $total {
    @keyframes ripple#{$i} {
      0% {
        transform: scale(0.6 + $i / 20);
      }

      50% {
        transform: scale(1 + $i / 20);
      }

      100% {
        transform: scale(0.6 + $i / 20);
      }
    }
  }
}
</style>
