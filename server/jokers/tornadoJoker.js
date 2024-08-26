const Joker = require('./joker.js')

module.exports = class TornadoJoker extends Joker {
    constructor() {
        super(10, "La tornade", "Vole un joker d'un soifeur", Joker.rarity.Rare)
    }

    effect(player, target) {
        if (target.jokers.length === 0)
            return `${target.pseudo} ne possède aucun joker...`

        const availableJoker = target.jokers.filter(e => !player.jokers.includes(e.id))
        if (availableJoker.length === 0)
            return `Tu possède déjà tous les joker de ${target.pseudo}`

        const joker = GetRandomElement(availableJoker)
        target.jokers = target.jokers.filter(e => e !== joker.id)
        player.jokers.push(joker)
        
        return `Tu as volé ${joker.name} à ${target.pseudo} !`
    }
}