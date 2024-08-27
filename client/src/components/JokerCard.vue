<template>
  <v-card class="pa-2 my-3 rounded-lg" elevation="2">
    <div class="d-flex justify-space-between align-center">
      <div>
        <h3 :class="rarity.value">{{ title }}</h3>
        <p>{{ description }}</p>
      </div>
      <!-- <v-btn variant="tonal" color="success" size="large" @click="jockerAction">
        <v-icon v-if="icon">mdi mdi-{{ icon }}</v-icon>
      </v-btn> -->
    </div>
  </v-card>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  props: {
    jokerId: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: 'phone'
    },
    rarity: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    jockerAction() {
      console.log('méthode jocker' + this.idJocker)
    }
  }
}
</script>

<style lang="scss" scoped>
h3 {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;

  &.nothing {
    background: -webkit-linear-gradient(#b6b6b6, #6a6a6a);
    background-clip: text;
  }
  &.common {
    background: -webkit-linear-gradient(#98ec2d, #17ad37);
    background-clip: text;
  }
  &.rare {
    background: -webkit-linear-gradient(#21d4fd, #2152ff);
    background-clip: text;
  }
  &.epic {
    background: -webkit-linear-gradient(#d400ff, #580fa1);
    background-clip: text;
  }
  &.legendary {
    background: -webkit-linear-gradient(#fbcf33, #f53939);
    background-clip: text;
  }
}
</style>
