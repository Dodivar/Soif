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
  console.log(roomState)
  state.player.id = socket.id
  state.player.isRoomMaster = socket.isRoomMaster
  state.room = roomState
})

socket.on('launch games', () => {
  state.room.isPlaying = true
})

socket.on('refresh players', (players) => {
  state.room.players = players
  console.log(players)
})

socket.on('refresh room', (room) => {
  state.room = room
  console.log(room)
})

// Send a message to client
socket.on('msg', (msg) => {
  alert(msg)
  console.info(msg)
})
