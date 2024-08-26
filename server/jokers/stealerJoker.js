const Joker = require('./joker.js')

module.exports = class StealerJoker extends Joker {
    constructor() {
        super(9, "Le voleur", "Te permets de voler les soifs à distribuer d'un joueur", Joker.rarity.Rare)
    }

    effect(player, target) {
        const stole = target.soifToGive
        player.addSoifToGive(stole)
        target.addSoifToGive(-stole)
    }
}