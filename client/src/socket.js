import { reactive } from 'vue'
import { io } from 'socket.io-client'

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3333'

export const state = reactive({
  connected: false,
  player: {
    id: null,
    pseudo: null,
    isRoomMaster: false
  },
  room: {}
})

export const socket = io(URL)

// User joined the game
socket.on('join room', (roomState) => {
  state.room = roomState
  state.player = state.room.players.find((e) => e.socketId === socket.id)
  console.log(roomState)
})

socket.on('refresh players', (players) => {
  state.room.players = players
  state.player = players.find((e) => e.socketId === socket.id)
})

socket.on('refresh room', (room) => {
  state.room = room
  state.player = state.room.players.find((e) => e.socketId === socket.id)
  console.log(room)
})

socket.on('UpdateActualGame', (actualGame) => {
  state.room.actualGame = actualGame
})

// SIMON
socket.on('SimonLightUpButton', (color) => {
  state.room.actualGame.clickedBtn = color
})
socket.on('SimonUpdateMsg', (msg) => {
  state.room.actualGame.message = msg
})

// TTMC
socket.on('TTMCChosenQuestionNumber', (index) => {
  state.room.actualGame.chosenQuestionNumber = index
  console.log(state.room.actualGame)
})
