<template>
  <div>
    <h1>Wiz Waz !</h1>

    
    <PlayerAvatar :player="playerStarting" :avatar-size="120" :show-pseudo="true"></PlayerAvatar>
    <h3 class="">Tu commences !</h3>
    

    <h3 class="">Les règles du jeu :</h3>
    <ul>
      <li>2 possibilités, dire Wiz ou Waz, le joueur désigné commence</li>
      <li>Wiz envoie la parole au joueur suivant dans le sens des aiguilles d'une montre</li>
      <li>Waz envoie la parole au joueur suivant dans le sens INVERSE des aiguilles d'une montre, et inverse par la même occasion le sens du Wiz</li>
      <li>Le premier joueur à se tromper perd ! Soit en parlant sans que ce soit son tour ou si 2 secondes se sont écoulées sans parler.</li>
    </ul>
  </div>

  <div v-if="isRoomMaster">    
    <div v-if="isFinished">
      <h3>Qui est le perdant ?</h3>
      <template v-for="(player, idx) in playerItems" :key="player.socketId">
          <v-list-item @click="setLooser(player)">
            <template v-slot:prepend>
                <PlayerAvatar :player="player" :avatar-size="60" />
            </template>

            <template v-slot:subtitle>
              {{ player.pseudo }}
            </template>

          </v-list-item>
          <v-divider inset v-if="idx < playerItems.length - 1" :key="`${idx}-divider`"></v-divider>
        </template>
    </div>
    <v-btn v-else class="w-25 bg-gradient-success">Terminé</v-btn>
  </div>


</template>

<script>
import { state, socket } from '@/socket'
import PlayerAvatar from '@/components/PlayerAvatar.vue'

export default {
  components: {
    PlayerAvatar,
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
    },
  },
  created() {
    this.playerStarting = state.room.actualGame.playerStarting
  },
  methods: {
    setLooser(socketId) {
      socket.emit("Game:PlayGame", socketId)
    },
    playGame(win) {
      socket.emit('Game:PlayGame', win)
    },
  },
}
</script>

<style scoped>
</style>
