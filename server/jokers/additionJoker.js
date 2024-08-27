const Joker = require('./joker.js')

module.exports = class AdditionJoker extends Joker {
    constructor() {
        super(7, "L'épée", "Te permets de donner 3 soifs supplémentaires", Joker.rarity.common)
    }

    effect(player) {
        player.addSoifToGive(3)
    }
}