<template>
  <v-container class="text-center">
    <Timer :time="60" @end-timer="play('🥴')"></Timer>
    <template v-if="state.player.socketId === playerAskingTheQuestion.socketId">
      <h2>{{ question }}</h2>
      <v-form @submit.prevent>
        <v-text-field
          clearable
          label="Ta réponse"
          v-model="playerAskingTheQuestionAnswer"
        ></v-text-field>
        <v-btn
          class="w-100 bg-gradient-success text-white text-h5 rounded-xl my-5"
          elevation="3"
          type="submit"
          @click="validPersonnalAnswer"
          >VALIDER</v-btn
        >
      </v-form>
    </template>
    <template v-else>
      <PlayerAvatar :player="playerAskingTheQuestion" :size="160" :show-pseudo="true" />
      <h2 class="mt-2">{{ question }}</h2>

      <v-form class="ma-5" @submit.prevent>
        <v-text-field clearable label="Ta réponse" v-model="playerAnswer"></v-text-field>
        <v-btn
          class="w-100 bg-gradient-success text-white text-h5 rounded-xl my-5"
          elevation="3"
          type="submit"
          @click="play(playerAnswer.trim().toLowerCase())"
          >VALIDER</v-btn
        >
      </v-form>
    </template>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import PlayerAvatar from '@/components/PlayerAvatar.vue'
import Timer from '@/components/Timer.vue'

export default {
  components: {
    PlayerAvatar,
    Timer
  },
  data() {
    return {
      state,
      question: null,
      playerAnswer: '',
      playerAskingTheQuestion: null,
      playerAskingTheQuestionAnswer: null
    }
  },
  created() {
    this.question = state.room.actualGame.question
    this.playerAskingTheQuestion = state.room.actualGame.playerAskingTheQuestion
  },
  computed: {},
  methods: {
    validPersonnalAnswer() {
      socket.emit('PersonnalAnswer', this.playerAskingTheQuestionAnswer.trim().toLowerCase())
    },
    play(answer) {
      socket.emit('Game:PlayGame', answer)
    }
  }
}
</script>
