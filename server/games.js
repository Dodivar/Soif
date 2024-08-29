const allGames = [
	{name: 'RedOrBlack', description: 'Rouge ou noir ?', soif: 1, templateAnswer: 'La réponse était :', tips: null, tips: "rien de raciste dans ce jeu hein"}, 
	{name: 'CardColors', description: 'Pique, coeur, carreaux ou trèfles ?', soif: 2, templateAnswer: 'La réponse était :', tips: "trèfles ne gagne jamais"}, 
	{name: 'TTMC', description: 'Répond correctement à la question !', soif: null, templateAnswer: 'La réponse était :', tips: 'choisie un numéro de question en fonction de ta conaissance sur le thème'}, 
	{name: 'PersonnalQuestion', description: 'Question personnelle', soif: 2, templateAnswer: 'Le réponse était :', tips: 'connaître ses amis est un avantage dans ce jeu'},
	{name: 'StopSlider', description: 'Curseuromètre', soif: 4, templateAnswer: 'Le meilleur score :', tips: 'arrête le curseur le plus proche du milieu '}, 
	{name: 'ReactionClick', description: 'Clic sur l\'emoji dès qu\'il apparaît !', soif: 4, templateAnswer: 'Le meilleur score :', tips: "si tu touches l'écran avant l'emoji, tu perds !", canBeBlured: true}, 
	{name: 'FastClick', description: 'Clic le plus rapidement possible !', soif: 4, templateAnswer: 'Le meilleur score :', tips: 'installe toi bien et évite de taper avec plusieurs doigts', canBeBlured: true}, 
	{name: 'DotClick', soif: 4, description: 'Appuie sur tous sauf les oranges !', templateAnswer: 'Le meilleur score :', tips: 'les points bleu valent 2 points, les verts 5, mais les oranges -5 !', canBeBlured: true}, 
	{name: 'SurvivalEmoji', description: 'Reste en vie le plus longtemps.',  soif: 4, templateAnswer: 'Le meilleur score :', tips: "garde ton doigt sur l'écran et évite tous les emojis", canBeBlured: true},
	{name: 'Simon', description: 'Mémorise la suite des couleurs', soif: 4, templateAnswer: 'Niveau :', tips: "reste concentré chacal"}, 
	{name: 'GuessNumber', soif: 4, description: 'Devine le nombre mystère !', templateAnswer: 'Le nombre était :', tips: "Vous-pouvez faire équipe, ou non"},
	{name: 'DoYouPrefer', description: 'Tu préfères ?', soif: 2, templateAnswer: 'Le meilleur choix était :', minPlayers: 3, tips: "je préfère souvent la réponse 1 perso"},
	{name: 'Blackjack', description: 'Blackjack !', soif: null, templateAnswer: 'Résultat', tips: "approche toi le plus possible de 21, sans le dépasser" },
    {name: 'Labyrinth', description: 'Labyrinth !', soif: 4, templateAnswer: 'Le meilleur temps : ', tips: "dérange tes adversaires pendant le jeu"},
    {name: 'NavalBattle', description: 'Touché coulé !', soif: null, templateAnswer: 'Résultat', tips: "regarde l'écran de ton voisin pour connaître son emplacement" },
	{name: 'JokerWheel', description: '🃏 MANCHE BONUS 🃏', soif: null, templateAnswer: '🃏 MANCHE BONUS 🃏', tips: "appuie plus fort pour faire un lancer plus long" },
	//{name: 'FaceExpressionDetector', soif: 4}
]



// module.exports = { allGames }
module.exports = { allGames }
