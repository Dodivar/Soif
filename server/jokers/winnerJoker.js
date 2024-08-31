const Joker = require('./joker.js')

module.exports = class WinnerJoker extends Joker {
    constructor() {
        super(11, "Le boss", "Double tes soifs au prochain round que tu gagnes", Joker.rarity.rare, "crown", false)
    }

    effect(player) {
        player.hasWinnerJoker = true

        return `${player.pseudo} doublera ses soifs au prochain round gagné`
    }
}