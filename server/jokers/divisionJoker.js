const Joker = require('./joker.js')

module.exports = class DivisionJoker extends Joker {
    constructor() {
        super(5, "Le boucher", "Réduit de moitié le nombre de tes soifs", Joker.rarity.epic, "division", false)
    }

    effect(player) {
        const minus = -Math.round(player.soifAddedThisRound / 2)
        player.addSoifToDrink(minus)

        return `${player.pseudo} a réduit de moitié ses ${minus * 2} soifs ! `
    }
}