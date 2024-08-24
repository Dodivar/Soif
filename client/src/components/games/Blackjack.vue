<template>
  <div id="game-container">
    <Timer v-if="started && !hasStand" :time="20" @end-timer="stand"></Timer>

    <div id="deck"></div>
    <div id="dealer-hand" class="hand"></div>
    <div id="player-hand" class="hand"></div>
    <div id="player-score" class="score text-white text-h5">
      <p>Pari : {{ currentBet }}</p>
      <p>Score : {{ playerScore }}</p>
    </div>
    <div id="dealer-score" class="score text-white text-h5">Banque : {{ dealerScore }}</div>

    <div v-if="started" id="controls" class="d-flex flex-column justify-space-between">
      <v-btn id="hit" elevation="10" size="x-large" :disabled="gameOver" @click="hit">Tirer</v-btn>
      <v-btn
        id="double"
        elevation="10"
        size="x-large"
        :disabled="gameOver || playerHand.length > 2"
        @click="double"
        >Doubler</v-btn
      >
      <v-btn id="stand" elevation="10" size="x-large" :disabled="gameOver" @click="stand"
        >Rester</v-btn
      >
      <!-- <v-btn id="split" @click="split">Séparer</v-btn> -->
    </div>
    <v-btn v-else id="place-bet" elevation="10" size="x-large" @click="startNewGame"
      >Tirer les cartes</v-btn
    >

    <v-alert
      v-if="message"
      class="position-fixed top-50"
      elevation="24"
      :color="hasWin ? 'success' : 'error'"
      :icon="hasWin ? '$success' : '$error'"
      :title="hasWin ? 'Gagné !' : 'Perdu...'"
      :text="message"
    ></v-alert>
  </div>
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
      deck: [],
      suits: ['♠', '♥', '♦', '♣'],
      values: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
      playerHand: [],
      dealerHand: [],
      playerScore: 0,
      dealerScore: 0,
      gameOver: false,
      currentBet: 2,
      message: null,
      started: false,
      hasStand: false
    }
  },

  methods: {
    createDeck() {
      this.deck.length = 0
      for (let suit of this.suits) {
        for (let value of this.values) {
          this.deck.push({ suit, value })
        }
      }
    },

    shuffleDeck() {
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
      }
    },

    dealCard(hand, isDealer = false) {
      const card = this.deck.pop()
      hand.push(card)
      this.animateCard(card, isDealer)
      return card
    },

    calculateScore(hand) {
      let score = 0
      let aceCount = 0

      for (let card of hand) {
        if (card.value === 'A') {
          aceCount++
          score += 11
        } else if (['J', 'Q', 'K'].includes(card.value)) {
          score += 10
        } else {
          score += parseInt(card.value)
        }
      }

      while (score > 21 && aceCount > 0) {
        score -= 10
        aceCount--
      }

      return score
    },

    updateScores() {
      this.playerScore = this.calculateScore(this.playerHand)
      this.dealerScore = this.calculateScore(this.dealerHand)
    },

    animateCard(card, isDealer) {
      const cardElement = document.createElement('div')
      cardElement.className = 'card elevation-8'
      cardElement.textContent = `${card.value}${card.suit}`
      cardElement.style.color = ['♥', '♦'].includes(card.suit) ? 'red' : 'black'

      const deck = document.getElementById('deck')
      const deckRect = deck.getBoundingClientRect()
      console.log(deckRect)
      const table = document.getElementById('game-container')
      const tableRect = table.getBoundingClientRect()

      cardElement.style.position = 'absolute'
      cardElement.style.left = `${deckRect.left - tableRect.left}px`
      cardElement.style.top = `${deckRect.top - tableRect.top}px`

      const hand = isDealer
        ? document.getElementById('dealer-hand')
        : document.getElementById('player-hand')
      hand.appendChild(cardElement)

      setTimeout(() => {
        cardElement.style.position = 'relative'
        cardElement.style.left = '0'
        cardElement.style.top = '0'
      }, 50)
    },

    checkBlackjack() {
      if (this.playerScore === 21) {
        this.endGame('Blackjack ! Vous gagnez !', true)
      } else if (this.dealerScore === 21) {
        this.endGame('La banque a un Blackjack, vous perdez.', false)
      }
    },

    endGame(message, win) {
      this.gameOver = true
      this.hasWin = win
      this.message = message
      this.snackbar = true

      // this.updateScores()

      setTimeout(() => {
        socket.emit('playGame', { win, soif: this.currentBet })
      }, 2000)
    },

    hit() {
      this.dealCard(this.playerHand)
      this.updateScores()

      if (this.playerScore > 21) {
        this.endGame('Vous avez dépassé 21, vous perdez.', false)
      }
    },

    stand() {
      this.hasStand = true
      this.gameOver = true

      const dealerDraw = setInterval(() => {
        if (this.dealerScore < 17) {
          this.dealCard(this.dealerHand, true)
          this.updateScores()
        } else {
          clearInterval(dealerDraw)
          if (this.dealerScore > 21) {
            this.endGame('La banque a dépassé 21, vous gagnez !', true)
          } else if (this.dealerScore > this.playerScore) {
            this.endGame('La banque a un meilleure score.', false)
          } else if (this.dealerScore < this.playerScore) {
            this.endGame('Vous gagnez !', true)
          } else {
            this.endGame("Égalité, c'est perdu", false)
          }
        }
      }, 1000)
    },

    double() {
      this.currentBet *= 2
      this.hit()
      if (!this.gameOver) {
        this.stand()
      }
    },

    startNewGame() {
      this.started = true
      this.gameOver = false

      this.createDeck()
      this.shuffleDeck()

      this.dealCard(this.playerHand)
      this.dealCard(this.dealerHand, true)
      this.dealCard(this.playerHand)
      // this.dealCard(this.dealerHand, true)

      this.updateScores()

      this.checkBlackjack()
    }
  },
  created() {}
}
</script>

<style>
#game-container {
  background-color: #27ae60;
  position: relative;
}

#table {
  width: 100%;
  height: 50vh;
  min-height: 300px;
  background-color: #27ae60;
  border-radius: 50px;
  position: relative;
  margin-bottom: 20px;
}
.hand {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  flex-wrap: wrap;
}
#dealer-hand {
  top: 20px;
}
#player-hand {
  bottom: 20px;
}
.card {
  width: 100px;
  height: 150px;
  background-color: white;
  border-radius: 5px;
  margin: 0 5px 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: black;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: all 0.5s ease;
  background-size: cover;
  background-position: center;
  font-size: 2.5em;
}
#controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

#message {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}
#bet-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
#bet-amount {
  font-size: 18px;
  padding: 5px;
  width: 100px;
}
#deck {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  width: 60px;
  height: 90px;
  background-color: #e74c3c;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.score {
  position: absolute;
  font-size: 18px;
  font-weight: bold;
}
#player-score {
  bottom: 200px;
  left: 10px;
}
#dealer-score {
  top: 200px;
  left: 10px;
}
/* @media (max-width: 600px) {
  #table {
    height: 40vh;
    min-height: 250px;
  }
  .card {
    width: 40px;
    height: 60px;
    font-size: 14px;
  }
  #deck {
    width: 40px;
    height: 60px;
  }
  .score {
    font-size: 14px;
  }
  button {
    padding: 8px 16px;
    font-size: 14px;
  }
} */
</style>
