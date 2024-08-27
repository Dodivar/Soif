const Joker = require('./joker.js')

module.exports = class BlurDescriptionJoker extends Joker {
    constructor() {
        super(3, "Floutage", "Floute la description du prochain jeu de réactivité pour vos adversaires", Joker.rarity.common, "blur", false)
    }

    effect(player, targets) {
        targets.forEach(e => {
            e.hasBlurRoundDescription = true
        });
        return `${player.pseudo} a flouté votre prochaine description de jeu de réactivité !`
    }
}