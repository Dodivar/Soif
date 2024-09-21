<template>
  <v-container>
    <!-- <h1>Tu possèdes le champion :</h1>
    {{ championChoose }} -->
    <v-data-iterator :items="allChampions" :items-per-page="allChampions.length">
      <template v-slot:default="{ items }">
        <v-row>
          <v-col v-for="(item, i) in items" :key="i" cols="12" sm="4" xl="3">
            <v-sheet
              class="rounded champion-sheet cursor-pointer"
              :class="{ selected: item.raw.id === championChoose, disabled: item.raw.isDisabled }"
              elevation="10"
              @click="!item.raw.isDisabled ? setChampion(item.raw.id) : null"
            >
              <!-- <v-img
                :gradient="`to top right, rgba(255, 255, 255, .1), rgba(${item.raw.color}, .15)`"
                height="150"
                cover
              ></v-img> -->

              <v-list-item :title="item.raw.name" density="comfortable">
                <template v-slot:title>
                  <p class="text-h6">
                    {{ item.raw.name }}
                  </p>
                </template>
                <template v-slot:subtitle>
                  <strong>{{ item.raw.passif ? 'Passif : ' : 'Pouvoir : ' }}</strong>
                  {{ item.raw.description }}
                </template>
                <div v-if="item.raw.reloadPower">
                  <v-divider class="my-1" />
                  <p>
                    Recharge du pouvoir :
                    {{ item.raw.reloadPower }}
                  </p>
                </div>
              </v-list-item>
            </v-sheet>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>

    <v-btn class="w-100 bg-gradient-info mt-5" @click="goToSaloon()">RETOUR</v-btn>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
import * as ChampionsTools from '@/champions/championTools'

export default {
  data() {
    return {
      state,
      allChampions: []
    }
  },
  computed: {
    championChoose() {
      return state.player.champion
    }
  },
  created() {
    this.allChampions = ChampionsTools.GetAll()
    this.getChampion()
  },
  mounted() {},
  methods: {
    getChampion() {
      this.$emit('get-champion')
    },
    setChampion(id) {
      localStorage.setItem('playerChampion', id)
      this.getChampion()

      // Refresh champion to players
      if (state.room.roomId) {
        socket.emit('Room:SetChampion', id)
      }
    },
    goToSaloon() {
      this.$emit('quit-configuration')
    }
  }
}
</script>

<style lang="scss" scoped>
.champion-sheet {
  &.selected {
    background-color: rgb(170 255 166);
  }
  &.disabled {
    color: rgba(var(--v-theme-on-surface), 0.26);
    background: rgb(var(--v-theme-surface));
  }
}
</style>
