const Joker = require('./joker.js')

module.exports = class InvincibleJoker extends Joker {
    constructor() {
        super(11, "Invincible", "Empêche les soifeurs de te donner des soifs pendant 3 rounds", Joker.rarity.rare, "invincible", false)
    }

    effect(player) {
        player.hasInvincibleJoker = true

        return `${player.pseudo} est invincible pendant 3 rounds, tu ne pourras pas lui donner de soif`
    }
}