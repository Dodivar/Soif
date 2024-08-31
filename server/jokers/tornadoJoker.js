const Joker = require('./joker.js')
const utils = require("./../utils.js")

module.exports = class TornadoJoker extends Joker {
    constructor() {
        super(99, "La tornade", "Vole un joker d'un soifeur", Joker.rarity.rare, "weather-tornado", true)
    }

    effect(player, target) {
        if (target.jokers.length === 0)
            return `${target.pseudo} ne possède aucun joker...`

        const availableJoker = target.jokers.filter(e => !player.jokers.includes(e.id))
        if (availableJoker.length === 0)
            return `Tu possèdes déjà tous les joker de ${target.pseudo}`

        const joker = utils.GetRandomElement(availableJoker)
        target.jokers = target.jokers.filter(e => e !== joker.id)
        player.jokers.push(joker)
        
        return `${player.pseudo} a volé un joker à ${target.pseudo} !`
    }
}