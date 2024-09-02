<template>
  <v-container>
    <p class="position-fixed top-0 right-0 ma-5">{{ state.room.roomId }}</p>
    <div class="w-100 text-center my-5">
      <h2>
        <span v-if="allPlayerHasPlayed"
          >{{ state.room.actualGame.templateAnswer }}
          {{ roundAnswerLabel ? roundAnswerLabel : roundAnswer }}</span
        >
        <span v-else>En attente des autres soifeurs...</span>
      </h2>
    </div>
    <v-card title="Liste des soifeurs" class="rounded-lg" elevation="5">
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
              <v-chip v-if="player.soifToGive > 0" class="bg-gradient-warning mr-1"
                >{{ player.soifToGive }}<v-icon>mdi-glass-mug-variant</v-icon>
              </v-chip>
              {{ player.pseudo }}
            </template>

            <template v-slot:append>
              <v-chip
                v-if="player.soifAddedThisRound > 0"
                class="bg-gradient-success"
                variant="flat"
              >
                + {{ player.soifAddedThisRound }}
              </v-chip>
              <v-chip class="ma-2 bg-gradient-info">
                {{ player.soifTotal }}
                <v-icon>mdi-glass-mug-variant</v-icon>
              </v-chip>
            </template>
          </v-list-item>
          <v-divider inset v-if="idx < playerItems.length - 1" :key="`${idx}-divider`"></v-divider>
        </template>
      </v-list>
    </v-card>
    <v-btn
      v-if="!state.player.readyForNextRound"
      :disabled="state.player.soifToGive > 0"
      class="w-100 bg-gradient-success text-white text-h6 mt-5 rounded-xl"
      @click="readyForNextRound"
    >
      {{ state.player.soifToGive > 0 ? 'Donnes tes soifs...' : 'PRÊT' }}
    </v-btn>
    <JokerMenu :jokers="state.player.jokers" />
  </v-container>
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
    }
  },
  methods: {
    playerHandleClick(target) {
      console.log(target)
      // If a joker with target needed
      if (state.jokerTarget === true) {
        state.jokerTarget = target.socketId
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
      socket.emit('Game:ReadyForNextRound')
      state.player.readyForNextRound = true
    }
  }
}
</script>

<style scoped>
.v-card {
  user-select: none;
}
</style>
