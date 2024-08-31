const jokerTools = require('./jokers/jokerTools')

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
    this.totalSoifGived = 0 // Soif donné au total
    this.soifGivedBy = [] // Indique par qui les soifs ont été donnés
    this.winner = false // Gagnant du round
	  this.readyForNextRound = true // Indique si le joueur a validé avoir bu ses soifs
    this.isOffline = false // Indique si l'utilisateur est connecté
    this.jokers = [] // Les jokers du joueur
    this.hasBlurRoundDescription = false // Indique si la description du round est flouté
	
	// Joker
	this.hasInvincibleJoker = 0 // Nombre de tours ne pouvant pas être visé
	this.hasTrapJoker = false // Donne 3 soifs au joueur qui cible celui-ci
	this.hasWinnerJoker = false // Double les soifs si prochain jeu gagnant
  }

  /**
   * A donner les soifs du round
   */
  get givedSoif() {
    return this.soifToGive <= 0
  }

  /**
   * Add soif to drink. Add player who give the soif (can't be the same player that receive)
   * @param {*} number 
   * @param {*} player 
   * @returns 
   */
  addSoifToDrink(number, player = null) {
    // If number is negative, prevent to reduce more total than expected
    if (number < 0) {
      const minus = this.soifAddedThisRound + number < 0 ? -this.soifAddedThisRound : number
      this.soifAddedThisRound += minus
      this.soifTotal += minus
    }
    else {
      this.soifAddedThisRound += number
      this.soifTotal += number
    }
    this.readyForNextRound = false

    if (player === null || player.socketId === this.socketId) return

    // Track the player who's gived soif
    const playerGiving = this.soifGivedBy.find(e => e.socketId === player.socketId)
    if (playerGiving) {
      playerGiving.gived += number
    } else {
      const playerGive = { socketId: player.socketId, gived: number }
      this.soifGivedBy.push(playerGive)
    }
  }
  
  addSoifToGive(number) {
    this.soifToGive = this.soifToGive + number < 0 ? 0 : this.soifToGive + number
    this.addTotalSoifGived(number) 
  }

  addTotalSoifGived(number) {
    this.totalSoifGived += number
  }

  resetRoundData(hasBlurRoundDescription) {
    this.hasPlayed = false
    this.gameValue = null
    this.gameValueLabel = null
    this.soifAddedThisRound = 0
    this.soifToGive = 0
    this.winner = false
    this.readyForNextRound = false
    this.soidGivedBy = []
    this.soifGivedBy = []
    this.hasBlurRoundDescription = hasBlurRoundDescription ?? false
	
    this.hasInvincibleJoker = this.hasInvincibleJoker > 0 ? this.hasInvincibleJoker - 1 : this.hasInvincibleJoker
  }

  reset() {
    this.gameValue = null
    this.hasPlayed = false
    this.isReady = false
    this.soifTotal = 0
    this.soifAddedThisRound = 0
    this.soifToGive = 0
    this.totalSoifGived = 0
    this.winner = false
	  this.readyForNextRound = true
    this.jokers = []
    this.soifGivedBy = []
    this.hasBlurRoundDescription = false
  }
}