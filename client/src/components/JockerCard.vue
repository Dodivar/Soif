<template>
  <v-card class="pa-2 my-3 rounded-lg" elevation="2">
    <div class="d-flex justify-space-between align-center">
      <div>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </div>
      <v-btn variant="tonal" color="success" size="large" @click="jockerAction">
        <v-icon>mdi mdi-{{ icon }}</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  props: {
    idJocker: {
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

<style scoped></style>
