<template>
  <v-sheet
    class="rounded-t-xl bg-gradient-primary pa-2 position-fixed bottom-0 left-0 right-0 top-50"
    elevation="6"
    :class="isJokerMenuExpanded ? 'expandedSheet' : ''"
  >
    <h2
      class="text-white text-h6 cursor-pointer text-center"
      @click="isJokerMenuExpanded = !isJokerMenuExpanded"
    >
      JOKER {{ jokers.length }}
    </h2>
    <v-expand-transition>
      <div v-show="isJokerMenuExpanded">
        <v-btn
          v-if="state.jokerTarget"
          @click="state.jokerTarget = null"
          class="bg-gradient-warning text-white"
          >ANNULER</v-btn
        >
        <JokerCard
          v-for="joker in jokers"
          :key="joker.id"
          :joker-id="joker.id"
          :title="joker.name"
          :description="joker.description"
          :rarity="joker.rarity"
          :icon="joker.icon"
          :is-targeted="joker.isTargeted"
          :can-be-activated="true"
        ></JokerCard>
      </div>
    </v-expand-transition>
  </v-sheet>
</template>

<script>
import { state } from '@/socket'
import JokerCard from './JokerCard.vue'

export default {
  components: {
    JokerCard
  },
  props: {
    jokers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      state,
      isJokerMenuExpanded: false
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped></style>
