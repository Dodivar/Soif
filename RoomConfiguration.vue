<template>
  <v-container>
   <v-switch
	  v-model="jokerActivated"
	  color="info"
	  label="info"
	  value="info"
	  hide-details
	  label="Jouer avec les jokers"
	></v-switch>
	
	
  <v-data-iterator
    :items="games"
    items-per-page="4"
  >
    <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
      <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
        <div class="text-truncate">
          Jeux
        </div>

        <div class="d-flex align-center">
          <v-btn
            class="me-8"
            variant="text"
            @click="onClickSeeAll"
          >
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
    </template>

    <template v-slot:default="{ items }">
      <v-row>
        <v-col
          v-for="(item, i) in items"
          :key="i"
          cols="12"
          sm="6"
          xl="3"
        >
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
                <tr align="right">
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
					  label="success"
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
      <v-footer
        class="justify-space-between text-body-2 mt-4"
        color="surface-variant"
      >
        Total de jeux activés : {{ activatedGames }}

        <div>
          Page {{ page }} sur {{ pageCount }}
        </div>
      </v-footer>
    </template>
  </v-data-iterator>
	
	<v-btn class="w-100 text-white bg-gradient-success">SAUVEGARDER</v-btn>
  </v-container>
  
</template>

<script>
import { state, socket } from '@/socket'
import { GetAll } from '@/../'../server/jokers/jokerUtils.js'
import { allGames } from '@/../'../server/games.js'

export default {
  data() {
    return {
      state,
      games: [],
	  jokerActivated: true,
	  
	  
    }
  },
  computed: {
	activatedGames() {
		return this.games.filter(e => e.isEnabled)
	}
  },
  created() {
	const actualRoomConfiguration = localStorage.getItem("roomConfiguration")
	
	// Add to the configuration the new games
	if (actualRoomConfiguration && actualRoomConfiguration.length < allGames.length) {
		const newGames = allGames.filter(e => !actualRoomConfiguration.map(e => e.name).includes(e.name))
		
		actualRoomConfiguration.push(...newGames)
		localStorage.setItem("roomConfiguration", actualRoomConfiguration)
	}
	
	this.games = actualRoomConfiguration ?? allGames
	this.jokers = GetAll()
  },
  mounted() {},
  methods: {
	incrementSoif(item) {
		item.raw.soif++
	},
	decrementSoif(item) {
		item.raw.soif--
	},
	saveRoomConfiguration() {
		localStorage.setItem("roomConfiguration", this.games)
		console.log("configuration sauvegardée", this.games)
	}
  }
}
</script>

<style lang="scss" scoped>
</style>
