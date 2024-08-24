<template>
  <v-container>
    <Timer :time="10" @end-timer="setChoice('Trop bourré pour répondre')"></Timer>

    <div class="d-flex align-center justify-space-around mb-10">
      <v-sheet
        class="text-black d-flex align-center justify-center cursor-pointer text-center"
        :height="150"
        :width="150"
        elevation="10"
        @click="setChoice('♠️')"
        :disabled="hasChoose"
        >♠️</v-sheet
      >

      <v-sheet
        class="text-red d-flex align-center justify-center cursor-pointer"
        :height="150"
        :width="150"
        elevation="10"
        @click="setChoice('♥')"
        :disabled="hasChoose"
        >♥</v-sheet
      >
    </div>
    <div class="d-flex align-center justify-space-around">
      <v-sheet
        class="text-red d-flex align-center justify-center cursor-pointer"
        :height="150"
        :width="150"
        elevation="10"
        @click="setChoice('♦')"
        :disabled="hasChoose"
        >♦</v-sheet
      >
      <v-sheet
        class="text-black d-flex align-center justify-center cursor-pointer"
        :height="150"
        :width="150"
        elevation="10"
        @click="setChoice('♣️')"
        :disabled="hasChoose"
        >♣️</v-sheet
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

<style scoped>
.v-sheet {
  font-size: 8em;
}
</style>
