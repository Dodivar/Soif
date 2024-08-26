<template>
  <v-app>
    <v-main>
      <StartMenu />

      <!-- <v-bottom-navigation v-model="navigation" color="primary" grow>
        <v-btn>
          <v-icon>mdi-history</v-icon>
          Classement
        </v-btn>

        <v-btn>
          <v-icon>mdi-heart</v-icon>
          Jouer
        </v-btn>

        <v-btn>
          <v-icon>mdi-map-marker</v-icon>
          Profil
        </v-btn>
      </v-bottom-navigation> -->
      <v-snackbar
        :timeout="3000"
        color="deep-purple-accent-4"
        elevation="24"
        @click="state.snackbarElement.visible = false"
      >
        {{ state.snackbarElement.message }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import StartMenu from './components/StartMenu.vue'
import { state } from '@/socket'

export default {
  components: {
    StartMenu
  },
  data() {
    return {}
  },
  created() {}
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.v-app {
  background-color: #f8f9fa;
}
</style>
