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

        const availableJoker = target.jokers.filter(e => !player.jokers.includes(e.id))
        if (availableJoker.length === 0)
            return `${player.pseudo} a essayé de voler un joker à ${target.pseudo}, mais il possède déjà tous les jokers qu'il a`

        // JSON stringify to get a copy if this is a tornado also
        const stole = utils.GetRandomElement(availableJoker)
        const joker = JSON.stringify(stole)

        target.jokers = target.jokers.filter(e => e !== stole.id)
        player.jokers.push(JSON.parse(joker))
        
        return `${player.pseudo} a volé un joker à ${target.pseudo} !`
    }
}