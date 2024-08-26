const Joker = require('./joker.js')

module.exports = class SubtractionJoker extends Joker {
    constructor() {
        super(8, "Le bouclier", "Te permets de retirer 3 soifs", Joker.rarity.Commone)
    }

    effect(player) {
        player.addSoifToDrink(-3)
    }
}