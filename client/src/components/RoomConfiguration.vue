<template>
  <v-container>
    <v-switch
      v-model="configuration.jokerActivated"
      color="info"
      label="Jouer avec les jokers"
      hide-details
    ></v-switch>

    <v-switch
      v-model="switchAllEnabled"
      color="info"
      :label="switchAllEnabled ? 'Tout désactiver' : 'Tout activer'"
      hide-details
    ></v-switch>

    <v-data-iterator :items="configuration.games" :items-per-page="configuration.games.length">
      <!-- <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
        <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
          <div class="text-truncate">Jeux</div>

          <div class="d-flex align-center">
            <v-btn class="me-8" variant="text" @click="onClickSeeAll">
              <span class="text-decoration-underline text-none">See all</span>
            </v-btn>

            <div class="d-inline-flex">
              <v-btn
                :disabled="page === 1"
                class="me-2"
                icon="mdi-arrow-left"
                size="small"
                variant="tonal"
                @click="prevPage"
              ></v-btn>

              <v-btn
                :disabled="page === pageCount"
                icon="mdi-arrow-right"
                size="small"
                variant="tonal"
                @click="nextPage"
              ></v-btn>
            </div>
          </div>
        </h1>
      </template> -->

      <template v-slot:default="{ items }">
        <v-row>
          <v-col v-for="(item, i) in items" :key="i" cols="12" sm="4" xl="3">
            <v-sheet border class="rounded">
              <!--:src="item.raw.src"-->
              <v-img
                :gradient="`to top right, rgba(255, 255, 255, .1), rgba(${item.raw.color}, .15)`"
                height="150"
                cover
              ></v-img>

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
                        elevation="3"
                        color="red"
                        icon="mdi-minus"
                        size="small"
                        variant="outlined"
                        @click="decrementSoif(item)"
                      ></v-btn>
                      {{ item.raw.soif }}
                      <v-btn
                        elevation="3"
                        color="red"
                        icon="mdi-plus"
                        size="small"
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
                        :label="item.raw.isEnabled ? 'activé' : 'désactivé'"
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

    <v-btn class="w-100 text-white bg-gradient-success mx-5" @click="saveConfiguration()"
      >SAUVEGARDER</v-btn
    >
    <v-btn class="w-100 text-white bg-gradient-warning ma-5" @click="deleteConfiguration()"
      >SUPPRIMER LA CONFIGURATION</v-btn
    >
    <v-btn class="w-100 text-white bg-gradient-info mx-5" @click="goToSaloon()">RETOUR</v-btn>
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
      switchAllEnabled: true,
      configuration: {
        games: [],
        jokerActivated: true
      },
      allGames: [
        {
          name: 'RedOrBlack',
          description: 'Rouge ou noir ?',
          soif: 1,
          templateAnswer: 'La réponse était :',
          tips: 'rien de raciste dans ce jeu hein',
          isEnabled: true
        },
        {
          name: 'CardColors',
          description: 'Pique, coeur, carreaux ou trèfles ?',
          soif: 2,
          templateAnswer: 'La réponse était :',
          tips: 'trèfles ne gagne jamais',
          isEnabled: true
        },
        {
          name: 'TTMC',
          description: 'Répond correctement à la question !',
          soif: null,
          templateAnswer: 'La réponse était :',
          tips: 'choisie un numéro de question en fonction de ta conaissance sur le thème',
          isEnabled: true
        },
        {
          name: 'PersonnalQuestion',
          description: 'Question personnelle',
          soif: 2,
          templateAnswer: 'Le réponse était :',
          tips: 'connaître ses amis est un avantage dans ce jeu',
          isEnabled: true
        },
        {
          name: 'StopSlider',
          description: 'Curseuromètre',
          soif: 4,
          templateAnswer: 'Le meilleur score :',
          tips: 'arrête le curseur le plus proche du milieu ',
          isEnabled: true
        },
        {
          name: 'ReactionClick',
          description: "Clic sur l'emoji dès qu'il apparaît !",
          soif: 4,
          templateAnswer: 'Le meilleur score :',
          tips: "si tu touches l'écran avant l'emoji, tu perds !",
          canBeBlured: true,
          isEnabled: true
        },
        {
          name: 'FastClick',
          description: 'Clic le plus rapidement possible !',
          soif: 4,
          templateAnswer: 'Le meilleur score :',
          tips: 'installe toi bien et évite de taper avec plusieurs doigts',
          canBeBlured: true,
          isEnabled: true
        },
        {
          name: 'DotClick',
          soif: 4,
          description: 'Appuie sur tous sauf les oranges !',
          templateAnswer: 'Le meilleur score :',
          tips: 'les points bleu valent 2 points, les verts 5, mais les oranges -5 !',
          canBeBlured: true,
          isEnabled: true
        },
        {
          name: 'SurvivalEmoji',
          description: 'Reste en vie le plus longtemps.',
          soif: 4,
          templateAnswer: 'Le meilleur score :',
          tips: "garde ton doigt sur l'écran et évite tous les emojis",
          canBeBlured: true,
          isEnabled: true
        },
        {
          name: 'Simon',
          description: 'Mémorise la suite des couleurs',
          soif: 4,
          templateAnswer: 'Niveau :',
          tips: 'reste concentré chacal',
          isEnabled: true
        },
        {
          name: 'GuessNumber',
          soif: 4,
          description: 'Devine le nombre mystère !',
          templateAnswer: 'Le nombre était :',
          tips: 'Vous-pouvez faire équipe, ou non',
          isEnabled: true
        },
        {
          name: 'DoYouPrefer',
          description: 'Tu préfères ?',
          soif: 2,
          templateAnswer: 'Le meilleur choix était :',
          minPlayers: 3,
          tips: 'je préfère souvent la réponse 1 perso',
          isEnabled: true
        },
        {
          name: 'Blackjack',
          description: 'Blackjack !',
          soif: null,
          templateAnswer: 'Résultat',
          tips: 'approche toi le plus possible de 21, sans le dépasser',
          isEnabled: true
        },
        {
          name: 'Labyrinth',
          description: 'Labyrinth !',
          soif: 4,
          templateAnswer: 'Le meilleur temps : ',
          tips: 'dérange tes adversaires pendant le jeu',
          isEnabled: true
        },
        {
          name: 'NavalBattle',
          description: 'Touché coulé !',
          soif: null,
          templateAnswer: 'Résultat',
          tips: "regarde l'écran de ton voisin pour connaître son emplacement",
          isEnabled: true
        },
        {
          name: 'JokerWheel',
          description: '🃏 MANCHE BONUS 🃏',
          soif: null,
          templateAnswer: '🃏 MANCHE BONUS 🃏',
          tips: 'appuie plus fort pour faire un lancer plus long',
          isEnabled: true
        }
        //{name: 'FaceExpressionDetector', soif: 4}
      ],
      jokers: []
    }
  },
  watch: {
    switchAllEnabled(value) {
      this.configuration.games.forEach((e) => {
        e.isEnabled = value
      })
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
          (e) => !savedRoomConfiguration.map((e) => e.name).includes(e.name)
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
    // TODO implémenter les MAX soifs et MIN SOIF
    // TODO Voir si on peut modifier les cas, genre bataille navale => 1 navire touché / le dernier en vie
    incrementSoif(item) {
      item.raw.soif++
    },
    decrementSoif(item) {
      item.raw.soif--
    },
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
