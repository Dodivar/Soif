<template>
  <v-container class="text-center">
    <Timer v-if="readyToGuess && !readyToVote" :time="60" @end-timer="setReadyToVote"></Timer>

    <h2 class="ma-5">Devine tête</h2>

    <!-- VOTE -->
    <template v-if="readyToVote">
      <div v-if="!imGuessing">
        <h3>Penses-tu que {{ playerGuessing.pseudo }} as gagné ?</h3>
        <div v-if="!hasVoted" class="d-flex justify-space-between mt-5">
          <v-btn class="w-25 bg-gradient-warning text-white" @click="setVote(0)">NON</v-btn>
          <v-btn class="w-25 bg-gradient-success text-white" @click="setVote(1)">OUI</v-btn>
        </div>
      </div>

      <div v-else>
        Les joueurs débattent pour savoir si tu as gagné ou non...
        <div v-if="!hasVoted" class="d-flex justify-space-between mt-5">
          <v-btn class="w-25 bg-gradient-success text-white">{{ playerVoteYes }} OUI</v-btn>
          <v-btn class="w-25 bg-gradient-warning text-white">{{ playerVoteNo }} NON</v-btn>
          <v-btn class="w-25 bg-gradient-info text-white"
            >{{
              state.room.players.length - 1 - state.room.actualGame.playerVotes.length
            }}
            RESTANT</v-btn
          >
        </div>
      </div>
    </template>

    <!-- DESC -->
    <template v-if="!readyToGuess">
      <PlayerAvatar :player="playerGuessing" :avatar-size="120" :show-pseudo="true"></PlayerAvatar>
      <div v-if="!readyToGuess">
        <h3>Tu vas devoir deviner l'image qui sera affiché sur ton téléphone en 1 minute.</h3>
        <h3>Pose des questions qui doivent être répondu uniquement par oui ou par non.</h3>
        <h3>Colle le sur ton front, et appuie lorsque tu es prêt.</h3>
        <v-btn
          class="w-100 bg-gradient-success text-white text-h6 mt-5 rounded-xl"
          @click="setReadyToGuess"
          >PRÊT
        </v-btn>
      </div>
      <div v-else>
        <h3>Va devoir deviner l'image qui sera affiché sur ton téléphone en 1 minute.</h3>
        <h3>Il faudra répondre aux questions uniquement par oui ou par non.</h3>
      </div>
    </template>
    <!-- IMG -->
    <div v-else-if="readyToGuess && imGuessing && !readyToVote">
      <v-img id="guessImg" :src="guessImage"></v-img>
      <v-btn
        class="w-100 bg-gradient-success text-uppercase text-white text-h6 mt-5 rounded-xl"
        @click="setReadyToVote"
        >Terminé</v-btn
      >
    </div>

    <!-- WAIT PLAYER TO GUESS -->
    <div v-else-if="readyToGuess && !readyToVote">
      <PlayerAvatar :player="playerGuessing" :avatar-size="180" :show-pseudo="true"></PlayerAvatar>
      Est en train de deviner son image !
    </div>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import Timer from '@/components/Timer.vue'
import PlayerAvatar from '@/components/PlayerAvatar.vue'

export default {
  components: {
    Timer,
    PlayerAvatar
  },
  data() {
    return {
      state,
      guessImage: null,
      playerGuessing: {},
      imGuessing: false,
      hasVoted: false
    }
  },
  created() {
    this.guessImage = state.room.actualGame.guessImage
    this.playerGuessing = state.room.actualGame.playerGuessing
    this.imGuessing = state.player.socketId === this.playerGuessing.socketId
  },
  computed: {
    readyToGuess() {
      return state.room.actualGame.readyToGuess
    },
    readyToVote() {
      return state.room.actualGame.readyToVote
    },
    playerVoteYes() {
      return state.room.actualGame.playerVotes.filter((e) => e === 1).length
    },
    playerVoteNo() {
      return state.room.actualGame.playerVotes.filter((e) => e === 0).length
    }
  },
  watch: {
    'state.room.actualGame.playerVotes'(newVal) {
      if (newVal.length < state.room.players.length - 1) return
      setTimeout(() => {
        this.playGame()
      }, 2000)
    }
  },
  methods: {
    setReadyToGuess() {
      socket.emit('GuessHead:ReadyToGuess')
    },
    setReadyToVote() {
      socket.emit('GuessHead:ReadyToVote')
    },
    setVote(vote) {
      this.hasVoted = true
      socket.emit('GuessHead:SetVote', vote)
    },

    playGame() {
      if (this.imGuessing) {
        socket.emit('Game:PlayGame', this.playerVoteYes >= this.playerVoteNo)
      } else {
        socket.emit('Game:PlayGame', this.playerVoteYes < this.playerVoteNo)
      }
    }
  }
}
</script>

<style scoped>
#guessImg {
  max-width: 100%;
}
</style>
