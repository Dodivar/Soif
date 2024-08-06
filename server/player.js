module.exports = class Player {
  constructor(socketId, pseudo) {
    this.socketId = socketId
    this.pseudo = pseudo
    this.gameValue = null // Valeur du player pour le round
    this.hasPlayed = false // A jouer au round
    this.isReady = false // Prêt à jouer 
    this.soifTotal = 0 // Soif total
    this.soifAddedThisRound = 0 // Soif ajouter ce round
    this.soifToGive = 0 // Soif à donner ce round
    this.givedSoif = false // A donner les soifs du round
    this.winner = false // Gagnant du round
  }
}