<template>
  <v-container id="game-container">
    <countdown @countdown-end="startGame"></countdown>
    <h1>AI Facial Expression Detector</h1>
    <video id="video" width="640" height="480" autoplay></video>
    <div id="result">Expression: {{ expression }}</div>
    <div id="emoji">{{ emoji }}</div>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import countdown from '@/components/Countdown.vue'

export default {
  components: {
    countdown
  },
  data() {
    return {
      state,
      video: null,
      expression: null,
      emoji: null
    }
  },
  methods: {
    async setupCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      this.video.srcObject = stream
      return new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          resolve(this.video)
        }
      })
    },

    async detectFace() {
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      )

      setInterval(async () => {
        const predictions = await model.estimateFaces({
          input: this.video,
          returnTensors: false,
          flipHorizontal: false,
          predictIrises: false
        })

        if (predictions.length > 0) {
          const face = predictions[0]
          this.expression = this.getExpression(face)
          this.emoji = this.getEmoji(this.expression)
        }
      }, 100)
    },

    getExpression(face) {
      const mouthOpen = face.meshes[13][1] - face.meshes[14][1]
      const eyebrowRaise = face.meshes[9][1] - face.meshes[5][1]

      if (mouthOpen > 30) return 'Sourire'
      if (eyebrowRaise > 15) return 'Surprise'
      if (mouthOpen < 10 && eyebrowRaise < 5) return 'Neutre'
      return 'Indéterminé'
    },

    getEmoji(expression) {
      switch (expression) {
        case 'Sourire':
          return '😃'
        case 'Surprise':
          return '😮'
        case 'Neutre':
          return '😐'
        default:
          return '🤔'
      }
    },

    async startGame() {
      await this.setupCamera()
      this.video.play()
      this.detectFace()
    }
  },
  created() {}
}
</script>

<style scoped>
#game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  /* display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer; */
}
#video {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
#result {
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
}
#emoji {
  font-size: 48px;
  margin-top: 10px;
}
</style>
