const allGames = [
	{name: 'RedOrBlack', description: 'Rouge ou noir ?', soif: 1, templateAnswer: 'La réponse était :', tips: null, tips: "rien de raciste dans ce jeu hein", isEnabled: true}, 
	{name: 'CardColors', description: 'Pique, coeur, carreaux ou trèfles ?', soif: 2, templateAnswer: 'La réponse était :', tips: "trèfles ne gagne jamais", isEnabled: true }, 
	{name: 'TTMC', description: 'Tu te mets combien ?', soif: null, templateAnswer: 'La réponse était :', tips: 'choisie un numéro de question en fonction de ta conaissance sur le thème', isEnabled: true }, 
	{name: 'PersonnalQuestion', description: 'Question personnelle', soif: 2, templateAnswer: 'Le réponse était :', tips: 'connaître ses amis est un avantage dans ce jeu', isEnabled: true },
	{name: 'StopSlider', description: 'Curseuromètre', soif: 4, templateAnswer: 'Le meilleur score :', tips: 'arrête le curseur le plus proche du milieu ', isEnabled: true }, 
	{name: 'ReactionClick', description: 'Clic sur l\'emoji dès qu\'il apparaît !', soif: 4, templateAnswer: 'Le meilleur score :', tips: "si tu touches l'écran avant l'emoji, tu perds !", canBeBlured: true, isEnabled: true }, 
	{name: 'FastClick', description: 'Clic le plus rapidement possible !', soif: 4, templateAnswer: 'Le meilleur score :', tips: 'installe toi bien et évite de taper avec plusieurs doigts', canBeBlured: true, isEnabled: true }, 
	{name: 'DotClick', soif: 4, description: 'Appuie sur tous sauf les oranges !', templateAnswer: 'Le meilleur score :', tips: 'les points bleu valent 2 points, les verts 5, mais les oranges -5 !', canBeBlured: true, isEnabled: true }, 
	{name: 'SurvivalEmoji', description: 'Reste en vie le plus longtemps.',  soif: 4, templateAnswer: 'Le meilleur score :', tips: "garde ton doigt sur l'écran et évite tous les emojis", canBeBlured: true, isEnabled: true },
	{name: 'Simon', description: 'Mémorise la suite des couleurs', soif: 4, templateAnswer: 'Niveau :', tips: "reste concentré chacal", isEnabled: true }, 
	{name: 'GuessNumber', soif: 4, description: 'Devine le nombre mystère !', templateAnswer: 'Le nombre était :', tips: "Vous-pouvez faire équipe, ou non", isEnabled: true },
	{name: 'DoYouPrefer', description: 'Tu préfères ?', soif: 2, templateAnswer: 'Le meilleur choix était :', minPlayers: 3, tips: "je préfère souvent la réponse 1 perso", isEnabled: true },
	{name: 'Blackjack', description: 'Blackjack !', soif: null, templateAnswer: 'Résultat', tips: "approche toi le plus possible de 21, sans le dépasser" , isEnabled: true },
  {name: 'Labyrinth', description: 'Labyrinth !', soif: 4, templateAnswer: 'Le meilleur temps : ', tips: "dérange tes adversaires pendant le jeu", isEnabled: true },
  {name: 'NavalBattle', description: 'Touché coulé !', soif: null, templateAnswer: 'Résultat', tips: "regarde l'écran de ton voisin pour connaître son emplacement" , isEnabled: true },
	{name: 'JokerWheel', description: '🃏 MANCHE BONUS 🃏', soif: null, templateAnswer: '🃏 MANCHE BONUS 🃏', tips: "appuie plus fort pour faire un lancer plus long" , isEnabled: true },
	{name: 'Loto', description: 'Loto', soif: 4, templateAnswer: 'Le dernier en vie :', tips: "Choisie bien ta belle boule" , isEnabled: true },
  {
    name: 'RebondBall',
    description: 'Balle rebondissante',
    soif: 4,
    templateAnswer: 'Le dernier en vie :',
    tips: 'Anticipe les mouvements de la balle',
    isEnabled: true
  },
  {
    name: 'BrickBreaker',
    description: 'Casse-brique',
    soif: 4,
    templateAnswer: 'Le dernier en vie :',
    tips: 'Reste bien en dessous de la boule',
    isEnabled: true
  },
  {
    name: 'RockPaperScissor',
    description: 'Pierre feuille ciseaux',
    soif: 2,
    templateAnswer: 'Bravo aux gagnants',
    tips: 'Les mecs font souvent pierre',
    isEnabled: true
  },
  {
    name: 'GuessHead',
    description: 'Devine tête',
    soif: 4,
    templateAnswer: 'Bravo aux gagnants',
    tips: 'Les questions doivent être répondues par oui ou non',
    isEnabled: true
  },
  {
    name: 'FindEmoji',
    description: 'Où est l\'emoji ?',
    soif: 4,
    templateAnswer: 'Le meilleur score :',
    tips: 'Trouvez l\'emoji qui n\'apparaît qu\'une seule fois',
    isEnabled: true
  },
  {
    name: 'WizWaz',
    description: 'Wiz Waz !',
    soif: 1,
    templateAnswer: 'Barvo !',
    tips: 'Vous pouvez feinter vos adversaires avec votre regard',
    isEnabled: true
  }
	//{name: 'FaceExpressionDetector', soif: 4}
]


module.exports = { allGames }