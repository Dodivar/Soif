const Joker = require('./joker.js')

module.exports = class SubtractionJoker extends Joker {
    constructor() {
        super(8, "Le bouclier", "Te permets de retirer 3 soifs", Joker.rarity.common, "shield-sword", false)
    }

    effect(player) {
        player.addSoifToDrink(-3)
        return `${player.pseudo} utilise son bouclier pour contrer 3 soifs !`
    }
}