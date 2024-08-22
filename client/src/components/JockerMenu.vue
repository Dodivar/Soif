<template>
  <v-sheet
    class="rounded-t-xl bg-orange pa-2 position-fixed bottom-0 left-0 right-0 top-50"
    elevation="6"
    :class="isJockerMenuExpanded ? 'expandedSheet' : ''"
  >
    <h2
      class="text-white text-h6 cursor-pointer text-center"
      @click="isJockerMenuExpanded = !isJockerMenuExpanded"
    >
      JOKER {{ jockers.length }}
    </h2>
    <v-expand-transition>
      <div v-show="isJockerMenuExpanded">
        <JockerCard
          v-for="jocker in jockers"
          :key="jocker.id"
          :id-jocker="jocker.id"
          :title="jocker.title"
          :description="jocker.description"
          :icon="jocker.icon"
        ></JockerCard>
      </div>
    </v-expand-transition>
  </v-sheet>
</template>

<script>
import JockerCard from './JockerCard.vue'

export default {
  components: {
    JockerCard
  },
  props: {
    jockers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isJockerMenuExpanded: false
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped></style>
