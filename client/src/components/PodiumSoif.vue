<template>
  <v-container>
    <div class="w-100 text-center ma-5">
      <h2>
        <v-icon>mdi-podium</v-icon>
      </h2>
    </div>
    <v-card title="Classement des soifeurs" class="rounded-lg">
      <v-list>
        <v-list-subheader>!</v-list-subheader>
        <v-list-item
          v-for="(player, idx) in playerItems"
          :key="player.socketId"
          @click="state.player.winner ? giveSoif(player.socketId) : null"
        >
          <!-- Prepend -->
          <template v-slot:prepend>
            <v-avatar color="brown">
              <span class="text">{{ player.pseudo[0] }}</span>
            </v-avatar>
          </template>

          <template v-slot:title>
            <div class="d-flex">
              <p class="text-h6">{{ player.pseudo }}</p>
              <v-chip v-if="idx === 0" class="ml-2 bg-gradient-success">Premier</v-chip>
              <v-chip v-else-if="idx === 1" class="ml-2 bg-gradient-warning">Deuxième</v-chip>
              <v-chip v-else-if="idx === 2" class="ml-2 bg-gradient-info">Troisième</v-chip>
            </div>
          </template>
          <!-- 
          <template v-slot:subtitle>
            {{ player.pseudo }}
          </template> -->

          <!-- Append -->
          <template v-slot:append>
            <v-chip class="ma-2 bg-gradient-info">
              {{ player.soifTotal }}
            </v-chip>
          </template>
          <v-divider inset></v-divider>
        </v-list-item>
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
      return state.room.players.sort((a, b) => a.soifTotal > b.soifTotal)
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
