<template>
  <v-container class="fill-height" fluid>
    <v-icon
      v-if="!wantToCreateRoom && !wantToJoinRoom"
      @click="wantToSetProfil = true"
      class="position-fixed top-0 right-0 text-h4 ma-3"
      >mdi mdi-account-edit</v-icon
    >
    <v-row>
      <v-col cols="12">
        <!-- Set profil -->
        <div v-if="!pseudo || !avatar || wantToSetProfil">
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
              v-model="pseudoInput"
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
        <div v-else-if="!state.room.roomId">
          <div class="text-center ma-5">
            <h1>Soifs !</h1>
            <h2>Prépare ton gosier mon salop</h2>
          </div>
          <!-- Create room -->
          <PlayerAvatar
            class="text-center"
            :player="state.player"
            :avatar-size="200"
            :can-be-modified="true"
            :show-pseudo="true"
          >
          </PlayerAvatar>

          <v-btn
            v-if="!wantToCreateRoom && !wantToJoinRoom"
            @click="wantToCreateRoom = true"
            elevation="4"
            class="w-100 bg-gradient-success text-white"
            type="submit"
            >Créer une partie</v-btn
          >

          <!-- Join room -->
          <v-form class="mt-5 text-center" @submit.prevent>
            <v-text-field
              v-if="wantToJoinRoom"
              v-model="roomToJoin"
              :counter="6"
              placeholder="Numéro de partie"
              label="Numéro de partie"
            ></v-text-field>
            <v-btn
              v-if="!wantToCreateRoom"
              @click="wantToJoinRoom ? joinRoom() : (wantToJoinRoom = true)"
              elevation="4"
              :class="
                (wantToJoinRoom ? 'bg-gradient-success' : 'bg-gradient-info') + ' w-100 text-white'
              "
              type="submit"
              >{{ wantToJoinRoom ? 'Valider' : 'Rejoindre une partie' }}</v-btn
            >
          </v-form>

          <div v-if="wantToCreateRoom">
            <h3>Quelle formule allez vous choisir ?</h3>
            <v-sheet
              elevation="5"
              class="rounded-lg text-start pa-2 my-3 cursor-pointer"
              @click="createRoom(10)"
            >
              <div class="d-flex align-center">
                <v-avatar class="bg-gradient-success text-white">
                  <span class="text-h6">10</span>
                </v-avatar>
                <div class="ml-3">
                  <p class="text-h5">Le petit déj</p>
                  <p>Parfait pour un petit déjeuner équilibré.</p>
                </div>
              </div>
            </v-sheet>
            <v-sheet
              elevation="5"
              class="rounded-lg text-start pa-2 my-3 cursor-pointer"
              @click="createRoom(25)"
            >
              <div class="d-flex align-center">
                <v-avatar class="bg-gradient-info text-white">
                  <span class="text-h6">25</span>
                </v-avatar>
                <div class="ml-3">
                  <p class="text-h5">L'apéro</p>
                  <p>Idéal pour une mise en jambe.</p>
                </div>
              </div>
            </v-sheet>
            <v-sheet
              elevation="5"
              class="rounded-lg text-start pa-2 my-3 cursor-pointer"
              @click="createRoom(50)"
            >
              <div class="d-flex align-center">
                <v-avatar class="bg-gradient-yellow text-white">
                  <span class="text-h6">50</span>
                </v-avatar>
                <div class="ml-3">
                  <p class="text-h5">Le plat de résistance</p>
                  <p>C'est l'heure de se carabiner la tronche !</p>
                </div>
              </div>
            </v-sheet>
            <v-sheet
              elevation="5"
              class="rounded-lg text-start pa-2 my-3 cursor-pointer"
              @click="createRoom(100)"
            >
              <div class="d-flex align-center">
                <v-avatar class="bg-gradient-danger text-white">
                  <span class="text-h6">100</span>
                </v-avatar>
                <div class="ml-3">
                  <p class="text-h5">Le digo</p>
                  <p>Seul les vrais soldats tiendront encore debout !</p>
                </div>
              </div>
            </v-sheet>
          </div>
          <v-btn
            v-if="wantToCreateRoom || wantToJoinRoom"
            class="w-100 bg-gradient-warning text-white my-5"
            @click="wantToCreateRoom = wantToJoinRoom = false"
            >Retour</v-btn
          >
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
                  :avatar-size="80"
                  :show-pseudo="true"
                  :show-room-master="true"
                ></PlayerAvatar>
              </v-badge>
            </v-col>
          </v-row>
          <v-btn
            :disabled="launchGameIsDisabled"
            @click="readyToPlay"
            elevation="4"
            class="w-50 bg-gradient-success text-white"
            >{{ launchGameIsDisabled ? "En attente d'autres soifeurs..." : 'Prêt' }}</v-btn
          >
        </div>
        <!-- GAMES -->
        <div v-else>
          <!-- GAME DESC -->
          <div v-if="state.room.showNextGamDesc" class="w-100 d-flex justify-center">
            <v-sheet class="w-50 pa-5 text-center rounded-lg" elevation="8">
              <h2 class="mb-2">
                {{ state.room.actualGame.description }}
              </h2>
              <p v-if="state.room.gameIdx + 1 <= state.room.gamesTour.length - 1">
                Round {{ state.room.gameIdx + 1 }}/{{ state.room.gamesTour.length - 1 }}
              </p>
            </v-sheet>
          </div>
          <ScoreSoif v-else-if="state.player?.hasPlayed" />
          <component v-else :is="actualGameName" />
        </div>

        <!-- ALERT -->
        <v-alert
          v-if="state.errMsg"
          border="top"
          type="warning"
          variant="outlined"
          closable
          density="compact"
        >
          {{ state.errMsg }}
        </v-alert>
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
import DoYouPrefer from './games/DoYouPrefer.vue'

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
    DoYouPrefer,
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
      pseudoInput: null,
      pseudo: null,
      avatar: null,
      wantToCreateRoom: false,
      wantToJoinRoom: false,
      wantToSetProfil: false
    }
  },
  created() {
    this.setPlayerState()
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
      return this.players.find((e) => e.socketId === state.player.socketId)?.isRoomMaster
    },
    launchGameIsDisabled() {
      return state.room.players.length < 2 && state.player.pseudo.toLowerCase() !== 'dodi'
    }
  },
  methods: {
    createRoom(roundNumber) {
      socket.emit('create room', state.player, this.avatar, roundNumber)
    },
    joinRoom() {
      socket.emit('join room', this.roomToJoin, state.player, this.avatar)
    },
    quitRoom() {
      socket.emit('quit room')
      state.room.roomId = null
    },
    readyToPlay() {
      socket.emit('ready to play')
    },
    setProfile() {
      localStorage.setItem('playerPseudo', this.pseudoInput)
      this.setPlayerState()
      this.wantToSetProfil = false
    },
    getLocalPlayerPseudo() {
      return localStorage.getItem('playerPseudo')
    },
    getLocalPlayerAvatar() {
      return localStorage.getItem('playerAvatar')
    },
    setPlayerState() {
      this.pseudo = this.getLocalPlayerPseudo()
      this.avatar = this.getLocalPlayerAvatar()
      state.player.pseudo = this.pseudo
      state.player.avatar = this.avatar
    }
  }
}
</script>

<style scoped></style>
