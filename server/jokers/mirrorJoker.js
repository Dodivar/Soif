const Joker = require('./joker.js')

module.exports = class MirorJoker extends Joker {
    constructor() {
        super(1, "Miroir", "Renvoie tous tes soifs sur les adversaires qui te les ont données", Joker.rarity.Legendary)
    }

    effect(player, targets) {

        // Return each soif to player who's give them
        player.soifGivedBy.forEach(p => {
            const target = targets.find(e => e.socketId === p.socketId)
            if (!target) return

            target.addSoifToDrink(p.gived, player)

            player.addSoifToDrink(-p.gived)
            player.addTotalSoifGived(p.gived)
        })
    }
}