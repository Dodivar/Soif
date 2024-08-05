module.exports = class Player {
  constructor(socketId, pseudo) {
    this.socketId = socketId
    this.pseudo = pseudo
    this.gameValue = null
    this.hasPlayed = false // A jouer au round
    this.isReady = false // Prêt à jouer 
    this.soif = 0 // Soif total
    this.soifAdded = 0 // Soif ajouter au round
    this.givedSoif = false // A donner les soifs du round
  }
}