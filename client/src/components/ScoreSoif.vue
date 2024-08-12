<template>
  <v-container>
    <h2 class="ma-5 text-center">{{ state.room.actualGame.templateAnswer }}: {{ roundAnswer }}</h2>
    <v-card title="Liste des soifeurs" class="rounded-lg">
      <v-list>
        <v-list-subheader v-if="state.player.winner"
          >Vous pouvez donner {{ state.player.soifToGive }} soif !</v-list-subheader
        >
        <v-list-item
          v-for="player in playerItems"
          :key="player.socketId"
          :subtitle="`Score ${player.gameValue}`"
          @click="state.player.winner ? giveSoif(player.socketId) : null"
        >
          <template v-slot:title>
            {{ player.pseudo }}
            <v-chip v-if="state.player.winner" class="ma-2 bg-gradient-warning"
              >Gagné : {{ player.soifToGive }}</v-chip
            >
          </template>
          <!-- Prepend -->
          <template v-slot:prepend>
            <v-avatar color="brown">
              <span class="text">{{ player.pseudo[0] }}</span>
            </v-avatar>
          </template>

          <!-- Append -->
          <template v-slot:append>
            <v-chip v-if="player.soifAddedThisRound > 0" class="bg-gradient-success" variant="flat">
              + {{ player.soifAddedThisRound }}
            </v-chip>
            <v-chip class="ma-2 bg-gradient-info">
              {{ player.soifTotal }}
            </v-chip>
          </template>
        </v-list-item>
        <v-divider inset></v-divider>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  data() {
    return {
      state
    }
  },
  computed: {
    playerItems() {
      return state.room.players
    },
    roundAnswer() {
      return state.room.roundAnswer
    }
  },
  methods: {
    giveSoif(socketId) {
      socket.emit('give soif', socketId, state.player.soifToGive)
    }
  }
}
</script>
