const Joker = require('./joker.js')

module.exports = class AdditionJoker extends Joker {
    constructor() {
        super(7, "L'épée", "Te permets de donner 3 soifs supplémentaires", Joker.rarity.common, "sword", false)
    }

    effect(player) {
        player.addSoifToGive(3)
        return `${player.pseudo} utilise son épée pour gagner 3 soifs !`
    }
}