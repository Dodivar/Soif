<template>
  <v-container class="text-center">
    <template
      v-if="state.player.socketId === state.room.actualGame.playerAskingTheQuestion.socketId"
    >
      <h2>Quel est le nom de ta grand-mère ?</h2>
      <template v-if="state.room.actualGame.playerAskingTheQuestionAnswer">
        <v-text-field
          clearable
          label="Ta réponse"
          v-model="playerAskingTheQuestionAnswer"
        ></v-text-field>
        <v-btn class="bg-gradient-success">Valider</v-btn>
      </template>
      <h3 v-else>En attente des réponses...</h3>
    </template>
    <template v-else>
      <h2>Quel est le nom de la grand-mère à :</h2>
      <AvatarProfil :player="state.room.actualGame.playerAskingTheQuestion" />
      <v-text-field clearable label="Ta réponse" v-model="playerAnswer"></v-text-field>
    </template>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  components: {},
  data() {
    return {
      state,
      playerAskingTheQuestionAnswer: null,
      playerAnswer: null
    }
  },
  computed: {},
  methods: {},
  created() {}
}
</script>
