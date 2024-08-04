<template>
  <v-container>
    <div v-if="score === null">
      <v-slider
        direction="vertical"
        :min="-50"
        :max="50"
        :model-value="sliderValue"
        disabled
      ></v-slider>

      <v-btn @click="stopSlider">STOP</v-btn>
    </div>
    <div v-else-if="!canGiveSoif">
      <v-card class="mx-auto" title="Tableau des scores">
        <v-list :items="playerItems">
          <v-list-subheader inset>Liste des buveurs</v-list-subheader>
          <v-list-item
            v-for="player in playerItems"
            :key="player.id"
            :title="player.pseudo"
            :subtitle="`score: ${player.gameValue}`"
          >
            <template v-slot:prepend>
              <v-avatar color="brown">
                <span class="text">{{ player.pseudo }}</span>
              </v-avatar>
            </template>

            <template v-slot:append>
              <v-chip v-if="player.soifAdded > 0" color="green" variant="flat">
                +{{ player.soifAdded }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  components: {},
  data() {
    return {
      state,
      score: null,
      sliderValue: -50,
      interval: null
    }
  },
  methods: {
    stopSlider() {
      clearInterval(this.interval)
      let double = this.sliderValue * 2
      let negValue = double < 0 ? double : -double
      this.score = Math.round(negValue + 100)
      socket.emit('playGame', 'StopSlider', this.score)
    }
  },
  created() {
    var velocity = 10
    var goUp = true

    this.interval = setInterval(() => {
      if (this.sliderValue >= 49) {
        goUp = false
      } else if (this.sliderValue <= -49) {
        goUp = true
      }

      var value = Math.abs(Math.abs(this.sliderValue) - 50)
      velocity = value === 0 ? 1 : value * 0.5

      if (goUp) this.sliderValue += 1 * velocity
      else this.sliderValue -= 1 * velocity
    }, 100)
  },
  computed: {
    playerItems() {
      const result = []
      state.room.players.forEach((player) => {
        result.push({
          id: player.id,
          pseudo: player.pseudo,
          gameValue: player.gameValue
        })
      })
      return result.sort((e) => e.gameValue)
    },
    // Check if all player has played and the winner is the actual player
    canGiveSoif() {
      return state.room.players.find((e) => e.socketId === state.player.id).gameWinner
    }
  }
}
</script>
