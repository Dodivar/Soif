<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col cols="12">
        <v-card v-if="!state.room.roomId" class="ma-5 rounded-xl" elevation="5">
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
        </v-card>

        <!-- Saloon -->
        <v-card v-else-if="!allIsReady" flat class="ma-5 rounded-xl" elevation="5">
          <v-card-text class="pa-0 text-white">
            <div class="bg-gradient-info align-items-center pa-5">
              <div>
                <h2 class="mb-1">Soif [ {{ state.room.roomId }} ]</h2>
                <h5 class="text-subtitle-1">Liste des soifeurs</h5>
              </div>
            </div>
            <div class="pa-4">
              <v-list>
                <v-list-item v-for="(player, i) in players" :key="i">
                  <v-list-item-title>
                    <div class="d-flex align-center py-3">
                      <div class="mr-3">
                        <v-badge
                          bordered
                          top
                          :color="player.isReady ? 'green' : 'red'"
                          dot
                          offset-x="10"
                          offset-y="10"
                        >
                          <v-avatar color="brown" size="large">
                            <span class="text">{{ player.pseudo[0] }}</span>
                          </v-avatar>
                        </v-badge>
                      </div>
                      <div class="mx-3">
                        <h6 class="text-h6 mt-n1 mb-1">{{ player.pseudo }}</h6>
                        <!-- <h5 class="font-weight-medium"></h5> -->
                        <span class="text--secondary descpart d-block truncate-text subtitle-2">
                          <!-- {{ item.desc }} -->
                        </span>
                      </div>
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="readyToPlay" class="bg-gradient-sucess" color="success">Prêt</v-btn>
            <v-btn @click="quitRoom" color="error">Quitter</v-btn>
          </v-card-actions>
        </v-card>
        <!-- GAMES -->
        <ScoreSoif v-else-if="state.player.hasPlayed" />
        <component v-else :is="actualGameName" />
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
    }
  }
}
</script>

<style scoped></style>
