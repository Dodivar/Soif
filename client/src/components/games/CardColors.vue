<template>
  <v-container>
    <Timer :time="10" @end-timer="socket.emit('playGame', 'Trop bourré pour répondre')"></Timer>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn size="x-large" elevation="8" @click="setChoice('♠️')" :disabled="hasChoose"
          >♠️</v-btn
        >
      </v-col>
      <v-col cols="auto">
        <v-btn size="x-large" elevation="8" @click="setChoice('❤️')" :disabled="hasChoose"
          >❤️</v-btn
        >
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn size="x-large" elevation="8" @click="setChoice('🔶')" :disabled="hasChoose"
          >🔶</v-btn
        >
      </v-col>
      <v-col cols="auto">
        <v-btn
          size="x-large"
          elevation="8"
          class="pa-5"
          @click="setChoice('♣️')"
          :disabled="hasChoose"
          >♣️</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import Timer from '@/components/Timer.vue'

export default {
  components: {
    Timer
  },
  data() {
    return {
      state,
      choice: null
    }
  },
  computed: {
    hasChoose() {
      return this.choice != null
    }
  },
  methods: {
    setChoice(val) {
      this.choice = val
      socket.emit('playGame', val)
    }
  },
  created() {}
}
</script>
