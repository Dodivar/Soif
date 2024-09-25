<template>
  <v-container class="text-center text-white">
    <h1 class="dancing-script-text text-h1 mb-10">Wiz Waz !</h1>

    <v-sheet class="w-100 text-black nunito-text rounded-lg pa-5 ma-auto" elevation="10">
      <div v-if="isFinished">
        <h3>Qui est le perdant ?</h3>
        <template v-for="(player, idx) in playerItems" :key="player.socketId">
          <v-list-item @click="setLooser(player)" class="text-left">
            <template v-slot:prepend>
              <PlayerAvatar :player="player" :avatar-size="60" class="mr-3" />
              <p class="text-h6">{{ player.pseudo }}</p>
            </template>
          </v-list-item>
          <v-divider inset v-if="idx < playerItems.length - 1" :key="`${idx}-divider`"></v-divider>
        </template>
      </div>
      <div v-else>
        <PlayerAvatar
          :player="playerStarting"
          :avatar-size="120"
          :show-pseudo="true"
        ></PlayerAvatar>
        <h3>Tu commences !</h3>
      </div>
    </v-sheet>

    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn class="w-100 bg-gradient-info mt-5" v-bind="props"> Les règles du jeu </v-btn>
      </template>
      <v-sheet elevation="10">
        <ul>
          <li>2 possibilités, dire Wiz ou Waz, le joueur désigné commence</li>
          <li>Wiz envoie la parole au joueur suivant dans le sens des aiguilles d'une montre</li>
          <li>
            Waz envoie la parole au joueur suivant dans le sens INVERSE des aiguilles d'une montre,
            et inverse par la même occasion le sens du Wiz
          </li>
          <li>
            Le premier joueur à se tromper perd ! Soit en parlant sans que ce soit son tour ou si 2
            secondes se sont écoulées sans parler.
          </li>
        </ul>
      </v-sheet>
    </v-menu>

    <v-btn
      v-if="isRoomMaster && !isFinished"
      class="w-100 bg-gradient-success mt-5"
      @click="isFinished = true"
      >Terminé</v-btn
    >
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import PlayerAvatar from '@/components/PlayerAvatar.vue'

export default {
  components: {
    PlayerAvatar
  },
  data() {
    return {
      state,
      playerStarting: {},
      isFinished: false
    }
  },
  watch: {
    'state.room.actualGame.looser'(newVal) {
      if (!newVal) return
      this.playGame(newVal.socketId !== state.player.socketId)
    }
  },
  computed: {
    isRoomMaster() {
      return state.player.isRoomMaster
    },
    playerItems() {
      return state.room.players
    }
  },
  created() {
    this.playerStarting = state.room.actualGame.playerStarting
  },
  methods: {
    setLooser(player) {
      socket.emit('WizWaz:SetLooser', player.socketId)
    },
    playGame(win) {
      socket.emit('Game:PlayGame', win)
    }
  }
}
</script>

<style scoped></style>
