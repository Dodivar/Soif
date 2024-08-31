<template>
  <div id="game-container">
    <h1>Loto Simulator</h1>
    <p>Choisissez un numéro entre 1 et 100 :</p>
    <div id="number-grid" w-tid="11">
      <div class="number drawn">1</div>
      <div class="number drawn">2</div>
      <div class="number drawn">3</div>
      <div class="number drawn">4</div>
      <div class="number drawn">5</div>
      <div class="number drawn">6</div>
      <div class="number drawn">7</div>
      <div class="number drawn">8</div>
      <div class="number drawn">9</div>
      <div class="number drawn">10</div>
      <div class="number drawn">11</div>
      <div class="number drawn">12</div>
      <div class="number drawn">13</div>
      <div class="number selected drawn">14</div>
      <div class="number drawn">15</div>
      <div class="number drawn">16</div>
      <div class="number drawn">17</div>
      <div class="number drawn">18</div>
      <div class="number drawn">19</div>
      <div class="number drawn">20</div>
      <div class="number drawn">21</div>
      <div class="number drawn">22</div>
      <div class="number drawn">23</div>
      <div class="number drawn">24</div>
      <div class="number drawn">25</div>
      <div class="number drawn">26</div>
      <div class="number drawn">27</div>
      <div class="number drawn">28</div>
      <div class="number drawn">29</div>
      <div class="number drawn">30</div>
      <div class="number drawn">31</div>
      <div class="number drawn">32</div>
      <div class="number drawn">33</div>
      <div class="number drawn">34</div>
      <div class="number drawn">35</div>
      <div class="number drawn">36</div>
      <div class="number drawn">37</div>
      <div class="number drawn">38</div>
      <div class="number drawn">39</div>
      <div class="number drawn">40</div>
      <div class="number drawn">41</div>
      <div class="number drawn">42</div>
      <div class="number drawn">43</div>
      <div class="number drawn">44</div>
      <div class="number drawn">45</div>
      <div class="number drawn">46</div>
      <div class="number drawn">47</div>
      <div class="number drawn">48</div>
      <div class="number drawn">49</div>
      <div class="number">50</div>
      <div class="number drawn">51</div>
      <div class="number drawn">52</div>
      <div class="number drawn">53</div>
      <div class="number drawn">54</div>
      <div class="number drawn">55</div>
      <div class="number drawn">56</div>
      <div class="number drawn">57</div>
      <div class="number drawn">58</div>
      <div class="number drawn">59</div>
      <div class="number drawn">60</div>
      <div class="number drawn">61</div>
      <div class="number drawn">62</div>
      <div class="number drawn">63</div>
      <div class="number drawn">64</div>
      <div class="number drawn">65</div>
      <div class="number drawn">66</div>
      <div class="number drawn">67</div>
      <div class="number drawn">68</div>
      <div class="number drawn">69</div>
      <div class="number drawn">70</div>
      <div class="number drawn">71</div>
      <div class="number drawn">72</div>
      <div class="number drawn">73</div>
      <div class="number drawn">74</div>
      <div class="number drawn">75</div>
      <div class="number drawn">76</div>
      <div class="number drawn">77</div>
      <div class="number drawn">78</div>
      <div class="number drawn">79</div>
      <div class="number drawn">80</div>
      <div class="number drawn">81</div>
      <div class="number drawn">82</div>
      <div class="number drawn">83</div>
      <div class="number drawn">84</div>
      <div class="number drawn">85</div>
      <div class="number drawn">86</div>
      <div class="number drawn">87</div>
      <div class="number drawn">88</div>
      <div class="number drawn">89</div>
      <div class="number drawn">90</div>
      <div class="number drawn">91</div>
      <div class="number drawn">92</div>
      <div class="number drawn">93</div>
      <div class="number drawn">94</div>
      <div class="number drawn">95</div>
      <div class="number drawn">96</div>
      <div class="number drawn">97</div>
      <div class="number drawn">98</div>
      <div class="number drawn">99</div>
      <div class="number drawn">100</div>
    </div>
    <v-btn id="start-game" disabled>Commencer le tirage</v-btn>
    <div id="drawn-numbers"></div>
    <div id="message">{{ message }}</div>
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
      selectedNumber: null,
      gameInProgress: false,
      message: null
    }
  },
  computed: {
    hasChoose() {
      return this.choice != null
    }
  },
  methods: {
    initializeGame() {
      this.numbers = Array.from({ length: 100 }, (_, i) => i + 1)

      // this.numbers.forEach((num) => {
      //   const numDiv = document.createElement('div')
      //   numDiv.classList.add('number')
      //   numDiv.textContent = num
      //   numDiv.addEventListener('click', () => this.selectNumber(num, numDiv))
      //   this.numberGrid.appendChild(numDiv)
      // })
    },

    selectNumber(num, numDiv) {
      if (this.gameInProgress) return

      if (this.selectedNumber !== null) {
        document.querySelector(`.number.selected`).classList.remove('selected')
      }

      this.selectedNumber = num
      numDiv.classList.add('selected')
      this.startGameButton.disabled = false
    },

    drawNumbers() {
      if (this.numbers.length === 0 || !this.gameInProgress) {
        this.endGame(true)
        return
      }

      let drawnNumbers = []
      for (let i = 0; i < 3 && this.numbers.length > 0; i++) {
        const index = Math.floor(Math.random() * this.numbers.length)
        const drawnNumber = this.numbers.splice(index, 1)[0]
        drawnNumbers.push(drawnNumber)

        const numDiv = document.querySelector(`.number:nth-child(${drawnNumber})`)
        numDiv.classList.add('drawn')
      }

      const rowDiv = document.createElement('div')
      rowDiv.classList.add('drawn-row')

      drawnNumbers.forEach((num) => {
        const ballDiv = document.createElement('div')
        ballDiv.classList.add('drawn-ball')
        ballDiv.textContent = num
        rowDiv.appendChild(ballDiv)
      })

      this.drawnNumbersDiv.appendChild(rowDiv)

      if (drawnNumbers.includes(this.selectedNumber)) {
        this.endGame(false)
      } else {
        setTimeout(this.drawNumbers, 2000) // Pause de 2 secondes entre chaque tour
      }
    },

    endGame(playerWon) {
      this.gameInProgress = false
      if (playerWon) {
        this.message = 'Félicitations ! Vous avez gagné !'
      } else {
        this.message = 'Dommage, vous avez perdu. Votre numéro a été tiré.'
      }
      this.replayButton.style.display = 'block'
    }
  },
  created() {}
}
</script>

<style scoped>
#game-container {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 100%;
  box-sizing: border-box;
}
#number-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 5px;
  margin-bottom: 15px;
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
.number.drawn {
  background: radial-gradient(circle at 30% 30%, #f44336, #d32f2f);
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
</style>
