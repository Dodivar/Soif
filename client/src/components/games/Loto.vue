<template>
  <div id="game-container-loto">
    <h1>Loto</h1>
    <p v-if="selectedNumber === null">Choisissez un numéro entre 1 et 100 :</p>
    <div id="number-grid" w-tid="11"></div>
    <div id="message">{{ message }}</div>
    <div id="drawn-numbers"></div>
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
      numbers: [],
      ballsDraw: [],
      selectedNumber: null,
      message: null,
      numberGrid: null,
      drawnNumbersDiv: null,
      hasWin: null
    }
  },
  computed: {
    hasChoose() {
      return this.choice != null
    }
  },
  mounted() {
    this.numberGrid = document.getElementById('number-grid')
    this.drawnNumbersDiv = document.getElementById('drawn-numbers')
    this.initializeGame()
  },
  watch: {
    'state.room.actualGame.drawnBalls'(newValue) {
      if (newValue.length === 0) return

      let i = 0
      // Reaveal 3 new balls every 2 sec
      const draw = setInterval(() => {
        const ballsDrawNow = [newValue[i], newValue[i + 1], newValue[i + 2]]
        this.ballsDraw.push(...ballsDrawNow)
        this.revealBalls(ballsDrawNow)

        i += 3

        if (this.hasWin === false) return

        if (ballsDrawNow.includes(this.selectedNumber)) {
          // Loose
          clearInterval(draw)
          this.endGame(false)
        } else {
          const everyDrawnExeptMe = state.room.actualGame.playerBalls.every((e) => {
            if (e === this.selectedNumber) return true
            return this.ballsDraw.includes(e)
          })
          // Win
          if (everyDrawnExeptMe) {
            clearInterval(draw)
            this.endGame(true)
          }
        }

        // Win égalité
        const everyDrawn = state.room.actualGame.playerBalls.every((e) =>
          this.ballsDraw.includes(e)
        )
        if (everyDrawn) {
          clearInterval(draw)
          this.endGame(true)
        }
      }, 3000)
    },
    // Set other balls
    'state.room.actualGame.playerBalls'(newValue) {
      newValue.forEach((id) => {
        if (id === this.selectedNumber) return
        const playerBall = document.getElementById(`ball-${id}`)

        if (playerBall.className.includes('selected-other')) return
        playerBall.classList.add('selected-other')
      })
    }
  },
  methods: {
    initializeGame() {
      this.numbers = Array.from({ length: 100 }, (_, i) => i + 1)

      this.numbers.forEach((num) => {
        const numDiv = document.createElement('div')
        numDiv.classList.add('number')
        numDiv.id = `ball-${num}`
        numDiv.textContent = num
        numDiv.addEventListener('click', () => this.selectNumber(num, numDiv))
        this.numberGrid.appendChild(numDiv)
      })
    },

    selectNumber(num, numDiv) {
      if (this.selectedNumber !== null) return
      if (state.room.actualGame.playerBalls.includes(num)) {
        alert(`La boule ${num} a déjà été choisie`)
        return
      }

      this.selectedNumber = num
      numDiv.classList.add('selected')
      socket.emit('Loto:PlaceBall', num)
    },

    revealBalls(balls) {
      const rowDiv = document.createElement('div')
      rowDiv.classList.add('drawn-row')

      // Delete all draw balls childs
      let child = this.drawnNumbersDiv.firstElementChild
      while (child) {
        this.drawnNumbersDiv.removeChild(child)
        child = this.drawnNumbersDiv.firstElementChild
      }

      balls.forEach((num) => {
        // Append drawn balls
        const ballDiv = document.createElement('div')
        ballDiv.classList.add('drawn-ball')
        ballDiv.textContent = num
        rowDiv.appendChild(ballDiv)

        // Set draw color
        document.getElementById(`ball-${num}`).classList.add('drawn')
      })
      this.drawnNumbersDiv.appendChild(rowDiv)
    },

    endGame(playerWon) {
      if (playerWon) {
        this.message = `Vous êtes le dernier en vie bravo !`
        setTimeout(() => {
          socket.emit('Game:PlayGame', { win: true, ball: this.selectedNumber })
        }, 3000)
      } else {
        this.message = `La boule ${this.selectedNumber} est sortie vous avez perdu`
        this.hasWin = false
        setTimeout(() => {
          socket.emit('Game:PlayGame', { win: false, ball: this.selectedNumber })
        }, 3000)
      }
    }
  },
  created() {}
}
</script>

<style lang="scss">
#game-container-loto {
  position: relative;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  #number-grid {
    display: grid !important;
    grid-template-columns: repeat(10, 1fr);
    gap: 5px;
    margin-bottom: 15px;
    user-select: none;
  }
  .number {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    background: radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0);
    box-shadow:
      1px 1px 3px rgba(0, 0, 0, 0.2),
      inset -1px -1px 3px rgba(0, 0, 0, 0.1);
    font-weight: bold;
    color: #333;
    font-size: 12px;
  }
  .number:hover {
    transform: scale(1.05);
  }
  .number.selected {
    background: radial-gradient(circle at 30% 30%, #4caf50, #45a049);
    color: white;
  }
  .number.selected-other {
    background: radial-gradient(circle at 30% 30%, #4c63af, #202382);
    color: white;
  }
  .number.drawn {
    background: radial-gradient(circle at 30% 30%, #f44336, #8a1717);
    color: white;
  }
  #drawn-numbers {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
  }
  .drawn-row {
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
  }
  .drawn-ball {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0);
    box-shadow:
      1px 1px 3px rgba(0, 0, 0, 0.2),
      inset -1px -1px 3px rgba(0, 0, 0, 0.1);
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px;
    font-weight: bold;
    font-size: 14px;
  }
  #message {
    margin-top: 15px;
    font-weight: bold;
    font-size: 14px;
  }
}
</style>
