<template>
  <div class="game-container">
    <!-- <h1>Bataille Navale Simplifiée</h1> -->
    <PlayerAvatar
      v-if="shipsArePlaced"
      :player="actualPlayer"
      :avatar-size="100"
      :show-pseudo="true"
    />
    <div class="grid-container">
      <div class="label"></div>
      <div class="label">A</div>
      <div class="label">B</div>
      <div class="label">C</div>
      <div class="label">D</div>
      <div class="label">E</div>
      <div id="playerGrid" class="grid">
        <div class="label">1</div>
        <div class="cell" data-id="0" data-coords="A1" @click="handleCellClick"></div>
        <div class="cell" data-id="1" data-coords="B1" @click="handleCellClick"></div>
        <div class="cell" data-id="2" data-coords="C1" @click="handleCellClick"></div>
        <div class="cell" data-id="3" data-coords="D1" @click="handleCellClick"></div>
        <div class="cell" data-id="4" data-coords="E1" @click="handleCellClick"></div>
        <div class="label">2</div>
        <div class="cell" data-id="5" data-coords="A2" @click="handleCellClick"></div>
        <div class="cell" data-id="6" data-coords="B2" @click="handleCellClick"></div>
        <div class="cell" data-id="7" data-coords="C2" @click="handleCellClick"></div>
        <div class="cell" data-id="8" data-coords="D2" @click="handleCellClick"></div>
        <div class="cell" data-id="9" data-coords="E2" @click="handleCellClick"></div>
        <div class="label">3</div>
        <div class="cell" data-id="10" data-coords="A3" @click="handleCellClick"></div>
        <div class="cell" data-id="11" data-coords="B3" @click="handleCellClick"></div>
        <div class="cell" data-id="12" data-coords="C3" @click="handleCellClick"></div>
        <div class="cell" data-id="13" data-coords="D3" @click="handleCellClick"></div>
        <div class="cell" data-id="14" data-coords="E3" @click="handleCellClick"></div>
        <div class="label">4</div>
        <div class="cell" data-id="15" data-coords="A4" @click="handleCellClick"></div>
        <div class="cell" data-id="16" data-coords="B4" @click="handleCellClick"></div>
        <div class="cell" data-id="17" data-coords="C4" @click="handleCellClick"></div>
        <div class="cell" data-id="18" data-coords="D4" @click="handleCellClick"></div>
        <div class="cell" data-id="19" data-coords="E4" @click="handleCellClick"></div>
        <div class="label">5</div>
        <div class="cell" data-id="20" data-coords="A5" @click="handleCellClick"></div>
        <div class="cell" data-id="21" data-coords="B5" @click="handleCellClick"></div>
        <div class="cell" data-id="22" data-coords="C5" @click="handleCellClick"></div>
        <div class="cell" data-id="23" data-coords="D5" @click="handleCellClick"></div>
        <div class="cell" data-id="24" data-coords="E5" @click="handleCellClick"></div>
      </div>
    </div>
    <h2 class="ma-5">
      <template v-if="!playerShip">Choisissez une case pour placer votre navire !</template>
      <template v-else-if="!shipsArePlaced">En attente des navires des autres soifeurs</template>
      <template v-else>Au tour de {{ actualPlayer.pseudo }}</template>
    </h2>
    <p v-if="shipsArePlaced">Joueur encore en vit : {{ playerAlivePseudo }}</p>

    <v-alert
      v-if="allShipsDestroyed"
      class="position-fixed top-50"
      elevation="24"
      color="info"
      icon="$info"
      :text="alertMessage"
    ></v-alert>
  </div>
</template>

<script>
import { state, socket } from '@/socket'
import PlayerAvatar from '@/components/PlayerAvatar.vue'
import Timer from '@/components/Timer.vue'

export default {
  components: {
    Timer,
    PlayerAvatar
  },
  data() {
    return {
      state,
      gridSize: 5,
      playerShip: null,
      currentPlayer: 'player',
      gameOver: false,
      letters: ['A', 'B', 'C', 'D', 'E'],
      hasShoot: false
    }
  },
  computed: {
    actualPlayer() {
      return state.room.actualGame.playerTurn
    },
    playerAlive() {
      return state.room.actualGame.playerShips.filter((e) => e.isAlive)
    },
    playerAlivePseudo() {
      return this.playerAlive.map((e) => e.player.pseudo).join(', ')
    },
    shipsArePlaced() {
      return state.room.actualGame.shipsArePlaced
    },
    allShipsDestroyed() {
      return state.room.actualGame.allShipsDestroyed
    },
    alertMessage() {
      return this.playerAlive.length > 1
        ? `${this.playerAlivePseudo} sont les survivants. bravo !`
        : `${this.playerAlivePseudo} est le survivant. Bravo !`
    }
  },
  watch: {
    'state.room.actualGame.playerShoots'() {
      this.updateCells()
      this.hasShoot = false

      if (this.allShipsDestroyed) {
        const personnalShip = state.room.actualGame.playerShips.find(
          (e) => e.player.socketId === socket.id
        )

        this.gameOver = true

        setTimeout(() => {
          socket.emit('Game:PlayGame', {
            soif: personnalShip.playerHitted,
            isStillAlive: personnalShip.isAlive
          })
        }, 3000)
      }
    }
  },
  methods: {
    handleCellClick(event) {
      if (this.gameOver) return
      const cellId = parseInt(event.target.dataset.id)

      if (!this.playerShip) {
        this.placePlayerShip(cellId)
      } else if (this.actualPlayer.socketId === socket.id) {
        this.attackCell(cellId)
      }
    },

    placePlayerShip(cellId) {
      this.playerShip = cellId
      const cell = document.querySelector(`[data-id="${cellId}"]`)
      cell.classList.add('ship')
      socket.emit('NavalBattle:PlaceShip', cell.dataset.coords)
    },

    attackCell(cellId) {
      if (this.hasShoot || isNaN(cellId)) return

      const cell = document.querySelector(`[data-id="${cellId}"]`)
      const coords = cell.dataset.coords

      if (state.room.actualGame.playerShoots.includes(coords)) return

      socket.emit('NavalBattle:Shoot', coords)
      this.hasShoot = true
    },

    updateCells() {
      state.room.actualGame.playerShoots.forEach((position) => {
        const cell = document.querySelector(`[data-coords="${position}"]`)
        if (!cell.classList.contains('hit')) {
          cell.classList.add('hit')

          // Add the avatar of the touched player
          const shipTouched = state.room.actualGame.playerShips.find((e) => e.position === position)
          if (shipTouched) {
            const img = document.createElement('img')
            img.src =
              shipTouched.player.socketId === socket.id
                ? localStorage.getItem('playerAvatar')
                : sessionStorage.getItem(`playerAvatar-${shipTouched.player.socketId}`)
            img.style.width = img.style.height = '100%'
            cell.appendChild(img)
          }
        }
      })
    },

    addAttackIndicator(cell, text) {
      const indicator = document.createElement('div')
      indicator.className = 'attack-indicator'
      indicator.textContent = text
      cell.appendChild(indicator)
    }
  },
  created() {}
}
</script>

<style scoped>
.v-alert {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.v-sheet {
  width: 100%;
  height: 50%;
  position: fixed;
  user-select: none;
}

.v-sheet:hover {
  text-decoration: underline;
}

#red {
  top: 0;
  left: 0;
}
#black {
  bottom: 0;
  left: 0;
}
</style>
