<template>
  <v-container class="text-center">
    <Timer :time="10" @end-timer="userAnswer('🥴')"></Timer>
    <h1>Tu préfères ?</h1>
    <div class="d-flex flex-column align-center justify-space-around ma-5">
      <v-sheet
        :class="
          (qstChoose === question1 ? 'bg-gradient-success' : '') +
          ' text-center pa-5 rounded-lg my-5'
        "
        elevation="5"
        @click="userAnswer(question1)"
      >
        <h2>
          <i>{{ question1 }}</i>
        </h2>
      </v-sheet>
      <h4><i>OU</i></h4>
      <v-sheet
        :class="
          (qstChoose === question2 ? 'bg-gradient-success' : '') +
          ' text-center pa-5 rounded-lg my-5'
        "
        elevation="5"
        @click="userAnswer(question2)"
      >
        <h2>
          <i>{{ question2 }}</i>
        </h2>
      </v-sheet>
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
      question1: null,
      question2: null,
      qstChoose: null
    }
  },
  created() {
    this.question1 = state.room.actualGame.questions[1]
    this.question2 = state.room.actualGame.questions[2]
  },
  computed: {},
  methods: {
    userAnswer(question) {
      if (this.qstChoose !== null) return
      this.qstChoose = question
      setTimeout(() => {
        socket.emit('Game:PlayGame', question)
      }, 2000)
    }
  }
}
</script>

<style scoped>
.v-sheet {
  transition: all 1s ease-out;
}
</style>
