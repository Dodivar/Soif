module.exports = class Joker {
    constructor(id, name, description, rarirty) {
        this.id = id
        this.name = name
        this.description = description
        this.rarirty = rarirty
    }

    effect() {
        console.error(`Not implemented effect of ${this.name}`)
    }

}

module.exports.rarity = {
    Legendary: {    
        name: "Légendaire",
        rate: 0.04
    },
    Epic:{    
        name: "épique",
        rate: 0.1
    },
    Rare:
    {    
        name: "Rare",
        rate: 0.2
    },
    Commone: {    
        name: "Commun",
        rate: 0.5
    },
}