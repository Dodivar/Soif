module.exports = class Player {
  constructor(socketId, pseudo, avatar = null, isRoomMaster = false) {
    this.socketId = socketId
    this.pseudo = pseudo
    this.isRoomMaster = isRoomMaster // Est le maître de la partie, celui qui l'a créé
    this.avatar = avatar // Est le maître de la partie, celui qui l'a créé
    this.gameValue = null // Valeur du player pour le round
    this.hasPlayed = false // A jouer au round
    this.isReady = false // Prêt à jouer 
    this.soifTotal = 0 // Soif total
    this.soifAddedThisRound = 0 // Soif ajouter ce round
    this.soifToGive = 0 // Soif à donner ce round
    this.givedSoif = false // A donner les soifs du round
    this.totalSoifGived = 0 // Soif donné au total
    this.winner = false // Gagnant du round
  }

  reset() {
    this.gameValue = null // Valeur du player pour le round
    this.hasPlayed = false // A jouer au round
    this.isReady = false // Prêt à jouer 
    this.soifTotal = 0 // Soif total
    this.soifAddedThisRound = 0 // Soif ajouter ce round
    this.soifToGive = 0 // Soif à donner ce round
    this.givedSoif = false // A donner les soifs du round
    this.totalSoifGived = 0 // Soif donné au total
    this.winner = false // Gagnant du round
  }
}