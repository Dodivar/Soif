const Joker = require('./joker.js')

module.exports = class DivisionJoker extends Joker {
    constructor() {
        super(5, "Le boucher", "Réduit de moitié le nombre de tes soifs", Joker.rarity.Epic)
    }

    effect(player) {
        const minus = Math.round(player.soifAddedThisRound / 2)
        player.addSoifToDrink(minus)
    }
}