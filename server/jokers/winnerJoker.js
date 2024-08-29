const Joker = require('./joker.js')

module.exports = class WinnerJoker extends Joker {
    constructor() {
        super(11, "Le bosse", "Si tu gagnes au prochain round, double tes soifs", Joker.rarity.common, "winner", false)
    }

    effect(player) {
        player.hasWinnerJoker = true

        return `Si ${player.pseudo} gagne le prochain roud, il doublera ses soifs`
    }
}