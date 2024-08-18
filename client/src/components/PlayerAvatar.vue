<template>
  <div>
    <v-avatar
      :size="avatarSize"
      :color="player.avatar ? null : 'white'"
      class="elevation-8"
      @click="canBeModified ? makeAvatar() : null"
    >
      <video
        v-if="canBeModified"
        id="videoPreview"
        autoplay
        playsinline
        style="display: none"
      ></video>
      <canvas v-if="canBeModified" id="avatarCanvas" style="display: none"></canvas>

      <v-img v-if="player.avatar" alt="Avatar" :src="player.avatar"></v-img>
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
      videoPreview: null
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
          this.stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          })
          this.videoPreview.srcObject = this.stream
          this.videoPreview.style.display = 'block'
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
      state.player.avatar = base64Image

      // Arrêter le flux vidéo
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
      this.videoPreview.style.display = 'none'
    }
  }
}
</script>

<style scoped></style>
