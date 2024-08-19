import { reactive } from 'vue'
import { io } from 'socket.io-client'

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3333'

export const state = reactive({
  connected: false,
  player: {
    socketId: null,
    pseudo: null,
    avatar: null,
    isRoomMaster: false
  },
  room: {}
})

export const socket = io(URL, {
  transports: ['websocket', 'polling'] // utilisation du transport WebSocket en premier, si possible
})

socket.on('connect', () => {
  state.connected = true
  state.player.socketId = socket.id
})

socket.on('disconnect', () => {
  state.connected = false
})

// User joined the game
socket.on('join room', (roomState, roomAvatars) => {
  state.room = roomState
  state.player = state.room.players.find((e) => e.socketId === socket.id)

  // Set each player avatars
  roomAvatars.avatars.forEach((player) => {
    if (
      socket.id !== player.socketId &&
      !sessionStorage.getItem(`playerAvatar-${player.socketId}`)
    ) {
      sessionStorage.setItem(`playerAvatar-${player.socketId}`, player.avatar)
    }
  })
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

socket.on('connect_error', (err) => {
  alert(`connect_error due to ${err.message}`)
  // retour au fonctionnement classique en cas d'erreur
  socket.io.opts.transports = ['polling', 'websocket']
})
