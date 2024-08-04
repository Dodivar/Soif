import { reactive } from 'vue'
import { io } from 'socket.io-client'

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3333'

export const state = reactive({
  connected: false,
  player: {
    id: null,
    pseudo: null,
    rightAnswer: null,
    gameValue: null
  },
  room: {}
})

export const socket = io(URL)

// User joined the game
socket.on('join room', (roomState) => {
  console.log(roomState)
  state.player.id = socket.id
  state.room = roomState
})

// User left the game
socket.on('launch games', () => {
  state.room.isPlaying = true
})

// User left the game
socket.on('refresh players', (players) => {
  state.room.players = players
  console.log(players)
})

// Send a message to client
socket.on('msg', (msg) => {
  alert(msg)
  console.info(msg)
})

socket.on('RedOrBlack answer', (answer) => {
  state.player.rightAnswer = answer
})

socket.on('CardColors answer', (answer) => {
  state.player.rightAnswer = answer
})
