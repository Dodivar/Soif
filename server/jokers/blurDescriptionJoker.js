const Joker = require('./joker.js')

module.exports = class BlurDescriptionJocker extends Joker {
    constructor() {
        super(3, "Floutage", "Floute la description du prochain jeu de réactivité pour vos adversaires", Joker.rarity.Rare)
    }

    effect(targets) {
        // player.addSoifToGive(double ? player.soifToGive : -player.soifToGive)
    }
}