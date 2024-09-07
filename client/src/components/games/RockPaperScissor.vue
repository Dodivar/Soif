<template>
  <div id="game-container">
    <Timer :time="60" @end-timer="setChoice('🥴')"></Timer>
    <div
      id="choice-container"
      class="d-flex-flex-container flex-columns text-center justify-space-between"
    >
      <h2>Round {{ round }}</h2>

      <!-- OPPONENTS -->
      <div class="d-flex justify-space-between align-center mt-5">
        <PlayerAvatar
          class="mx-5"
          :player="state.player"
          :avatar-size="100"
          :show-pseudo="true"
        ></PlayerAvatar>
        <h3>VS</h3>
        <PlayerAvatar
          class="mx-5"
          :player="oponnent"
          :avatar-size="100"
          :show-pseudo="true"
        ></PlayerAvatar>
      </div>

      <!-- MESSAGES -->
      <div>
        <p v-if="!this.opponentChoice">En attente du choix de {{ opponentData.pseudo }}</p>
        <p>{{ message }}</p>
        <h3>{{ winNumber }} - {{ looseNumber }}</h3>
      </div>

      <!-- CHOICES -->
      <div class="w-100">
        <v-sheet class="bg-red" @click="setChoice('👊')">👊</v-sheet>
        <v-sheet class="bg-blue" @click="setChoice('✋')">✋</v-sheet>
        <v-sheet class="bg-green" @click="setChoice('✌️')">✌️</v-sheet>
      </div>
    </div>
  </div>
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
      round: 1,
      choice: null,
      win: null,
      winNumber: 0,
      looseNumber: 0,
      oponnent: null,
      canPlay: true,
      message: null,
      hasChoose: false,
      lastChoice: null
    }
  },
  watch: {
    'opponentData.choice'(newVal) {
      if (this.choice === null) return
      this.checkFight()
    }
  },
  computed: {
    opponentData() {
      return state.room.actualGame.opponents[state.player.socketId]
    },
    opponentChoice() {
      return this.opponentData.choice[this.round - 1]
    }
  },
  created() {
    this.oponnent = this.opponentData
  },
  methods: {
    setChoice(choice) {
      if (this.hasChoose && this.canPlay) return
      this.hasChoose = true
      this.choice = choice
      this.lastChoice = choice
      socket.emit('RockPaperScissor:SetChoice', this.choice)
      this.checkFight()
    },

    checkFight() {
      if (!this.opponentChoice) return

      let result = null

      switch (this.choice) {
        case '👊':
          if (this.opponentChoice === '👊') result = 'equality'
          if (this.opponentChoice === '✋') result = 'loose'
          if (this.opponentChoice === '✌️') result = 'win'
          break
        case '✋':
          if (this.opponentChoice === '👊') result = 'win'
          if (this.opponentChoice === '✋') result = 'equality'
          if (this.opponentChoice === '✌️') result = 'loose'
          break
        case '✌️':
          if (this.opponentChoice === '👊') result = 'loose'
          if (this.opponentChoice === '✋') result = 'win'
          if (this.opponentChoice === '✌️') result = 'equality'
          break
      }

      this.updateScore(result)
      this.updateMessage(result)

      this.choice = null
      this.hasChoose = false
    },

    updateScore(fightResult) {
      this.round++
      switch (fightResult) {
        case 'loose':
          this.looseNumber++
          break
        case 'win':
          this.winNumber++
          break
        case 'equality':
        default:
          break
      }

      if (this.winNumber === 3 || this.looseNumber === 3) {
        this.canPlay = false
        this.message = `C'est terminé, tu as ${this.winNumber === 3 ? 'gagné' : 'perdu'} !`
        setTimeout(() => {
          socket.emit('Game:PlayGame', this.winNumber === 3)
        }, 2000)
      }
    },

    updateMessage(result) {
      console.log(this.choice, this.lastOpponentChoice)
      const fightResult =
        result === 'win' ? 'tu gagnes' : result === 'loose' ? 'tu perds' : 'égalité'
      this.message = `${this.lastChoice} contre ${this.getLastOpponentChoice()}, ${fightResult} !`
    },

    getLastOpponentChoice() {
      return this.opponentData.choice[this.round - 2]
    }
  }
}
</script>

<style scoped>
#choice-container {
  flex: 1 1 auto;
}
.v-sheet {
  width: 100%;
  user-select: none;
  font-size: 5rem;
  cursor: pointer;
}
</style>
