<template>
  <div>
    <Timer :time="10" @end-timer="setChoice('🥴')"></Timer>

    <v-sheet
      id="red"
      class="bg-red text-h1 d-flex align-center justify-center"
      @click="setChoice('ROUGE')"
    >
      <!-- ROUGE -->
    </v-sheet>
    <v-sheet
      id="black"
      class="bg-black text-h1 d-flex align-center justify-center"
      @click="setChoice('NOIR')"
    >
      <!-- NOIR -->
    </v-sheet>
  </div>
</template>

<script>
import { state, socket } from '@/socket'
import Timer from '@/components/Timer.vue'

export default {
  components: {
    Timer
  },
  data() {
    return {
      state,
      choice: null
    }
  },
  computed: {
    hasChoose() {
      return this.choice != null
    }
  },
  methods: {
    setChoice(val) {
      this.choice = val
      socket.emit('Game:PlayGame', val)
    }
  },
  created() {}
}
</script>

<style scoped>
.v-sheet {
  width: 100%;
  height: 50%;
  position: fixed;
  user-select: none;
}

#red {
  top: 0;
  left: 0;
}
#black {
  bottom: 0;
  left: 0;
}
</style>
