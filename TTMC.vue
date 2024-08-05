<template>
  <v-container>
    <h1>Quiz Multi-thèmes Avancé</h1>
  <h2 id="current-theme">Thème actuel : {{ theme.name }}</h2>
  
  <div class="card-container" id="question-cards" v-for="(item, idx) in theme.questions">
    <v-card @click="selectQuestion(idx)" :disabled="hasSelect">

      <div class="card-number">{{ idx }}</div>

      <div v-if="currentQuestion === idx">
        <div class="card-question" v-if="hasSelect">
          {{ item.question }}
          
          <div v-if="!hasAnswered">
            <v-text-field v-model="userAnswer" type="text" placeholder="Votre réponse" hint="La casse n'est pas importante" clearable></v-text-field>
            <v-btn @click="checkAnswer">Soumettre</v-btn>
          </div>
          <div class="card-response" v-else>
            <span v-if="correctAnswer" style="color: green">Correct ! La réponse est bien :</span>
            <span v-else style="color: red">Incorrect. La bonne réponse était :</span>
            {{ item.answer }}
          </div>
        </div>
      </div>
      
    </v-card>
  </div>

  <div v-if="hasAnswered">
    <div id="next-button">
      <v-btn @click="nextTheme">Thème suivant</v-btn>
    </div>
  </div>
  
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import { TtmcThemes } from './../../assets/ttmc'

export default {
  data() {
    return {
      state,
      theme: {},
      currentThemeIdx: 0,
      currentQuestion: null,
      hasSelect: false,
      hasAnswered: false,
      correctAnswer: false,
      userAnswer: null
    }
  },
  created() {
    this.theme = TtmcThemes[this.currentThemeIdx]
  },
  methods: {
    // createCards() {
    //   const container = document.getElementById('question-cards');
    //   container.innerHTML = '';
      
    //   for (let i = 0; i < 10; i++) {
    //     const card = document.createElement('div');
    //     card.className = 'card';
    //     card.innerHTML = `
    //       <div class="card-number">${i + 1}</div>
    //       <div class="card-question">Question ${i + 1}</div>
    //     `;
    //     card.onclick = () => selectQuestion(i);
    //     container.appendChild(card);
    //   }
    // },

    selectQuestion(index) {
      this.hasSelect = true
      if (this.currentQuestion !== null) return;
      
      this.currentQuestion = index;
      // const cards = document.querySelectorAll('.card');
      
      // cards.forEach((card, i) => {
      //   if (i === index) {
      //     card.querySelector('.card-question').textContent = themes[this.currentThemeIdx].questions[i].question;
      //   } else {
      //     card.classList.add('disabled');
      //   }
      // });
      
      // document.getElementById('answer-input').style.display = 'block';
    },

    checkAnswer() {
      this.hasAnswered = true
      const correctAnswer = this.theme.questions[this.currentQuestion].answer.toLowerCase();
      this.correctAnswer = this.userAnswer === correctAnswer;
      
      // document.getElementById('next-button').style.display = 'block';
      // document.getElementById('answer-input').style.display = 'none';
    },

    nextTheme() {
      this.hasSelect = false
      this.hasAnswered = false
      this.correctAnswer = false
      this.userAnswer = null

      this.currentThemeIdx = (this.currentThemeIdx + 1) % themes.length;
      this.currentQuestion = null;
      this.theme = TtmcThemes[this.currentThemeIdx]
    }
  }
}
</script>

<style scoped>
h1, h2 {
    color: #2c3e50;
    text-align: center;
  }
  .card-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }
  .card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  .card:hover:not(.disabled) {
    transform: translateX(5px);
    background-color: #e8f4fd;
  }
  .card.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .card-number {
    font-size: 24px;
    font-weight: bold;
    margin-right: 15px;
    min-width: 30px;
  }
  .card-question {
    font-size: 16px;
  }
  #answer-input, #result, #next-button {
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
  input[type="text"] {
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