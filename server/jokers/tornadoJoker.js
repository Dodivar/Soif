const Joker = require('./joker.js')
const utils = require("./../utils.js")

module.exports = class TornadoJoker extends Joker {
    constructor() {
        super(13, "La tornade", "Vole un joker d'un soifeur", Joker.rarity.rare, "weather-tornado", true)
		this.allEventMsg = true
    }

    effect(player, target) {
        if (target.jokers.length === 0)
            return `${player.pseudo} a essayé de voler un joker à ${target.pseudo}, mais il n'en possède aucun...`

        const hasJokerId = player.jokers.map(e => e.id)
        const availableJoker = target.jokers.filter(e => !hasJokerId.includes(e.id))
        if (availableJoker.length === 0)
            return `${player.pseudo} a essayé de voler un joker à ${target.pseudo}, mais il possède déjà tous les jokers qu'il a`

        // JSON stringify to get a copy if this is a tornado also
        const stole = utils.GetRandomElement(availableJoker)
        // const jokerStolen = JSON.stringify(stole)
        const jokerStolen = Object.assign(Object.create(Object.getPrototypeOf(stole)), stole)

        // Delete and add the stolen joker
        target.jokers = target.jokers.filter(e => e.id !== stole.id)
        player.jokers.push(jokerStolen)
        
        return `${player.pseudo} a volé un joker à ${target.pseudo} !`
    }
}