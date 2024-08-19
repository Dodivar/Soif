<template>
  <div>
    <v-avatar
      :size="avatarSize"
      :color="avatar ? null : 'white'"
      class="elevation-8"
      @click="canBeModified ? makeAvatar() : null"
    >
      <!-- style="display: none" -->
      <video v-if="canBeModified" autoplay muted playsinline id="videoPreview"></video>
      <canvas v-if="canBeModified" id="avatarCanvas" style="display: none"></canvas>

      <v-img v-if="avatar" alt="Avatar" :src="avatar"></v-img>
      <span v-else-if="player.pseudo" class="text">{{ player.pseudo[0] }}</span>
    </v-avatar>
    <p v-if="showPseudo" class="text-h5 text-center my-3">
      <v-icon v-if="showRoomMaster && player.isRoomMaster">mdi mdi-crown</v-icon>
      {{ player.pseudo }}
    </p>
  </div>
</template>

<script>
import { state } from '@/socket'

export default {
  data() {
    return {
      state,
      avatarCanvas: null,
      stream: null,
      videoPreview: null,
      avatar: null
    }
  },
  props: {
    player: {
      type: Object,
      default: () => {}
    },
    avatarSize: {
      type: Number,
      default: 120
    },
    canBeModified: {
      type: Boolean,
      default: false
    },
    showPseudo: {
      type: Boolean,
      default: false
    },
    showRoomMaster: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.avatar = this.getPlayerAvatar(this.player.socketId)
  },
  mounted() {
    this.avatarCanvas = document.getElementById('avatarCanvas')
    this.videoPreview = document.getElementById('videoPreview')
  },
  methods: {
    async makeAvatar() {
      if (this.stream) {
        this.takePhoto()
      } else {
        try {
          navigator.mediaDevices
            .getUserMedia({
              audio: false,
              video: { facingMode: 'user' }
            })
            .then((stream) => {
              this.stream = stream
              this.videoPreview.srcObject = this.stream
              this.videoPreview.style.display = 'block'
              this.videoPreview.play()
            })
        } catch (err) {
          console.error("Erreur d'accès à la caméra: ", err)
          alert("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.")
        }
      }
    },
    takePhoto() {
      this.avatarCanvas.width = this.videoPreview.videoWidth
      this.avatarCanvas.height = this.videoPreview.videoHeight
      this.avatarCanvas.getContext('2d').drawImage(this.videoPreview, 0, 0)

      const base64Image = this.avatarCanvas.toDataURL('image/jpeg')
      localStorage.setItem('playerAvatar', base64Image)
      // state.player.avatar = base64Image
      this.avatar = this.getPlayerAvatar(this.player.socketId)

      // Arrêter le flux vidéo
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
      this.videoPreview.style.display = 'none'
    },
    /**
     * Récupère la photo en local si utilisateur courant, ou en session si joueur présent dans la room
     * @param socketId
     */
    getPlayerAvatar(socketId) {
      if (state.player?.socketId === socketId) {
        return localStorage.getItem('playerAvatar')
      }
      return sessionStorage.getItem(`playerAvatar-${socketId}`)
    }
  }
}
</script>

<style scoped></style>
