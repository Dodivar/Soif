<template>
  <div>
    <!-- OPTION -->
    <div class="w-100 position-absolute top-0 d-flex align-center justify-space-between px-5 pt-5">
      <p>{{ state.room.roomId }}</p>
      <v-icon @click="quitRoom" class="text-h4">mdi mdi-door</v-icon>
    </div>

    <!-- CONTENT LIST -->
    <v-container class="my-10">
      <div class="w-100 text-center mb-5">
        <h2>
          <span v-if="allPlayerHasPlayed"
            >{{ state.room.actualGame.templateAnswer }}
            {{ roundAnswerLabel ? roundAnswerLabel : roundAnswer }}</span
          >
          <span v-else>En attente des autres soifeurs...</span>
        </h2>
      </div>
      <v-card class="rounded-lg" elevation="5">
        <v-list lines="two">
          <v-list-subheader v-if="state.player.winner"
            >Vous pouvez donner {{ state.player.soifToGive }} soif !</v-list-subheader
          >
          <template v-for="(player, idx) in playerItems" :key="player.socketId">
            <v-list-item @click="playerHandleClick(player)">
              <template v-slot:prepend>
                <v-badge
                  dot
                  :color="player.readyForNextRound ? 'green' : 'red'"
                  offset-x="0"
                  offset-y="8"
                >
                  <PlayerAvatar :player="player" :avatar-size="60" />
                </v-badge>
              </template>

              <template v-slot:title>
                <div class="d-flex justify-content-space-around">
                  <p class="text-h6">{{ player.gameValueLabel }}</p>
                </div>
              </template>

              <template v-slot:subtitle>
                <v-chip v-if="player.soifToGive > 0" class="bg-gradient-warning mr-1" small
                  >{{ player.soifToGive }}<v-icon>mdi-glass-mug-variant</v-icon>
                </v-chip>
                {{ player.pseudo }}
              </template>

              <template v-slot:append>
                <v-chip
                  v-if="player.soifAddedThisRound > 0"
                  class="bg-gradient-success mr-2"
                  variant="flat"
                  small
                >
                  + {{ player.soifAddedThisRound }}
                </v-chip>
                <!-- ma-2  -->
                <v-chip class="bg-gradient-info" small>
                  {{ player.soifTotal }}
                  <v-icon>mdi-glass-mug-variant</v-icon>
                </v-chip>
              </template>
            </v-list-item>
            <v-divider
              inset
              v-if="idx < playerItems.length - 1"
              :key="`${idx}-divider`"
            ></v-divider>
          </template>
        </v-list>
      </v-card>

      <!-- WHO GIVE SOIF TO ME -->
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn
            :disabled="soifGivedByPlayer.length <= 0"
            class="w-100 bg-gradient-info text-white text-uppercase text-h6 mt-5 rounded-xl"
            v-bind="props"
          >
            Qui m'a donné ?
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(player, idx) in soifGivedByPlayer" :key="player.socketId">
            <div class="d-flex align-center">
              <PlayerAvatar :player="player" :avatar-size="60" />
              <p class="ml-3">{{ player.pseudo }}</p>
            </div>
            <template v-slot:append>
              <v-chip class="bg-gradient-success mr-2" variant="flat" small>
                + {{ player.gived }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- READY -->
      <v-btn
        v-if="!state.player.readyForNextRound"
        :disabled="state.player.soifToGive > 0"
        class="w-100 bg-gradient-success text-white text-h6 mt-5 rounded-xl"
        @click="readyForNextRound"
      >
        {{ state.player.soifToGive > 0 ? 'Donnes tes soifs...' : 'PRÊT' }}
      </v-btn>
    </v-container>

    <JokerMenu :jokers="state.player.jokers" />
  </div>
</template>

<script>
import { state, socket } from '@/socket'
import PlayerAvatar from './PlayerAvatar.vue'
import JokerMenu from './JokerMenu.vue'

export default {
  components: {
    PlayerAvatar,
    JokerMenu
  },
  data() {
    return {
      state
    }
  },
  watch: {
    allPlayerHasPlayed(newVal) {
      console.log(newVal, state.player.soifToGive)
      if (newVal === true && state.player.soifToGive > 0) {
        this.$emit('confetti')
      }
    }
  },
  created() {
    if (this.allPlayerHasPlayed && state.player.soifToGive > 0) {
      this.$emit('confetti')
    }
  },
  computed: {
    playerItems() {
      return state.room.players
    },
    allPlayerHasPlayed() {
      return this.playerItems.every((e) => e.hasPlayed)
    },
    roundAnswer() {
      return state.room.roundAnswer
    },
    roundAnswerLabel() {
      return state.room.roundAnswerLabel
    },
    soifGivedByPlayer() {
      return state.player.soifGivedBy.sort((a, b) => b.gived - a.gived)
    }
  },
  methods: {
    playerHandleClick(target) {
      // If a joker with target needed
      if (state.jokerUsed.target === true) {
        state.jokerUsed.target = target.socketId
        return
      }
      if (state.player.soifToGive) {
        if (target.hasInvincibleJoker > 0) {
          alert(`${target.pseudo} est invincible pendant ${target.hasInvincibleJoker} tour`)
          return
        }
        this.giveSoif(target.socketId)
      }
    },
    giveSoif(socketId) {
      if (state.player.givedSoif) return
      socket.emit('Game:GiveSoif', socketId, 1)
    },

    readyForNextRound() {
      socket.emit('Game:ReadyForNextRound'), (state.player.readyForNextRound = true)
    },

    quitRoom() {
      if (confirm('Es-tu sûr de vouloir quitter la partie en cours ?')) {
        this.$emit('Room:Quit')
        state.room = {}
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  user-select: none;
}
</style>
