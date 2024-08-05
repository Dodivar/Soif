<template>
  <v-card class="mx-auto" max-width="300" :title="`La réponse était ${roundAnswer}`">
    <h3 v-if="hasWin">Vous pouvez donner {{ soifToAdd }} soif !</h3>
    <v-list :items="playerItems">
      <v-list-subheader inset>Liste des buveurs</v-list-subheader>
      <v-list-item
        v-for="player in playerItems"
        :key="player.socketId"
        :title="player.pseudo"
        :subtitle="`Nombre de soif: ${player.soif}`"
        @click="hasWin ? giveSoif(player.id) : null"
      >
        <!-- Prepend -->
        <template v-slot:prepend>
          <v-avatar color="brown">
            <span class="text">{{ player.pseudo }}</span>
          </v-avatar>
        </template>

        <!-- Append -->
        <template v-slot:append>
          <v-chip v-if="player.soifAdded > 0" color="green" variant="flat">
            +{{ player.soifAdded }}
          </v-chip>
          <span v-if="typeof player.gameValue === 'string' || typeof player.gameValue === 'number'">
            {{ player.gameValue }}</span
          >
          <span v-else>A répondu</span>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  data() {
    return {
      state
    }
  },
  props: {
    soifToAdd: {
      type: Number,
      default: 2
    }
  },
  computed: {
    playerItems() {
      return state.room.players
    },
    roundAnswer() {
      return state.room.roundAnswer
    },
    hasWin() {
      return state.room.players.find((e) => e.gameValue === this.roundAnswer)
    }
  },
  methods: {
    giveSoif(socketId) {
      socket.emit('give soif', socketId, this.soifToAdd)
    }
  }
}
</script>
