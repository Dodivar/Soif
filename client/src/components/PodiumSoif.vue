<template>
  <v-container>
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
                Donnée :
                {{ player.totalSoifGived }}
              </v-chip>
              <v-chip class="ma-2 bg-gradient-info"> Total : {{ player.soifTotal }} </v-chip>
            </template>
          </v-list-item>
          <v-divider inset v-if="idx < playerItems.length - 1" :key="`${idx}-divider`"></v-divider>
        </template>
      </v-list>
      <v-card-action>
        <div class="text-center ma-2">
          <v-btn
            v-if="state.player.isRoomMaster"
            class="w-100 bg-gradient-success text-white"
            @click="replay"
          >
            Rejouer
          </v-btn>
        </div>
      </v-card-action>
    </v-card>
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
      return state.room.players.sort((a, b) => a.soifTotal - b.soifTotal)
    },
    roundAnswer() {
      return state.room.roundAnswer
    }
  },
  methods: {
    replay() {
      socket.emit('replay')
    }
  }
}
</script>
