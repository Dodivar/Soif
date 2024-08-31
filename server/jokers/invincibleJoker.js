const Joker = require('./joker.js')

module.exports = class InvincibleJoker extends Joker {
    constructor() {
        super(12, "Invincible", "Empêche les soifeurs de te donner des soifs pendant 3 rounds", Joker.rarity.epic, "shield-crown", false)
    }

    effect(player) {
        player.hasInvincibleJoker = 3

        return `${player.pseudo} est invincible pendant 3 rounds, tu ne pourras pas lui donner de soif`
    }
}