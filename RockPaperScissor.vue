<template>
  <div id="game-container">
    <Timer :time="10" @end-timer="setChoice('🥴')"></Timer>
    <div
        id="choice-container"
        class="d-flex-flex-container flex-columns text-center justify-space-between"
      >
      <h2>Round {{ round }}</h2>

      <!-- OPPONENTS -->
        <div class="d-f-flex justify-space-between">
          <PlayerAvatar
            :player="state.player"
            :avatar-size="60"
            :show-pseudo="true"
          ></PlayerAvatar>
          <h3>VS</h3>
          <PlayerAvatar
            :player="oponnent"
            :avatar-size="60"
            :show-pseudo="true"
          ></PlayerAvatar>
        </div>

        <!-- MESSAGES -->
        <div>
          <h3>{{ winNumber }} - {{ looseNumber }}</h3>
          <p>{{ message }}</p>
        </div> 

        <!-- CHOICES -->
        <v-sheet class="bg-red" @click="setChoice">👊</v-sheet>
        <v-sheet class="bg-blue" @click="setChoice">✋</v-sheet>
        <v-sheet class="bg-green" @click="setChoice">✌️</v-sheet>
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
    }
  },
  watch: {
    "opponentData.choice"(newVal) {
      if (this.choice === null) return
      this.checkFight()
    }
  },
  computed: {
    opponentData() {
      return state.room.actualGame.opponents[socket.id]
    }
  },
  created() {
    this.oponnent = this.opponentData
  },
  methods: {
    getOpponentChoice() {
      return this.opponentData.choice[this.round - 1]
    },

    setChoice(e) {
      this.chocie = e.target.innerHTML
      socket.emit('RockPaperScissor:SetChoice', e.target.innerHTML)
      this.checkFight()
    },

    checkFight() {
      const oppChoice = getOpponentChoice()
      if (!oppChoice) return

      let result = null

      switch(this.choice) {
        case "👊":
          if (oppChoice === "👊")
            result = "equality"
          if (oppChoice === "✋")
            result = "loose"
          if (oppChoice === "✌️")
            result = "win"
        case "✋":
          if (oppChoice === "👊")
            result = "win"
          if (oppChoice === "✋")
            result = "equality"
          if (oppChoice === "✌️")
            result = "loose"
        case "✌️":
          if (oppChoice === "👊")
            result = "loose"
          if (oppChoice === "✋")
            result = "win"
          if (oppChoice === "✌️")
            result = "equality"
      }
      
      this.updateScore(result)
      this.updateMessage(this.choice, oppChoice, result)
    },

    updateScore(fightResult) {
      this.round++
      switch(fightResult) {
        case "loose":
          looseNumber++
          break;
        case "win":
          winNumber++
          break;
        case "equality":
        default:
          break;
      }

      this.choice = null

      if (this.winNumber === 3 || this.looseNumber === 3) {
        this.message = `C'est terminé, tu as ${this.winNumber === 3 ? "gagné" : "perdu"} !`
        setTimeout(() => {
          socket.emit('Game:PlayGame', this.winNumber === 3)
        }, 2000)
      }
    },

    updateMessage(player, opponent, result) {
      const fightResult = result === "win" ? "tu gagnes" : "loose" ? "tu perds" : "égalité"
      this.message = `${player} contre ${opponent}, ${fightResult} !`
    },
  },
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
