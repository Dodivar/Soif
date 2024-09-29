<template>
  <v-container class="fill-height pa-0" :class="{ isTazed: state.player.hasBeenTazed > 0 }" fluid>
    <canvas id="confetti"></canvas>
    <v-icon
      v-if="!wantToCreateRoom && !wantToJoinRoom && !state.room?.roomId"
      @click="wantToSetProfil = true"
      class="position-fixed top-0 right-0 text-h4 text-white ma-3"
      >mdi mdi-account-edit</v-icon
    >
    <div class="w-100">
      <!-- Set profil -->
      <div v-if="!pseudo || !avatar || wantToSetProfil" class="mx-5 text-white">
        <div class="text-center ma-5">
          <h1 class="dancing-script-text text-h1 mb-5">Soif !</h1>
          <h2 class="nunito-text">Créé ton profil</h2>
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
            class="text-black"
            required
          ></v-text-field>
          <v-btn
            @click="setProfile"
            elevation="4"
            class="w-100 bg-gradient-success rounded-xl my-3"
            type="submit"
            >Jouer</v-btn
          >
        </v-form>
        <!--GOOGLE LOGIN-->
        <div
          id="g_id_onload"
          data-client_id="soifGoogleLogin"
          data-context="signup"
          data-ux_mode="popup"
          data-callback="handleSignInWithGoogle"
          data-auto_select="true"
          data-itp_support="true"
          data-use_fedcm_for_prompt="true"
        ></div>
        <div
          class="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        ></div>
      </div>

      <!-- Create or join -->
      <div v-else-if="!state.room.roomId && !wantToSelectChampion" class="mx-5 text-white">
        <div class="text-center ma-5">
          <h1 class="dancing-script-text mb-5">Soif !</h1>
        </div>
        <PlayerAvatar
          class="text-center text-black"
          :player="state.player"
          :avatar-size="200"
          :can-be-modified="true"
          :show-pseudo="true"
        >
        </PlayerAvatar>

        <!-- Create room -->
        <v-btn
          v-if="!wantToCreateRoom && !wantToJoinRoom"
          @click="wantToCreateRoom = true"
          elevation="4"
          class="w-100 bg-gradient-success rounded-xl"
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
            class="text-black"
          ></v-text-field>
          <v-btn
            v-if="!wantToCreateRoom"
            @click="wantToJoinRoom ? joinRoom() : (wantToJoinRoom = true)"
            elevation="4"
            :loading="loadingRoom"
            :class="
              (wantToJoinRoom ? 'bg-gradient-success' : 'bg-gradient-info') +
              ' w-100 text-white rounded-xl'
            "
            type="submit"
            >{{ wantToJoinRoom ? 'Valider' : 'Rejoindre une partie' }}</v-btn
          >
        </v-form>

        <!-- CHAMP SELECTION -->
        <v-btn
          v-if="!wantToCreateRoom && !wantToJoinRoom"
          @click="goToChampionSelection"
          elevation="4"
          class="w-100 bg-gradient-primary text-white rounded-xl mt-5"
          >Choisir son champion</v-btn
        >

        <!-- ROUND NUMBER -->
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
      <div
        v-else-if="!allIsReady && !wantToConfigureRoom && !wantToSelectChampion"
        class="text-center mx-5"
      >
        <div class="nunito-text text-white text-center ma-5">
          <h1>Numéro de la partie</h1>
          <p class="text-h3 nunito-text">{{ state.room.roomId }}</p>
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
              :key="player.socketId"
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
          class="w-100 bg-gradient-success text-white rounded-xl mt-5"
          >{{ readyBtnLabel }}</v-btn
        >
        <v-btn
          v-if="state.player.isRoomMaster"
          @click="goToRoomConfiguration"
          elevation="4"
          class="w-100 bg-gradient-info text-white rounded-xl mt-5"
          >Configurer la partie</v-btn
        >
        <v-btn
          @click="goToChampionSelection"
          elevation="4"
          class="w-100 bg-gradient-primary text-white rounded-xl mt-5"
          >Choisir son champion</v-btn
        >
        <v-btn class="w-100 bg-gradient-warning text-white rounded-xl mt-5" @click="quitRoom"
          >QUITTER</v-btn
        >
      </div>

      <!-- Options -->
      <RoomConfiguration
        v-else-if="wantToConfigureRoom"
        @quit-configuration="wantToConfigureRoom = false"
      />
      <ChampionSelection
        v-else-if="wantToSelectChampion"
        @quit-configuration="wantToSelectChampion = false"
        @get-champion="getChampion"
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
        <!-- ROUND RESULT -->
        <ScoreSoif v-else-if="state.player?.hasPlayed" @confetti="createConfetti" />
        <!-- GAME -->
        <component v-else :is="actualGameName" @confetti="createConfetti" />
      </div>

      <!-- ALERT -->
      <v-alert v-if="state.errMsg" type="warning" variant="outlined" closable density="compact">
        {{ state.errMsg }}
      </v-alert>

      <!-- SNACKBAR -->
      <template v-for="(snackbar, idx) in state.snackbarElements" :key="`snackbar-element-${idx}`">
        <v-alert
          class="alert-msg rounded-lg w-75 cursor-pointer"
          color="indigo-darken-4"
          elevation="24"
          @click="state.snackbarElements.pop()"
        >
          <div class="w-100">
            <PlayerAvatar
              v-if="snackbar.player"
              :player="snackbar.player"
              :avatar-size="80"
              :show-pseudo="false"
              class="mb-3 justify-center"
            />
            <span class="text-h6">{{ snackbar.message }}</span>
            <v-icon class="position-fixed top-0 right-0 ma-2">mdi mdi-close</v-icon>
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
          </div>
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
import RockPaperScissor from './games/RockPaperScissor.vue'
import GuessHead from './games/GuessHead.vue'
import FindEmoji from './games/FindEmoji.vue'
import WizWaz from './games/WizWaz.vue'
import InMySuiteCase from './games/InMySuiteCase.vue'

import RoomConfiguration from './RoomConfiguration.vue'
import ChampionSelection from './ChampionSelection.vue'
import ScoreSoif from './ScoreSoif.vue'
import PodiumSoif from './PodiumSoif.vue'
import PlayerAvatar from './PlayerAvatar.vue'
import JokerWheel from './JokerWheel.vue'
import JokerCard from './JokerCard.vue'
import { state, socket } from '@/socket'

export default {
  name: 'RootComponent',
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
    RockPaperScissor,
    GuessHead,
    FindEmoji,
    WizWaz,
    InMySuiteCase,

    RoomConfiguration,
    ChampionSelection,
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
      wantToConfigureRoom: false,
      wantToSelectChampion: false,
      loadingRoom: false
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
      return state.room.actualGame?.name
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

      setTimeout(() => {
        if (state.room.roomId) {
          this.wantToCreateRoom = false
        }
      }, 2000)
    },
    joinRoom() {
      this.loadingRoom = true
      socket.emit('Room:Join', this.roomToJoin, state.player, this.avatar)

      setTimeout(() => {
        if (state.room.roomId) {
          this.wantToJoinRoom = false
        }

        this.loadingRoom = false
      }, 2000)
    },
    quitRoom() {
      socket.emit('Room:Quit')
      state.room = {}
    },
    readyToPlay() {
      localStorage.removeItem('playerChampion:Reload')
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
      this.getChampion()
      state.player.pseudo = this.pseudo
      state.player.avatar = this.avatar
    },
    goToRoomConfiguration() {
      this.notReadyToPlay()
      this.wantToConfigureRoom = true
    },
    goToChampionSelection() {
      this.notReadyToPlay()
      this.wantToSelectChampion = true
    },
    createConfetti(type) {
      switch (type) {
        case 'TOP1':
          this.confettiStars()
          break
        default:
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
      }
    },
    getChampion() {
      state.player.champion = localStorage.getItem('playerChampion')
    },

    confettiStars() {
      var defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
      }

      const shoot = function () {
        confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ['star']
        })

        confetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ['circle']
        })
      }

      setTimeout(shoot, 0)
      setTimeout(shoot, 100)
      setTimeout(shoot, 200)
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
.isTazed {
  filter: blur(5px);
}
</style>
