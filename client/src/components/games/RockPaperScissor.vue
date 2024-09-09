<template>
  <div :id="jokerWheel ? '' : 'game-container'">
    <template v-if="!jokerWheel">
      <div class="d-flex-flex-container flex-columns text-center justify-space-between">
        <h2>Round {{ round }}</h2>

        <!-- OPPONENTS -->
        <div class="d-flex justify-space-between align-center mt-5">
          <PlayerAvatar class="mx-5" :player="state.player" :avatar-size="100"></PlayerAvatar>
          <h1>VS</h1>
          <PlayerAvatar class="mx-5" :player="oponnent" :avatar-size="100"></PlayerAvatar>
        </div>

        <!-- MESSAGES -->
        <div id="messages">
          <h2>{{ winNumber }} - {{ looseNumber }}</h2>
          <p>
            {{ choice ? choice : lastChoice }} contre
            {{ !choice ? opponentChoiceToDisplay : '?' }}
          </p>
          <p>{{ message }}</p>
        </div>
      </div>

      <!-- CHOICES -->
      <div class="w-100 h-100 d-flex-flex-container flex-columns text-center justify-space-between">
        <v-sheet class="bg-red" @click="setChoice('👊')">👊</v-sheet>
        <v-sheet class="bg-blue" @click="setChoice('✋')">✋</v-sheet>
        <v-sheet class="bg-green" @click="setChoice('✌️')">✌️</v-sheet>
      </div>
    </template>
    <JokerWheel v-else />
  </div>
</template>

<script>
import { state, socket } from '@/socket'
import PlayerAvatar from '@/components/PlayerAvatar.vue'
import JokerWheel from './../JokerWheel.vue'

export default {
  components: {
    PlayerAvatar,
    JokerWheel
  },
  data() {
    return {
      state,
      round: 1,
      choice: null,
      winNumber: 0,
      looseNumber: 0,
      oponnent: null,
      canPlay: true,
      message: null,
      hasChoose: false,
      lastChoice: null,
      jokerWheel: false
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
    },
    opponentChoiceToDisplay() {
      return this.opponentData.choice[this.round - 2]
    }
  },
  created() {
    this.oponnent = this.opponentData
    if (!this.oponnent) {
      this.jokerWheel = true
    }
  },
  methods: {
    setChoice(choice) {
      if (this.hasChoose || !this.canPlay) return
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
      this.message = result === 'win' ? 'Gagné !' : result === 'loose' ? 'Perdu...' : 'Egalité'
      // this.message = `${this.lastChoice} contre ${this.getLastOpponentChoice()}, ${fightResult} !`
    },

    getLastOpponentChoice() {
      return this.opponentData.choice[this.round - 2]
    }
  }
}
</script>

<style scoped>
#game-container {
  display: flex;
  flex-direction: column;
}
.v-sheet {
  width: 100%;
  height: 33%;
  user-select: none;
  font-size: 5rem;
  cursor: pointer;
  display: flex;
  align-content: center;
  justify-content: center;
}
.v-sheet:last-child {
  height: 34%;
}
#messages {
  font-size: 2rem;
}
</style>
