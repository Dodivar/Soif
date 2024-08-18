<template>
  <v-container>
    <div class="w-100 text-center ma-5">
      <h2>
        <span v-if="allPlayerHasPlayed"
          >{{ state.room.actualGame.templateAnswer }} {{ roundAnswer }}</span
        >
        <span v-else>En attente des autres soifeurs...</span>
      </h2>
    </div>
    <v-card title="Liste des soifeurs" class="rounded-lg">
      <v-list lines="two">
        <v-list-subheader v-if="state.player.winner"
          >Vous pouvez donner {{ state.player.soifToGive }} soif !</v-list-subheader
        >
        <template v-for="(player, idx) in playerItems" :key="player.socketId">
          <v-list-item @click="state.player.winner ? giveSoif(player.socketId) : null">
            <template v-slot:prepend>
              <PlayerAvatar :player="player" :avatar-size="60" class="mr-3"></PlayerAvatar>
            </template>

            <template v-slot:title>
              <div class="d-flex">
                <p class="text-h6">{{ player.gameValue }}</p>
                <v-chip v-if="player.soifToGive > 0" class="ml-2 bg-gradient-warning"
                  >{{ player.soifToGive }}<v-icon>mdi-glass-mug-variant</v-icon>
                </v-chip>
              </div>
            </template>

            <template v-slot:subtitle>
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
    <div class="my-2">
      <h4>Description du prochain jeu :</h4>
      <p>{{ state.room.nextGameDescription }}</p>
    </div>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import PlayerAvatar from './PlayerAvatar.vue'

export default {
  components: {
    PlayerAvatar
  },
  data() {
    return {
      state,
      gived: false
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
    }
  },
  methods: {
    giveSoif(socketId) {
      if (this.gived) return
      this.gived = true
      socket.emit('give soif', socketId, state.player.soifToGive)
    }
  }
}
</script>
