<template>
  <v-layout>
    <v-sheet v-if="!state.room.roomId" class="mx-auto" width="300">
      <v-text-field
        v-model="state.player.pseudo"
        :counter="10"
        :rules="pseudoRules"
        label="Pseudo"
        required
      ></v-text-field>

      <!-- Create room -->
      <v-btn @click="createRoom" color="success">Créer une partie</v-btn>

      <!-- Join room -->
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <v-text-field
            v-model="roomToJoin"
            :counter="6"
            placeholder="RoomId"
            label="RoomId"
          ></v-text-field>
        </v-col>
        <v-btn @click="joinRoom" color="warning">Rejoindre une partie</v-btn>
      </v-row>
    </v-sheet>

    <!-- Saloon -->
    <v-sheet v-else>
      <div v-if="!allIsReady">
        <h2>
          {{ state.room.roomId }}
        </h2>

        <!-- Players -->
        <p>Nombre de joueur: {{ players?.length }}</p>
        <v-avatar v-for="player in players" :key="player.socketId" color="brown" size="large">
          <span class="text">{{ player.pseudo }}</span>
        </v-avatar>

        <v-btn @click="readyToPlay" color="success">Prêt</v-btn>
        <v-btn @click="quitRoom" color="error">Quitter la partie</v-btn>
      </div>
      <div v-else>
        <!-- GAMES -->
        <div v-if="allHasPlayed">
          <ScoreSoif />
          <v-btn @click="nextGame">Next</v-btn>
        </div>
        <component v-else :is="actualGame" />
      </div>
    </v-sheet>
  </v-layout>
</template>

<script>
import StopSlider from './games/StopSlider.vue'
import RedOrBlack from './games/RedOrBlack.vue'
import CardColors from './games/CardColors.vue'
import MovableList from './games/MovableList.vue'
import TTMC from './games/TTMC.vue'
import ReactionClick from './games/ReactionClick.vue'
import FastClick from './games/FastClick.vue'
import DotClick from './games/DotClick.vue'
import SurvivalEmoji from './games/SurvivalEmoji.vue'
import Simon from './games/Simon.vue'
import GuessNumber from './games/GuessNumber.vue'
import ScoreSoif from './ScoreSoif.vue'
import { state, socket } from '@/socket'

export default {
  name: 'StartMenu',
  components: {
    StopSlider,
    RedOrBlack,
    CardColors,
    ScoreSoif,
    MovableList,
    TTMC,
    ReactionClick,
    FastClick,
    DotClick,
    SurvivalEmoji,
    Simon,
    GuessNumber
  },
  data() {
    return {
      roomToJoin: null,
      state,
      pseudoRules: [
        (v) => !!v || 'Le pseudo est obligatoire',
        (v) => (v && v.length <= 10) || 'Le pseudo doit contenir moins de 10 characters'
      ],
      actualGameIdx: 0
    }
  },
  computed: {
    players() {
      return state.room.players
    },
    allIsReady() {
      return this.players?.every((e) => e.isReady)
    },
    actualGame() {
      if (!state.room.gamesTour) return null
      return state.room?.gamesTour[this.actualGameIdx]
    },
    allHasPlayed() {
      return this.players.every((e) => e.hasPlayed)
    },
    isRoomMaster() {
      return this.players.find((e) => e.socketId === state.player.socketId).isRoomMaster
    }
  },
  watch: {
    // weCanPassToTheNextGame(oldVal, newVal) {
    //   // Change the game when each player is ready
    //   if (newVal === true) {
    //     this.actualGameIdx++
    //   }
    // }
  },
  methods: {
    createRoom() {
      let pseudo = state.player.pseudo.toString()
      if (pseudo) {
        socket.emit('create room', pseudo)
      } else {
        alert('Il faut renseigner un pseudo !')
      }
    },
    joinRoom() {
      let pseudo = state.player.pseudo.toString()
      if (pseudo) {
        socket.emit('join room', this.roomToJoin, pseudo)
      } else {
        alert('Il faut renseigner un pseudo !')
      }
    },
    quitRoom() {
      socket.emit('quit room')
      state.room.roomId = null
    },
    readyToPlay() {
      socket.emit('ready to play')
    },
    nextGame() {
      this.actualGameIdx++
      this.players.forEach((e) => (e.hasPlayed = false))
      socket.emit('refresh players', this.players)
    }
  }
}
</script>

<style scoped></style>
