<template>
  <div>
    <!-- OPTION -->
    <div
      class="w-100 text-white nunito-text position-absolute top-0 d-flex align-center justify-space-between px-5 pt-5"
    >
      <p>{{ state.room.roomId }}</p>
      <v-icon @click="quitRoom" class="text-h4">mdi mdi-door</v-icon>
    </div>

    <!-- CONTENT LIST -->
    <v-container class="my-10">
      <div class="w-100 text-white nunito-text text-center mb-5">
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
                {{ player.champion ? GetChampionName(player.champion) : player.pseudo }}
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

      <!-- WHO'S GIVE SOIF -->
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn
            :disabled="soifGivedByPlayer.length === 0"
            class="w-100 bg-gradient-info text-white text-uppercase text-h6 mt-5 rounded-xl"
            v-bind="props"
          >
            Qui m'a donné ?
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="player in soifGivedByPlayer" :key="player.socketId">
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
        class="w-100 bg-gradient-success text-white text-h6 mt-5 rounded-xl"
        @click="readyForNextRound"
      >
        PRÊT
      </v-btn>

      <v-sheet
        v-if="!playerChampion?.passif"
        elevation="10"
        class="w-100 rounded-lg d-flex align-center nunito-text mt-5 pa-2"
      >
        <v-progress-circular color="red" :model-value="championPowerValue" :size="50" :width="10">
          <template v-slot:default>
            {{ actualPowerReload }}/{{ playerChampion.reloadPower }}
          </template>
        </v-progress-circular>
        <div class="text-center ma-auto">
          <p>{{ playerChampion.description }}</p>
          <v-btn
            class="bg-gradient-primary text-white text-h6 rounded-xl"
            :disabled="!championPowerCanBeActivate"
            @click="usePlayerChampionPower"
          >
            {{ championPowerCanBeActivate ? 'activé' : 'chargement...' }}
          </v-btn>
        </div>
      </v-sheet>
    </v-container>

    <JokerMenu :jokers="state.player.jokers" />
  </div>
</template>

<script>
import { state, socket } from '@/socket'
import PlayerAvatar from './PlayerAvatar.vue'
import JokerMenu from './JokerMenu.vue'
import { GetChampionById, GetChampionName, championsId } from '@/champions/championTools'

export default {
  components: {
    PlayerAvatar,
    JokerMenu
  },
  data() {
    return {
      state,
      playerChampion: null,
      championPowerCanBeActivate: false,
      championPowerValue: 100,
      actualPowerReload: 3
    }
  },
  watch: {
    allPlayerHasPlayed(newVal) {
      if (newVal === true && state.player.soifToGive > 0) {
        this.$emit('confetti')
      }
    }
  },
  created() {
    if (this.allPlayerHasPlayed && state.player.soifToGive > 0) {
      this.$emit('confetti')
    }

    this.playerChampion = GetChampionById(state.player.champion)
    if (this.playerChampion?.reloadPower) {
      this.addPlayerChampionReload()
    }
  },
  computed: {
    playerItems() {
      return state.room.players
    },
    allPlayerHasPlayed() {
      return this.playerItems?.every((e) => e.hasPlayed)
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
        if (state.player.socketId === target.socketId) {
          alert('Tu ne peux pas te cibler toi-même, choisie un autre joueur')
        } else {
          state.jokerUsed.target = target.socketId
        }
        return
      }
      if (state.player.soifToGive) {
        if (target.hasInvincibleJoker > 0) {
          alert(`${target.pseudo} est invincible pendant ${target.hasInvincibleJoker} round`)
          return
        }
        if (target.champion === championsId.croixRouge && target.soifAddedThisRound >= 3) {
          alert(
            `${target.pseudo} fait partie de la croix rouge et ne peut pas boire plus de 3 soif chaque round`
          )
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
      if (state.player.soifToGive > 0) {
        if (
          !confirm(
            `Il te reste ${state.player.soifToGive} soif à distribuer, tu es sûr de vouloir passer au prochian round ?`
          )
        ) {
          return
        }
      }
      socket.emit('Game:ReadyForNextRound'), (state.player.readyForNextRound = true)
    },

    quitRoom() {
      if (confirm('Es-tu sûr de vouloir quitter la partie en cours ?')) {
        this.$emit('Room:Quit')
        state.room = {}
      }
    },
    usePlayerChampionPower() {
      socket.emit('Champion:UsePower', this.playerChampion.id)
      this.setPlayerChampionReload(0)
      this.actualPowerReload = this.getPlayerChampionReload()
      this.refreshChampionPowerValue()
    },
    addPlayerChampionReload() {
      // Create reload if no exist
      if (this.getPlayerChampionReload() === null) {
        this.setPlayerChampionReload(0)
      }
      if (this.getPlayerChampionReload() < this.playerChampion.reloadPower) {
        const reload = this.getPlayerChampionReload() + 1
        this.setPlayerChampionReload(reload)
      }

      this.actualPowerReload = this.getPlayerChampionReload()
      this.refreshChampionPowerValue()
    },
    refreshChampionPowerValue() {
      // Refresh value circular reload power
      this.championPowerValue = (this.actualPowerReload / this.playerChampion.reloadPower) * 100
      this.championPowerCanBeActivate =
        this.getPlayerChampionReload() === this.playerChampion.reloadPower
    },
    getPlayerChampionReload() {
      if (localStorage.getItem('playerChampion:Reload') === null) return null
      return Number(localStorage.getItem('playerChampion:Reload'))
    },
    setPlayerChampionReload(reload) {
      localStorage.setItem('playerChampion:Reload', reload)
    },
    GetChampionById,
    GetChampionName
  }
}
</script>

<style scoped>
.v-card {
  user-select: none;
}
</style>
