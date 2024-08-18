<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col cols="12">
        <!-- Set profil -->
        <div v-if="!state.player.pseudo || !state.player.avatar">
          <div class="text-center ma-5">
            <h1>Bienvue à Soifs !</h1>
            <h2>Créé ton profil</h2>
          </div>
          <v-form class="text-center" @submit.prevent>
            <PlayerAvatar
              :player="state.player"
              :avatar-size="200"
              :can-be-modified="true"
              class="mb-5"
            >
            </PlayerAvatar>
            <v-text-field
              v-model="pseudo"
              :counter="10"
              :rules="pseudoRules"
              label="Pseudo"
              required
            ></v-text-field>
            <v-btn
              @click="setProfile"
              elevation="4"
              class="bg-gradient-success text-white"
              type="submit"
              >Jouer</v-btn
            >
          </v-form>
        </div>

        <!-- Create or join -->
        <div v-else-if="!state.room.roomId" class="text-center">
          <div class="text-center ma-5">
            <h1>Soifs !</h1>
            <h2>Prépare ton gosier mon salop</h2>
          </div>
          <!-- Create room -->
          <PlayerAvatar
            :player="state.player"
            :avatar-size="200"
            :can-be-modified="true"
            :show-pseudo="true"
          >
          </PlayerAvatar>

          <v-btn
            @click="createRoom"
            elevation="4"
            class="w-100 bg-gradient-success text-white"
            type="submit"
            >Créer une partie</v-btn
          >

          <!-- Join room -->
          <v-form class="mt-5 text-center" @submit.prevent>
            <v-text-field
              v-model="roomToJoin"
              :counter="6"
              placeholder="Numéro de partie"
              label="Numéro de partie"
            ></v-text-field>
            <v-btn
              @click="joinRoom"
              elevation="4"
              class="w-100 bg-gradient-warning text-white"
              type="submit"
              >Rejoindre une partie</v-btn
            >
          </v-form>
        </div>

        <!-- Saloon -->
        <div v-else-if="!allIsReady" class="text-center">
          <div class="text-center ma-5">
            <h1>Numéro de la partie</h1>
            <h2>{{ state.room.roomId }}</h2>
          </div>
          <v-row>
            <v-col
              cols="3"
              class="d-flex flex-column align-center"
              v-for="(player, i) in players"
              :key="i"
            >
              <v-badge
                bordered
                top
                :color="player.isReady ? 'green' : 'red'"
                offset-x="20"
                offset-y="20"
              >
                <PlayerAvatar
                  :player="player"
                  :avatar-size="160"
                  :show-pseudo="true"
                  :show-room-master="true"
                ></PlayerAvatar>
              </v-badge>
            </v-col>
          </v-row>
          <v-btn @click="readyToPlay" elevation="4" class="w-50 bg-gradient-success text-white"
            >Prêt</v-btn
          >
        </div>
        <!-- GAMES -->
        <div v-else>
          <h3 v-if="!state.connected" class="text-error">Connexion perdu !</h3>
          <ScoreSoif v-if="state.player.hasPlayed" />
          <component v-else :is="actualGameName" />
        </div>
      </v-col>
    </v-row>
  </v-container>
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
import PodiumSoif from './PodiumSoif.vue'
import PlayerAvatar from './PlayerAvatar.vue'
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
    GuessNumber,
    PodiumSoif,
    PlayerAvatar
  },
  data() {
    return {
      state,
      roomToJoin: null,
      pseudoRules: [
        (v) => !!v || 'Le pseudo est obligatoire',
        (v) => (v && v.length <= 10) || 'Le pseudo doit contenir moins de 10 characters'
      ],
      pseudo: null
    }
  },
  created() {
    state.player.pseudo = this.getLocalPlayerPseudo()
    state.player.avatar = this.getLocalPlayerAvatar()
    console.log(state.player)
  },
  mounted() {
    this.avatarCanvas = document.getElementById('avatarCanvas')
    this.videoPreview = document.getElementById('videoPreview')
  },
  computed: {
    players() {
      return state.room.players
    },
    actualGameName() {
      return state.room.actualGame.name
    },
    allIsReady() {
      return this.players?.every((e) => e.isReady)
    },
    isRoomMaster() {
      return this.players.find((e) => e.socketId === state.player.socketId).isRoomMaster
    }
  },
  methods: {
    createRoom() {
      socket.emit('create room', state.player)
    },
    joinRoom() {
      socket.emit('join room', this.roomToJoin, state.player)
    },
    quitRoom() {
      socket.emit('quit room')
      state.room.roomId = null
    },
    readyToPlay() {
      socket.emit('ready to play')
    },
    setProfile() {
      localStorage.setItem('playerPseudo', this.pseudo)
      state.player.pseudo = this.pseudo
    },
    getLocalPlayerPseudo() {
      return localStorage.getItem('playerPseudo')
    },
    getLocalPlayerAvatar() {
      return localStorage.getItem('playerAvatar')
    }
  }
}
</script>

<style scoped></style>
