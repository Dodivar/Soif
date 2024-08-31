const Joker = require('./joker.js')

module.exports = class TrapJoker extends Joker {
    constructor() {
        super(10, "Le piège", "Le prochain soifeur à te donner une gorgée en reçois 3", Joker.rarity.common, "teddy-bear", false)
		this.noEventMsg = true
    }

    effect(player) {
        player.hasTrapJoker = true

        return null
    }
}