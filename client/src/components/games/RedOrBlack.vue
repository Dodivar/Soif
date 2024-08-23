<template>
  <v-container>
    <Timer :time="10" @end-timer="socket.emit('playGame', 'Trop bourré pour répondre')"></Timer>
    <div class="d-flex flex-column align-center justify-space-between">
      <v-btn
        size="x-large"
        elevation="8"
        @click="setChoice('ROUGE')"
        :disabled="hasChoose"
        color="red-darken-1"
        >ROUGE</v-btn
      >
      <v-btn
        size="x-large"
        elevation="8"
        @click="setChoice('NOIR')"
        :disabled="hasChoose"
        color="grey-darken-4"
        >NOIR</v-btn
      >
    </div>
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
