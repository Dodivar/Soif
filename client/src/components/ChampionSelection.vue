<template>
  <v-container>
    <h1>Tu possèdes le champion :</h1>

    <v-data-iterator :items="configuration.games" :items-per-page="configuration.games.length">
      <template v-slot:default="{ items }">
        <v-row>
          <v-col v-for="(item, i) in items" :key="i" cols="12" sm="4" xl="3">
            <v-sheet border class="rounded">
              <!-- <v-img
                :gradient="`to top right, rgba(255, 255, 255, .1), rgba(${item.raw.color}, .15)`"
                height="150"
                cover
              ></v-img> -->

              <v-list-item
                :title="item.raw.name"
                density="comfortable"
                lines="two"
                :subtitle="item.raw.description"
              >
                <template v-slot:title>
                  <strong class="text-h6">
                    {{ item.raw.name }}
                  </strong>
                </template>
              </v-list-item>

              <v-table class="text-caption" density="compact">
                <tbody>
                  <tr v-if="item.raw.minPlayers" align="right">
                    <th>Joueur minimum requis :</th>
                    <td>
                      {{ item.raw.minPlayers }}
                    </td>
                  </tr>
                  <tr v-if="item.raw.soif" align="right">
                    <th>Soifs pour le vainqueur :</th>

                    <td>
                      <v-btn
                        density="compact"
                        elevation="3"
                        color="green"
                        icon="mdi-minus"
                        variant="outlined"
                        @click="decrementSoif(item)"
                      ></v-btn>
                      {{ item.raw.soif }}
                      <v-btn
                        density="compact"
                        elevation="3"
                        color="red"
                        icon="mdi-plus"
                        variant="outlined"
                        @click="incrementSoif(item)"
                      ></v-btn>
                    </td>
                  </tr>
                  <tr align="right">
                    <th>Activé :</th>

                    <td>
                      <v-switch
                        v-model="item.raw.isEnabled"
                        color="success"
                        hide-details
                      ></v-switch>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer="{ page, pageCount }">
        <v-footer class="justify-space-between text-body-2 ma-5" color="surface-variant">
          Total de jeux activés : {{ activatedGames.length }}

          <!-- <div>{{ page }}/{{ pageCount }}</div> -->
        </v-footer>
      </template>
    </v-data-iterator>

    <v-btn class="w-100 text-white bg-gradient-success rounded-xl" @click="saveConfiguration()"
      >SAUVEGARDER</v-btn
    >
    <v-btn
      class="w-100 text-white bg-gradient-warning my-5 rounded-xl"
      @click="deleteConfiguration()"
      >SUPPRIMER LA CONFIGURATION</v-btn
    >
    <v-btn class="w-100 text-white bg-gradient-info rounded-xl" @click="goToSaloon()">RETOUR</v-btn>
  </v-container>
</template>

<script>
import { state, socket } from '@/socket'
// import { GetAll } from '@/../../server/jokers/jokerUtils.js'
// import gamess from '@/../../server/games'

export default {
  data() {
    return {
      state,
      allChampions: []
    }
  },
  computed: {
    activatedGames() {
      return this.configuration.games.filter((e) => e.isEnabled)
    }
  },
  created() {
    const savedRoomConfiguration = JSON.parse(localStorage.getItem('RoomConfiguration'))

    // Add to the configuration the new games
    if (savedRoomConfiguration) {
      if (savedRoomConfiguration.games?.length < this.allGames.length) {
        const newGames = this.allGames.filter(
          (e) => !savedRoomConfiguration.games.map((e) => e.name).includes(e.name)
        )
        savedRoomConfiguration.games.push(...newGames)

        this.configuration.jokerActivated = savedRoomConfiguration.jokerActivated ?? false

        localStorage.setItem('RoomConfiguration', JSON.stringify(savedRoomConfiguration))
      }
    }

    this.configuration.games = savedRoomConfiguration?.games ?? this.allGames
    // this.jokers = GetAll()
  },
  mounted() {},
  methods: {
    saveConfiguration() {
      localStorage.setItem('RoomConfiguration', JSON.stringify(this.configuration))
      console.log('configuration sauvegardée', this.configuration)
    },
    deleteConfiguration() {
      if (confirm('Tu es sûr de vouloir supprimer ta configuration personnalisée ?')) {
        delete localStorage['RoomConfiguration']
        this.configuration.games = this.allGames
        this.configuration.jokerActivated = true
      }
    },
    goToSaloon() {
      this.$emit('quit-configuration')
    }
  }
}
</script>

<style lang="scss" scoped></style>
