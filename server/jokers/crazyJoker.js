const Joker = require('./joker.js')

module.exports = class CrazyJoker extends Joker {
    constructor() {
        super(6, "Quitte ou double", "Une chance sur 2 d'annuler tous tes soifs ou de les doubler", Joker.rarity.Rare)
    }

    effect(player) {
        const double = Math.random() > 0.5
        player.addSoifToGive(double ? player.soifToGive : -player.soifToGive)
    }
}