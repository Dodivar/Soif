<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn
          size="x-large"
          elevation="8"
          @click="setChoice('red')"
          :disabled="hasChoose"
          color="red-darken-1"
          >RED</v-btn
        >
      </v-col>
      <v-col cols="auto">
        <v-btn
          size="x-large"
          elevation="8"
          @click="setChoice('black')"
          :disabled="hasChoose"
          color="grey-darken-4"
          >BLACK</v-btn
        >
      </v-col>
    </v-row>
    <!-- {{ choice }}
    <div v-if="state.player.rightAnswer">
      <div v-if="state.player.rightAnswer === choice">gagné, 2 gorgés à donner</div>
      <span v-else>perdu</span>
    </div> -->
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
      socket.emit('playGame', 'RedOrBlack', val)
    }
  },
  created() {}
}
</script>
