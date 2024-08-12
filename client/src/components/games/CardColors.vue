<template>
  <v-container>
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

export default {
  components: {},
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
