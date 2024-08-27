const Joker = require('./joker.js')

module.exports = class CrazyJoker extends Joker {
    constructor() {
        super(6, "Quitte ou double", "Une chance sur 2 d'annuler tous tes soifs à donner ou de les doubler", Joker.rarity.rare, "test-tube", false)
    }

    effect(player) {
        const double = Math.random() > 0.5
        const soifs = player.soifToGive
        player.addSoifToGive(double ? soifs : -soifs)

        return double ? `${player.pseudo} a doublé ses ${soifs} soifs à donner 😭` : `${player.pseudo} a annulé ses ${soifs} soifs à donner 🤣`
    }
}