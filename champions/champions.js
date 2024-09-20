module.exports = class Champion {
    constructor(id, name, description, img, reloadPower) {
        this.id = id
        this.name = name
        this.description = description
        this.img = img
        this.reloadPower = reloadPower ?? 1
    }

    effect() {
        console.error(`Not implemented effect of ${this.name}`)
    }

}

// Le boufon
// Possède le pouvoir de lancer la roue Joker 2 fois

// La victime
// Si tu reçois le plus de soif à boire, donne 2 soif aux autres joueurs

// Le siphon
// Possède le pouvoir de boire tous les soif à distribuer des autres joueurs rien que pour toi

// Le fan de 86
// Désigne quelqu'un pour être ta 86. Chaque fois qu'il gagne un jeu, te donne +2 soif à distribuer

// Le schlag
// Si tu n'as pas reçu de soif à boire, te donne +2 soif à distribuer

// Le tazé
// Possède le pouvoir de rendre l'écran flou d'un adversaire durant tout le prochain round

// Le rat
// Si tu n'as qu'un soif à distribuer, en rajoute un autre

// Le camé
// Possède le pouvoir de donner une seringue à un joueur, si il ne clic pas dessus passé 5 secondes il reçoit 5 soif

// La croix rouge
// Possède le pouvoir de boire maximum 3 soif par round

// Camping
// Possède le pouvoir de désigner une personne, si celle-ci gagne le prochain round ce sera à toi de distribuer ses soif