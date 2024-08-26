const Joker = require('./joker.js')

module.exports = class MultiplyJoker extends Joker {
    constructor() {
        super(4, "L'abuseur", "Double le nombre de tes soifs à donner", Joker.rarity.Epic)
    }
    
    effect(player) {
        player.addSoifToGive(player.soifToGive)
    }
}