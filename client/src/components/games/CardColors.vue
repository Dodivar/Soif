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
        <v-btn size="x-large" elevation="8" @click="setChoice('♣️')" :disabled="hasChoose"
          >♣️</v-btn
        >
      </v-col>
    </v-row>
    <!-- {{ choice }}
    <div v-if="state.player.rightAnswer">
      <div v-if="state.player.rightAnswer === choice">
        gagné, 4 gorgés à donner
      </div>
      <span v-else>perdu</span>
    </div> -->
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
// import GiveSoif from '@/components/GiveSoif.vue'

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
      socket.emit('playGame', 'CardColors', val)
    }
  },
  created() {}
}
</script>
