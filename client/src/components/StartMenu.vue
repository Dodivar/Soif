<template>
  <v-container class="fill-height pa-0" fluid>
    <canvas id="confetti"></canvas>
    <v-icon
      v-if="!wantToCreateRoom && !wantToJoinRoom"
      @click="wantToSetProfil = true"
      class="position-fixed top-0 right-0 text-h4 ma-3"
      >mdi mdi-account-edit</v-icon
    >
    <div class="w-100">
      <!-- Set profil -->
      <div v-if="!pseudo || !avatar || wantToSetProfil" class="mx-5">
        <div class="text-center ma-5">
          <h1>Bienvue à Soifs !</h1>
          <h2>Créé ton profil</h2>
        </div>
        <v-form class="text-center" ref="profile" @submit.prevent>
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
            class="w-100 bg-gradient-success text-white rounded-xl my-3"
            type="submit"
            >Jouer</v-btn
          >
        </v-form>
      </div>

      <!-- Create or join -->
      <div v-else-if="!state.room.roomId" class="mx-5">
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
          class="w-100 bg-gradient-success text-white rounded-xl"
          type="submit"
          >Créer une partie</v-btn
        >

        <!-- Join room -->
        <v-form class="mt-5 text-center" @submit.prevent>
          <v-number-input
            v-if="wantToJoinRoom"
            v-model="roomToJoin"
            :counter="6"
            placeholder="Numéro de partie"
            label="Numéro de partie"
          ></v-number-input>
          <v-btn
            v-if="!wantToCreateRoom"
            @click="wantToJoinRoom ? joinRoom() : (wantToJoinRoom = true)"
            elevation="4"
            :class="
              (wantToJoinRoom ? 'bg-gradient-success' : 'bg-gradient-info') +
              ' w-100 text-white rounded-xl'
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
          class="w-100 bg-gradient-warning text-white rounded-xl my-5"
          @click="wantToCreateRoom = wantToJoinRoom = false"
          >Retour</v-btn
        >
      </div>

      <!-- Saloon -->
      <div v-else-if="!allIsReady && !wantToConfigureRoom" class="text-center mx-5">
        <div class="text-center ma-5">
          <h1>Numéro de la partie</h1>
          <h2>{{ state.room.roomId }}</h2>
        </div>
        <div class="d-flex flex-wrap flex-align-center justify-space-around">
          <v-badge
            v-for="(player, i) in players"
            :key="i"
            bordered
            top
            :color="player.isReady ? 'green' : 'red'"
            offset-x="20"
            offset-y="20"
          >
            <PlayerAvatar
              :player="player"
              :avatar-size="120"
              :show-pseudo="true"
              :show-room-master="true"
            ></PlayerAvatar>
          </v-badge>
        </div>
        <v-btn
          :disabled="launchGameIsDisabled"
          @click="state.player.isReady ? notReadyToPlay() : readyToPlay()"
          elevation="4"
          class="w-100 bg-gradient-success text-white rounded-xl"
          >{{ readyBtnLabel }}</v-btn
        >
        <v-btn
          v-if="state.player.isRoomMaster"
          @click="goToRoomConfiguration"
          elevation="4"
          class="w-100 bg-gradient-info text-white rounded-xl mt-5"
          >Configurer la partie</v-btn
        >
        <v-btn class="w-100 bg-gradient-warning text-white rounded-xl mt-5" @click="quitRoom"
          >QUITTER</v-btn
        >
      </div>
      <RoomConfiguration
        @quit-configuration="wantToConfigureRoom = false"
        v-else-if="wantToConfigureRoom"
      />
      <!-- GAMES -->
      <div v-else>
        <!-- GAME DESC -->
        <div v-if="state.room.showNextGamDesc" class="w-100 d-flex justify-center">
          <v-sheet class="w-100 pa-5 text-center rounded-lg mx-5" elevation="8">
            <h2
              class="mb-2"
              :style="
                state.player.hasBlurRoundDescription && state.room.actualGame.canBeBlured
                  ? 'filter: blur(20px);'
                  : ''
              "
            >
              {{ state.room.actualGame.description }}
            </h2>
            <p v-if="state.room.actualGame.tips">
              <i>Astuce : {{ state.room.actualGame.tips }}</i>
            </p>
            <p v-if="state.room.gameIdx + 1 <= state.room.gamesTour.length - 1" class="mt-3">
              Round {{ state.room.gameIdx + 1 }}/{{ state.room.gamesTour.length - 1 }}
            </p>
          </v-sheet>
        </div>
        <ScoreSoif v-else-if="state.player?.hasPlayed" />
        <component v-else :is="actualGameName" @confetti="createConfetti" />
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

      <!-- snackbar -->
      <template v-for="(snackbar, idx) in state.snackbarElements" :key="`snackbar-element-${idx}`">
        <v-alert
          class="alert-msg rounded-lg"
          color="deep-purple-accent-4"
          elevation="24"
          @click="state.snackbarElements.pop()"
        >
          {{ snackbar.message }}
          <JokerCard
            v-if="snackbar.joker"
            :joker-id="snackbar.joker.id"
            :title="snackbar.joker.name"
            :description="snackbar.joker.description"
            :rarity="snackbar.joker.rarity"
            :icon="snackbar.joker.icon"
          ></JokerCard>
          <p v-if="state.snackbarElements.length > 1">
            {{ `${idx}/${state.snackbarElements.length}` }}
          </p>
        </v-alert>
      </template>
    </div>
  </v-container>
</template>

<script>
import confetti from 'canvas-confetti'

import StopSlider from './games/StopSlider.vue'
import RedOrBlack from './games/RedOrBlack.vue'
import CardColors from './games/CardColors.vue'
import TTMC from './games/TTMC.vue'
import ReactionClick from './games/ReactionClick.vue'
import FastClick from './games/FastClick.vue'
import DotClick from './games/DotClick.vue'
import SurvivalEmoji from './games/SurvivalEmoji.vue'
import Simon from './games/Simon.vue'
import GuessNumber from './games/GuessNumber.vue'
import DoYouPrefer from './games/DoYouPrefer.vue'
import PersonnalQuestion from './games/PersonnalQuestion.vue'
import Blackjack from './games/Blackjack.vue'
import Labyrinth from './games/Labyrinth.vue'
import NavalBattle from './games/NavalBattle.vue'
import Loto from './games/Loto.vue'
import RebondBall from './games/RebondBall.vue'
import BrickBreaker from './games/BrickBreaker.vue'

import RoomConfiguration from './RoomConfiguration.vue'
import ScoreSoif from './ScoreSoif.vue'
import PodiumSoif from './PodiumSoif.vue'
import PlayerAvatar from './PlayerAvatar.vue'
import JokerWheel from './JokerWheel.vue'
import JokerCard from './JokerCard.vue'
import { state, socket } from '@/socket'

export default {
  name: 'StartMenu',
  components: {
    StopSlider,
    RedOrBlack,
    CardColors,
    ScoreSoif,
    TTMC,
    ReactionClick,
    FastClick,
    DotClick,
    SurvivalEmoji,
    Simon,
    GuessNumber,
    DoYouPrefer,
    PersonnalQuestion,
    Blackjack,
    Labyrinth,
    NavalBattle,
    Loto,
    RebondBall,
    BrickBreaker,

    RoomConfiguration,
    PodiumSoif,
    PlayerAvatar,
    JokerWheel,
    JokerCard
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
      wantToSetProfil: false,
      wantToConfigureRoom: false
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
    launchGameIsDisabled() {
      return state.room.players.length < 2 && state.player.pseudo.toLowerCase() !== 'dodi'
    },
    readyBtnLabel() {
      return this.launchGameIsDisabled
        ? "En attente d'autres soifeurs..."
        : state.player.isReady
          ? 'PAS PRÊT'
          : 'PRÊT'
    }
  },
  methods: {
    createRoom(roundNumber) {
      socket.emit('Room:Create', state.player, this.avatar, roundNumber)
      navigator.clipboard.writeText(state.room.roomId)
    },
    joinRoom() {
      socket.emit('Room:Join', this.roomToJoin, state.player, this.avatar)
    },
    quitRoom() {
      socket.emit('Room:Quit')
      state.room = {}
    },
    readyToPlay() {
      const roomConfiguration = JSON.parse(localStorage.getItem('RoomConfiguration'))
      if (
        state.player.isRoomMaster &&
        roomConfiguration !== null &&
        confirm('Veux-tu utiliser la configuration de partie personnalisée que tu as ?')
      ) {
        socket.emit('Room:ReadyToPlay', roomConfiguration)
      } else {
        socket.emit('Room:ReadyToPlay')
      }
    },
    notReadyToPlay() {
      socket.emit('Room:NotReadyToPlay')
    },
    async setProfile() {
      const { valid } = await this.$refs.profile.validate()
      if (!valid) return
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
    },
    goToRoomConfiguration() {
      this.notReadyToPlay()
      this.wantToConfigureRoom = true
    },
    createConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }
}
</script>

<style>
.alert-msg {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#confetti {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}
</style>
