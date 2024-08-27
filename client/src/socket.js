import { reactive } from 'vue'
import { io } from 'socket.io-client'

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === 'production'
    ? 'https://young-crag-84444-1d9b3543036e.herokuapp.com/'
    : 'http://localhost:3333'

export const state = reactive({
  connected: false,
  errMsg: null,
  snackbarElements: [],
  jokerTarget: null,
  player: {
    socketId: null,
    pseudo: null,
    avatar: null,
    isRoomMaster: false,
    joker: []
  },
  room: {}
})

export const socket = io(URL, {
  transports: ['websocket', 'polling'], // utilisation du transport WebSocket en premier, si possible
  reconnectionDelay: 2000, // Seconds before trying to reconnect
  reconnectionDelayMax: 2000
})

socket.on('connect', () => {
  if (socket.recovered) {
    // any event missed during the disconnection period will be received now
    console.log('connection recovered')
  }

  state.connected = socket.connected
  state.player.isOffline = !socket.connected
  state.player.socketId = socket.id
  state.errMsg = null
})

socket.on('disconnect', () => {
  state.errMsg = 'Connexion perdu'
  state.connected = socket.connected
  state.player.isOffline = !socket.connected
})

// User joined the game
socket.on('join room', (roomState, roomAvatars) => {
  state.room = roomState
  state.player = state.room.players.find((e) => e.socketId === socket.id) ?? state.player

  console.log(state.room)
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
  state.player = players.find((e) => e.socketId === socket.id) ?? state.player
  console.log(state.player.jokers)
})

socket.on('refresh room', (room) => {
  state.room = room
  state.player = state.room.players.find((e) => e.socketId === socket.id) ?? state.player
})

socket.on('UpdateActualGame', (actualGame) => {
  state.room.actualGame = actualGame
})

socket.on('Game:GetJokerOfRarity', (message, joker) => {
  const newSnackbar = {
    message,
    joker: joker
  }
  state.snackbarElements.push(newSnackbar)
})

socket.on('Game:UseJoker', (message, joker) => {
  const newSnackbar = {
    message,
    joker: joker
  }
  state.snackbarElements.push(newSnackbar)
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
  console.info(`connect_error due to ${err.message}`)
  state.errMsg = err.message
})
