<template>
  <v-app>
    <!-- <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Soif !</v-app-bar-title>
    </v-app-bar> -->
    <v-main>
      <StartMenu />

      <v-bottom-navigation v-model="navigation" color="primary" grow>
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
      </v-bottom-navigation>
    </v-main>
  </v-app>
</template>

<script>
import StartMenu from './components/StartMenu.vue'

export default {
  components: {
    StartMenu
  },
  data() {
    return {
      navigation: 1
    }
  }
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
/* 
header {
  line-height: 1.5;
} */
/* 
.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
} */
</style>
