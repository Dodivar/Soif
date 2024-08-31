
module.exports = class Joker {
    constructor(id, name, description, rarity, icon, isTargeted) {
        this.id = id
        this.name = name
        this.description = description
        this.rarity = rarity
        this.icon = icon
        this.isTargeted = isTargeted
		this.noEventMsg = false
    }

    effect() {
        console.error(`Not implemented effect of ${this.name}`)
    }

}
module.exports.rarity = {
    legendary: {    
        name: "Légendaire",
        value: "legendary",
        rate: 0.04
    },
    epic:{    
        name: "épique",
        value: "epic",
        rate: 0.1
    },
    rare:
    {    
        name: "Rare",
        value: "rare",
        rate: 0.2
    },
    common: {    
        name: "Commun",
        value: "common",
        rate: 0.4
    },
}