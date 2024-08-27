const Joker = require('./joker.js')

module.exports = class FriendCallJoker extends Joker {
    constructor() {
        super(2, "L'appel à un ami", "Appelle ton ami pour qu'il boive tes soifs", Joker.rarity.legendary)
    }

    effect(player, target) {
        const total = player.soifAddedThisRound
        player.addSoifToDrink(-total)
        player.addTotalSoifGived(total)

        target.addSoifToDrink(total, player)
        
        // Reset players gived
        player.soifGivedBy = []
    }
}