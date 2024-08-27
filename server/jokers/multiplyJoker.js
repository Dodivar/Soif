const Joker = require('./joker.js')

module.exports = class MultiplyJoker extends Joker {
    constructor() {
        super(4, "L'abuseur", "Double le nombre de tes soifs à donner", Joker.rarity.epic, "numeric-2-circle", false)
    }
    
    effect(player) {
        const soifs = player.soifToGive
        player.addSoifToGive(soifs)
        return `${player.pseudo} double ses ${soifs} soifs !`
    }
}