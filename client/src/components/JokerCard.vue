<template>
  <v-card class="pa-2 my-3 rounded-lg" elevation="2" :disabled="isDisabled" @click="jockerAction">
    <div class="d-flex justify-space-between align-center">
      <div>
        <div :class="`${rarity?.value} d-flex align-center`">
          <v-icon v-if="icon" class="mr-1">mdi mdi-{{ icon }}</v-icon>
          <h3>{{ title }}</h3>
        </div>
        <p>{{ description }}</p>
      </div>
    </div>
  </v-card>
</template>

<script>
import { state, socket } from '@/socket'

export default {
  props: {
    jokerId: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: 'phone'
    },
    rarity: {
      type: Object,
      default: () => {}
    },
    isTargeted: {
      type: Boolean,
      default: false
    },
    canBeActivated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      state,
      jokerIdSelected: null
    }
  },
  watch: {
    'state.jokerTarget'(newValue) {
      if (newValue !== null && newValue !== true && typeof newValue === 'string') {
        this.jockerAction()
      }
    }
  },
  computed: {
    isDisabled() {
      if (!this.canBeActivated) return false
      
      switch (this.title) {
        case 'Le boss':
          return state.player.hasWinnerJoker ?? false
        case 'Le piège':
          return state.player.hasTrapJoker ?? false
        case 'Le bouclier':
        case 'Le boucher':
          return state.player.soifAddedThisRound <= 0
        case "L'abuseur":
        case 'Quitte ou double':
        case 'Miroir':
        case "L'appel à un ami":
          return state.player.soifToGive <= 0
        default:
          break
      }
      return false
    }
  },
  methods: {
    jockerAction() {
      if (!this.canBeActivated || state.jokerTarget === true) return

      this.jokerIdSelected = this.jokerId

      // Ask to target someone
      if (this.isTargeted && state.jokerTarget === null) {
        alert('click sur le joueur que tu souhaites viser')
        state.jokerTarget = true
        return
      }

      console.log(state.jokerTarget)
      // Use it
      socket.emit('Game:UseJoker', this.jokerId, state.jokerTarget)
      state.jokerTarget = null
    }
  }
}
</script>

<style lang="scss" scoped>
h3 {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
}
.nothing {
  background: -webkit-linear-gradient(#b6b6b6, #6a6a6a);
  background-clip: text;
}
.common {
  background: -webkit-linear-gradient(#98ec2d, #17ad37);
  background-clip: text;
}
.rare {
  background: -webkit-linear-gradient(#21d4fd, #2152ff);
  background-clip: text;
}
.epic {
  background: -webkit-linear-gradient(#d400ff, #580fa1);
  background-clip: text;
}
.legendary {
  background: -webkit-linear-gradient(#fbcf33, #f53939);
  background-clip: text;
}
</style>
