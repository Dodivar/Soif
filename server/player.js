module.exports = class Player {
  constructor(socketId, pseudo, isRoomMaster = false) {
    this.socketId = socketId
    this.pseudo = pseudo
    this.isRoomMaster = isRoomMaster // Est le maître de la partie, celui qui l'a créé
    this.gameValue = null // Valeur du joueur pour le round
    this.gameValueLabel = null // Libellé à afficher lorsque le jeu est finit
    this.hasPlayed = false // A jouer au round
    this.isReady = false // Prêt à jouer 
    this.soifTotal = 0 // Soif total
    this.soifAddedThisRound = 0 // Soif ajouter ce round
    this.soifToGive = 0 // Soif à donner ce round
    this.givedSoif = false // A donner les soifs du round
    this.totalSoifGived = 0 // Soif donné au total
    this.winner = false // Gagnant du round
	  this.readyForNextRound = true // Indique si le joueur a validé avoir bu ses soifs
    this.isOffline = false // Indique si l'utilisateur est connecté
  }

  resetRoundData() {
    this.hasPlayed = false
    this.gameValue = null
    this.gameValueLabel = null
    this.soifAddedThisRound = 0
    this.soifToGive = 0
    this.givedSoif = false 
    this.winner = false
	  this.readyForNextRound = false
  }

  reset() {
    this.gameValue = null
    this.hasPlayed = false
    this.isReady = false
    this.soifTotal = 0
    this.soifAddedThisRound = 0
    this.soifToGive = 0
    this.givedSoif = false
    this.totalSoifGived = 0
    this.winner = false
	  this.readyForNextRound = true
  }
}