<template>
  <v-container>
    <v-icon @click="quitRoom" class="position-fixed top-0 right-0 text-h4 ma-3"
      >mdi mdi-door</v-icon
    >
    <div class="w-100 text-center ma-5">
      <h2>
        <v-icon>mdi-podium</v-icon>
      </h2>
    </div>
    <v-card title="Classement des soifeurs" class="rounded-lg">
      <v-list>
        <template v-for="(player, idx) in playerItems" :key="player.socketId">
          <v-list-item>
            <template v-slot:prepend>
              <PlayerAvatar :player="player" :avatar-size="60"> </PlayerAvatar>
            </template>

            <template v-slot:title>
              <div class="d-flex ml-3">
                <p class="text-h6">{{ player.pseudo }}</p>
                <v-chip v-if="idx < 3" class="ml-2 bg-gradient-success">{{ idx + 1 }}</v-chip>
              </div>
            </template>

            <template v-slot:append>
              <v-chip class="ma-2 bg-gradient-warning">
                {{ player.totalSoifGived }}
              </v-chip>
              <v-chip class="ma-2 bg-gradient-info">{{ player.soifTotal }}</v-chip>
            </template>
          </v-list-item>
          <v-divider inset v-if="idx < playerItems.length - 1" :key="`${idx}-divider`"></v-divider>
        </template>
      </v-list>
    </v-card>
    <div class="pa-5 w-100">
      <v-btn
        v-if="state.player.isRoomMaster"
        class="w-100 bg-gradient-success text-white rounded-xl"
        @click="replay"
      >
        Rejouer
      </v-btn>
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
      state
    }
  },
  computed: {
    playerItems() {
      return state.room.players.sort((a, b) => b.totalSoifGived - a.totalSoifGived)
    },
    roundAnswer() {
      return state.room.roundAnswer
    }
  },
  created() {
    const position = this.playerItems.indexOf(
      this.playerItems.find((e) => e.socketId === state.player.socketId)
    )
    if (this.playerItems.length > 3 && position < 3 || this.playerItems.length < 3 && position === 1) {
      this.$emit('confetti', 'TOP1')
    }
  },
  methods: {
    replay() {
      socket.emit('Game:Replay')
    },

    quitRoom() {
      if (confirm('Es-tu sûr de vouloir quitter la partie en cours ?')) {
        this.$emit('Room:Quit')
      }
    }
  }
}
</script>
