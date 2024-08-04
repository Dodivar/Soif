<template>
  <v-card class="mx-auto" title="Tableau des soifs">
    <v-list :items="playerItems">
      <v-list-subheader inset>Liste des soifeurs</v-list-subheader>
      <v-list-item
        v-for="player in playerItems"
        :key="player.id"
        :title="player.pseudo"
        :subtitle="`Soif: ${player.soif}`"
      >
        <template v-slot:prepend>
          <v-avatar color="brown">
            <span class="text">{{ player.pseudo }}</span>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-chip v-if="player.soifAdded > 0" color="green" variant="flat">
            +{{ player.soifAdded }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>
    <!-- <v-btn color="success" @click="">J'ai plus soif !</v-btn> -->
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
  created() {
    state.player.rightAnswer = null
    state.player.gameValue = null

    setTimeout(() => {
      socket.emit('score timeout')
    }, 2000)
  },
  computed: {
    playerItems() {
      return state.room.players.sort((e) => e.soif)
    }
  },
  methods: {}
}
</script>
