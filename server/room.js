module.exports = class Room {
    constructor(socket, newPlayer) {
        this.roomId = socket.actualRoomId
        this.players = [newPlayer]
        this.player = newPlayer
        this.gamesTour = null
        this.gamesNumber = null
        this.gameIdx = 0
        this.actualGame = {
            name: null
        }
        this.roundAnswer = null
		this.showNextGamDesc = false
    }
  
    reset() {
    }
  }