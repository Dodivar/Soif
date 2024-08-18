<template>
  <v-container>
    <div class="d-flex">
      <div class="mr-4 w-100">
        <h1>Tu te mets combien ?</h1>
        <h2 id="current-theme">Thème actuel : {{ theme.name }}</h2>
      </div>
      <PlayerAvatar
        :player="playerChooseQuestionNumber"
        :avatar-size="60"
        :show-pseudo="true"
      ></PlayerAvatar>
    </div>

    <div
      class="card-container"
      id="question-cards"
      v-for="(item, idx) in theme.questions"
      :key="idx"
    >
      <v-card
        @click="selectQuestion(idx)"
        :class="
          (playerChooseQuestionNumber.socketId === state.player.socketId && !currentQuestionIdx) ||
          idx === currentQuestionIdx
            ? ''
            : 'disabled'
        "
        :title="idx + 1"
      >
        <v-card-text v-if="currentQuestionIdx === idx">
          {{ item.question }}
          <v-form @submit.prevent>
            <v-text-field
              v-model="userAnswer"
              type="text"
              placeholder="Votre réponse"
              clearable
            ></v-text-field>
            <v-btn class="bg-gradient-success" @click="checkAnswer" type="submit">Soumettre</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import PlayerAvatar from '@/components/PlayerAvatar.vue'

export default {
  components: {
    PlayerAvatar
  },
  data() {
    return {
      state,
      theme: {},
      currentThemeIdx: 0,
      userAnswer: '',
      playerChooseQuestionNumber: {}
    }
  },
  created() {
    this.theme = state.room.actualGame.theme
    this.playerChooseQuestionNumber = state.room.actualGame.playerChooseQuestionNumber
  },
  computed: {
    currentQuestionIdx() {
      return state.room.actualGame.chosenQuestionNumber
    }
  },
  methods: {
    selectQuestion(index) {
      if (
        this.playerChooseQuestionNumber.socketId !== state.player.socketId ||
        this.currentQuestionIdx !== null
      )
        return

      socket.emit('TTMCChosenQuestionNumber', index)
    },

    checkAnswer() {
      // Send score after 2s
      setTimeout(() => {
        socket.emit('playGame', this.userAnswer.toLowerCase())
      }, 2000)
    }
  }
}
</script>

<style scoped>
h1,
h2 {
  color: #2c3e50;
  text-align: center;
}
.card-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}
.v-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}
.v-card:hover:not(.disabled) {
  transform: translateX(5px);
  background-color: #e8f4fd;
}
.v-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#answer-input,
#result,
#next-button {
  margin-top: 20px;
  text-align: center;
}
button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
}
button:hover {
  background-color: #2980b9;
}
input[type='text'] {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
#result {
  font-weight: bold;
  margin-top: 20px;
}
</style>
