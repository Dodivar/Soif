const Player = require("./player.js");
const Room = require("./room.js");
const JokerTools = require("./jokers/jokerTools.js");
const utils = require("./utils.js");

const TtmcThemes = require("./games/TTMC_themes.json")
const DoYouPreferQuestions = require("./games/DoYouPrefer.json")
const PersonnalQuestion = require("./games/PersonnalQuestion.json")

const isProd = process.env.NODE_ENV === 'production'

const express = require("express")();
const Http = require("http").Server(express);
const io = require("socket.io")(Http, {
    cors: {
        origin: isProd ?  "https://dodivar.github.io/Soif/" : "http://192.168.1.15:3000"
    },
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    }
});

const PORT = process.env.PORT || 3333;
Http.listen(PORT, () => {
    console.log("Listening at : " + PORT);
})

// Init model of room
const initRoomState = (socket, isRoomMaster) => {
    const actualPlayer = new Player(socket.id, socket.data.pseudo, isRoomMaster)
    return new Room(socket, actualPlayer)
}

var roomState = []; // State of rooms
var roomAvatars = []; // Avatar of players

const allGames = [
	{name: 'RedOrBlack', description: 'Rouge ou noir ?', soif: 1, templateAnswer: 'La réponse était :'}, 
	{name: 'CardColors', description: 'Pique, coeur, carreaux ou trèfles ?', soif: 2, templateAnswer: 'La réponse était :'}, 
	{name: 'TTMC', description: 'Répond correctement à la question !', soif: null, templateAnswer: 'La réponse était :'}, 
	{name: 'PersonnalQuestion', description: 'Question personnelle...', soif: 2, templateAnswer: 'Le réponse était :'},
	{name: 'StopSlider', description: 'Arrête le curseur le plus proche du milieu !', soif: 4, templateAnswer: 'Le meilleur score :'}, 
	{name: 'ReactionClick', description: 'Clic sur l\'emoji dès qu\'il apparaît !', soif: 4, templateAnswer: 'Le meilleur score :'}, 
	{name: 'FastClick', description: 'Clic le plus rapidement possible !', soif: 4, templateAnswer: 'Le meilleur score :'}, 
	{name: 'DotClick', soif: 4, description: 'Les points bleu valent 2 points, les verts 5, mais les oranges -5 !', templateAnswer: 'Le meilleur score :'}, 
	{name: 'SurvivalEmoji', description: 'Reste en vie le plus longtemps possible en gardant ton doigt sur l\'écran !',  soif: 4, templateAnswer: 'Le meilleur score :'},
	{name: 'Simon', description: 'Mémorise la suite des couleurs', soif: 4, templateAnswer: 'Niveau :'}, 
	{name: 'GuessNumber', soif: 4, description: 'Devine le nombre mystère !', templateAnswer: 'Le nombre était :'},
	{name: 'DoYouPrefer', description: 'Tu préfères ?', soif: 2, templateAnswer: 'Le meilleur choix était :', minPlayers: 3},
	{name: 'Blackjack', description: 'Blackjack !', soif: null, templateAnswer: 'Résultat' },
    {name: 'Labyrinth', description: 'Labyrinth !', soif: 4, templateAnswer: 'Le meilleur temps : ' },
    {name: 'NavalBattle', description: 'Touché coulé !', soif: null, templateAnswer: 'Résultat' },
	// {name: 'FaceExpressionDetector', soif: 4}
]

io.on("connection", socket => {
    console.log("Connexion " + socket.id)

    if (socket.recovered) {
        if (!socket.data.actualRoomId) return 
        const player = getPlayerState(socket.data.actualRoomId, socket.id)
        console.log(player)
        player.isOffline = false
        io.to(socket.data.actualRoomId).emit("refresh players", getPlayerRoomState(socket.data.actualRoomId))
    }

    // Disconnect socket
    socket.on('disconnect', (reason) => {
        console.log('user disconnected [' + socket.id + '] cause ' + reason)
        if (!socket.data.actualRoomId) return 
		
        getPlayerState(socket.data.actualRoomId, socket.id).isOffline = true
        io.to(socket.data.actualRoomId).emit("refresh players", getPlayerRoomState(socket.data.actualRoomId))

        // Wait 1min before to delete player
        setTimeout(() => {
            if (getPlayerState(socket.data.actualRoomId, socket.id).isOffline) {
                deletePlayer(socket.data.actualRoomId, socket.id)
                io.to(socket.data.actualRoomId).emit("refresh players", getPlayerRoomState(socket.data.actualRoomId))
            }
        }, 60 * 1000)
    });

    // Disconnect socket room
    socket.on('disconnecting', () => {
        console.log('disconnect : ' + socket.id + ' to room ');
    });

    // ROOM
    socket.on("Room:Create", (player, avatar, roundNumber) => {
        let roomId = makeid(6);
        
        // Check room exist already
        while (roomState.find(e => e.roomId === roomId) !== undefined) {
            roomId = makeid(6);
        }

        // Set socket data
        socket.data.actualRoomId = roomId
        socket.data.pseudo = player.pseudo
        socket.data.isRoomMaster = true
        socket.join(roomId);

        // Set new room
        const roomObj = initRoomState(socket, true);
        roomObj.gamesNumber = roundNumber
        roomState.push(roomObj)

        // Save avatar
        const avatarObj = { socketId: socket.id, avatar }
        const newRoomAvatars = {
            roomId,
            avatars: [avatarObj]
        }
        roomAvatars.push(newRoomAvatars)
        
        io.to(roomId).emit('join room', roomObj, newRoomAvatars);
    });

    socket.on("Room:Join", (roomId, player, avatar) => {
        try {
            if (!roomId) {           
                socket.emit('msg', "Aucun channel pour " + roomId);
                return;
            }

            // Set socket data
            socket.join(roomId);
            socket.data.actualRoomId = roomId
            socket.data.pseudo = player.pseudo

            // Set new player in room
            const newPlayer = new Player(socket.id, player.pseudo)
            let room = getRoom(roomId)
            room.players.push(newPlayer)
            
            // Save avatar
            const avatarObj = { socketId: socket.id, avatar }
            const actualRoomAvatars = roomAvatars.find(e => e.roomId === roomId)
            actualRoomAvatars.avatars.push(avatarObj)

            io.to(roomId).emit('join room', room, actualRoomAvatars);
        }
        catch(e) {
            console.error(e)
        }
    });

    socket.on("Room:Quit", () => {
        const roomId = socket.data.actualRoomId
        socket.leave(roomId)
        deletePlayer(roomId, socket.id)
        socket.data = {}
        io.to(roomId).emit("refresh players", getPlayerRoomState(roomId))
    })

    socket.on("Room:ReadyToPlay", () => {
        getPlayerState(socket.data.actualRoomId, socket.id).isReady = true
        io.to(socket.data.actualRoomId).emit("refresh players", getPlayerRoomState(socket.data.actualRoomId))

		const room = getRoom(socket.data.actualRoomId)
        if (room?.players.every(e => e.isReady)) {
			room.gamesTour = getGamesTour(room.gamesNumber, room.players.length)
            sendNextGame(io, socket, 3000)
        }
    });
    
    socket.on("Room:NotReadyToPlay", () => {
        getPlayerState(socket.data.actualRoomId, socket.id).isReady = false
        io.to(socket.data.actualRoomId).emit("refresh players", getPlayerRoomState(socket.data.actualRoomId))
    });

    socket.on("replay", () => {
        if (!socket.data.isRoomMaster) return
        resetRoom(socket.data.actualRoomId)
        io.to(socket.data.actualRoomId).emit("refresh players", getPlayerRoomState(socket.data.actualRoomId))
    })
    
    socket.on("Game:PlayGame", (data) => {
        playGame(io, socket, data)
    });

    socket.on("Game:GiveSoif", (socketId, soifNumber = 1) => {
        const player = getPlayerState(socket.data.actualRoomId, socket.id)
        if (player.givedSoif) return

        // Give the soif
        const playerToGive = getPlayerState(socket.data.actualRoomId, socketId)
        playerToGive.addSoifToDrink(soifNumber, player)

        // Set soif has been gived by the player
        player.soifToGive -= soifNumber

        io.to(socket.data.actualRoomId).emit("refresh players", getPlayerRoomState(socket.data.actualRoomId))
    });
	
    socket.on("Game:ReadyForNextRound", () => {
        const player = getPlayerState(socket.data.actualRoomId, socket.id)
		player.readyForNextRound = true
		
		// If all soif has been gived, launch next game
		const players = getPlayerRoomState(socket.data.actualRoomId)
        const winnersHasGived = players.filter(e => e.winner).every(e => e.givedSoif)
        const everyIsReady = players.every(e => e.readyForNextRound)
        if (winnersHasGived && everyIsReady) {
			// Send next game after 4s
			sendNextGame(io, socket, isProd ? 4000 : 500)
        }
        io.to(socket.data.actualRoomId).emit("refresh players", getPlayerRoomState(socket.data.actualRoomId))
    });

    socket.on("Game:GetJokerOfRarity", (rarity) => {
        const jokerOfPlayer = getPlayerState(socket.data.actualRoomId, socket.id).jokers
        const availableJoker = JokerTools.GetRarity(rarity).filter(e => !jokerOfPlayer.includes(e.id) )
        const joker = utils.GetRandomElement(availableJoker)
        if (joker) {
            jokerOfPlayer.push(joker)
        }
        // TODO : Manage msg if no joker available
        socket.emit("refresh players", getPlayerRoomState(socket.data.actualRoomId))
    })
    
    socket.on("Game:UseJoker", (joker, data) => {
        const player = getPlayerState(socket.data.actualRoomId, socket.id)
        const players = getPlayerRoomState(socket.data.actualRoomId)
        const msg = joker.effect(player, players)
        player.jokers = player.jokers.filter(e => e.id !== joker.id)
        io.to(socket.data.actualRoomId).emit("Game:UseJoker", msg)
    })

    // SIMON
    socket.on("SimonLightUpButton", (color) => {
        socket.broadcast.emit("SimonLightUpButton", color)
    });
    socket.on("SimonNextRound", () => {
        const actualGame = getRoom(socket.data.actualRoomId).actualGame
        actualGame.level++
        actualGame.message = `${actualGame.level}`
        io.to(socket.data.actualRoomId).emit("UpdateActualGame", actualGame)
    });
    socket.on("SimonUpdateMsg", (msg) => {
        const actualGame = getRoom(socket.data.actualRoomId).actualGame
        actualGame.message = msg
        io.to(socket.data.actualRoomId).emit("SimonUpdateMsg", actualGame.message)
    });

    // TTMC
    socket.on("TTMCChosenQuestionNumber", (index) => {
        getRoom(socket.data.actualRoomId).actualGame.chosenQuestionNumber = index
        io.to(socket.data.actualRoomId).emit("TTMCChosenQuestionNumber", index)
    });

    // Personnal question
    socket.on("PersonnalAnswer", personnalAnswer => {
        getRoom(socket.data.actualRoomId).actualGame.playerAskingTheQuestionAnswer = personnalAnswer
        playGame(io, socket, '')
    })

    // Naval battle
    socket.on("NavalBattle:PlaceShip", position => {
        const ship = {
            player: getPlayerState(socket.data.actualRoomId, socket.id),
            isAlive: true,
            position,
            playerHitted: 0
        }
        const room = getRoom(socket.data.actualRoomId)
        room.actualGame.playerShips.push(ship)
        
        if (room.actualGame.playerShips.length === room.players.length) {
            room.actualGame.shipsArePlaced = true
        }
        
        io.to(socket.data.actualRoomId).emit("UpdateActualGame", room.actualGame)
    })
    socket.on("NavalBattle:Shoot", position => {

        const room = getRoom(socket.data.actualRoomId)
        room.actualGame.playerShoots.push(position)

        room.actualGame.playerShips.forEach(e => {
            if (e.position === position) {
                e.isAlive = false
                room.actualGame.playerShips.find(e => e.player.socketId === socket.id).playerHitted++
            }
        })

        // Check if all ships left are on the same position
        const AllIsOnTheSamePosition = room.actualGame.playerShips.filter(e => e.isAlive).every(val => val.position === room.actualGame.playerShips[0].position);

        // Next player turn 
        if (room.actualGame.playerShips.filter(e => e.isAlive).length > 1 && !AllIsOnTheSamePosition) {
            do {
                room.actualGame.playerTurnIdx++
                if (room.actualGame.playerTurnIdx >= room.players.length) {
                    room.actualGame.playerTurnIdx = 0
                }
                room.actualGame.playerTurn = room.players[room.actualGame.playerTurnIdx]
            }
            while (room.actualGame.playerShips.find(e => e.player.socketId === room.actualGame.playerTurn.socketId && !e.isAlive))
        }
        else {
            room.actualGame.allShipsDestroyed = true
        } 

        io.to(socket.data.actualRoomId).emit("UpdateActualGame", room.actualGame)
    })
})

function setActualGameData(room, nextGame) {
    room.actualGame = nextGame
    room.nextGameDescription = nextGame

    switch(room.actualGame.name) {
        case "ReactionClick":
            room.actualGame.randomDelay = Math.floor(Math.random() * 10000) // Entre 0ms et 10000ms
            break
        case "GuessNumber":
            room.actualGame.targetNumber = Math.floor(Math.random() * 100) + 1 // Entre 1 et 100
            break
        case "Simon":
            const buttons = ['red', 'green', 'blue', 'yellow']
            const btnSequence = []
            const gameTurn = []
            let playerIdx = 0;

            for (let i = 0; i < 21; i++) {
                // Sequence of btns
                const button = buttons[Math.floor(Math.random() * buttons.length)]
                btnSequence.push(button)

                // Sequence of players
                gameTurn.push(room.players[playerIdx])
                playerIdx++
                playerIdx = playerIdx + 1 > room.players.length ? 0 : playerIdx 
            }
            room.actualGame.btnSequence = btnSequence
            room.actualGame.gameTurn = gameTurn
            room.actualGame.level = 0
            room.actualGame.message = ""
            room.actualGame.clickedBtn = null
            room.actualGame.isLooserDrinking = false
            break
        case "TTMC":
            const theme = utils.GetRandomElement(TtmcThemes)
            const playerChooseQuestionNumber = utils.GetRandomElement(room.players)
            
            room.actualGame.theme = theme
            room.actualGame.playerChooseQuestionNumber = playerChooseQuestionNumber
            room.actualGame.chosenQuestionNumber = null
            break
        case "DoYouPrefer":
            room.actualGame.questions = utils.GetRandomElement(DoYouPreferQuestions)
            break
        case "PersonnalQuestion":
			// Assign a player to choose the answer, and a random question
            room.actualGame.question = utils.GetRandomElement(PersonnalQuestion)
            room.actualGame.playerAskingTheQuestion = utils.GetRandomElement(room.players)
            room.actualGame.playerAskingTheQuestionAnswer = null
            break
        case "NavalBattle":
            room.actualGame.message = ''
            room.actualGame.playerShips = []
            room.actualGame.playerShoots = []
            room.actualGame.shipsArePlaced = false
            room.actualGame.allShipsDestroyed = false
            room.actualGame.playerTurnIdx = 0
            room.actualGame.playerTurn = room.players[room.actualGame.playerTurnIdx]
            break

        default:
            break
    }
}



function sendNextGame(io, socket, wait = 2000) {
    const room = getRoom(socket.data.actualRoomId)
    if (!room) return

    const nextGame = room.gamesTour[room.gameIdx]
    setActualGameData(room, nextGame)
	
	// Display next game desc
	room.showNextGamDesc = true
	io.to(socket.data.actualRoomId).emit("refresh room", room)
	
	// Send next game
    setTimeout(() => {
		room.showNextGamDesc = false
		
		// Re-init players state for next game
		room.players.forEach(e => {
			e.resetRoundData()
		})
		
		io.to(socket.data.actualRoomId).emit("refresh room", room)
		room.gameIdx++
    }, wait)
}

function playGame(io, socket, data) {
    let choices
    let player = getPlayerState(socket.data.actualRoomId, socket.id)
	if (player.hasPlayed) return
	
    const room = getRoom(socket.data.actualRoomId)
    if (!room) return

    // Assign value played at player
    player.gameValue = data
    player.gameValueLabel = data
    player.hasPlayed = true
    player.readyForNextRound = false

    // Send answer if all played has played
    if (!room.players.every(e => e.hasPlayed && e.gameValue !== null) && room.actualGame.name !== "Simon") {
        io.to(socket.data.actualRoomId).emit("refresh players", getPlayerRoomState(socket.data.actualRoomId))
        return;
    }

    try {
        // Check answer
        switch(room.actualGame.name) {
            case "RedOrBlack":
                choices = ["ROUGE", "NOIR"]
                room.roundAnswer = utils.GetRandomElement(choices)
                break

            case "CardColors":
                choices = ["♠️", "♥", "♦", "♣️"]
                room.roundAnswer = utils.GetRandomElement(choices)
                break

            // Bigger score of players
            case "StopSlider":
            case "FastClick":
            case "SurvivalEmoji":
            case "DotClick":
                room.roundAnswer = Math.max.apply(Math, room.players.map(e => e.gameValue));
                break
				
            // Lower score of players
            case "ReactionClick":
            case "Labyrinth":
                room.roundAnswer = Math.min.apply(Math, room.players.map(e => e.gameValue));
                break
                
            case "Simon":
                // If the score is > 0 then it's a win, else if the score = 0, it's a loose for this player  
                if (data === 0) {
                    // Assign to other players the right value
                    room.players.filter(e => e.socketId !== socket.id).forEach(e => {
                        e.gameValue = room.actualGame.level
                        e.hasPlayed = true
                    })
                    room.roundAnswer = room.actualGame.level
                    room.actualGame.isLooserDrinking = true
                } 
                else {
                    room.roundAnswer = room.actualGame.btnSequence.length
                }
                break

            case "GuessNumber":
                room.roundAnswer = room.actualGame.targetNumber
                break
                
            case "TTMC":
                room.roundAnswer = room.actualGame.theme.questions[room.actualGame.chosenQuestionNumber].answer.toLowerCase()
                break
				
            case "DoYouPrefer":
				let question1 = question2 = 0
				room.players.forEach(e => e.gameValue === room.actualGame.questions[1] ? question1++ : question2++)
                room.roundAnswer = question1 === question2 ? 'Aucune, c\'est une égalité' : question1 > question2 ? room.actualGame.questions[1] : room.actualGame.questions[2] 
                break
                
            case "PersonnalQuestion":
                room.roundAnswer = room.actualGame.playerAskingTheQuestionAnswer
                break

            case "Blackjack":
            case "NavalBattle":
                room.roundAnswer = null
                break
            default:
                break
        }

        // Assign soif to winner
        setGameValueLabel(room, data)
        setSoif(room, data)
      
        io.to(socket.data.actualRoomId).emit("refresh room", getRoom(socket.data.actualRoomId))
    }
    catch(e) {
        console.error(e)
    }
}

function setGameValueLabel(room, data) {
    room.players.forEach(e => {
        switch(room.actualGame.name) {
            case "Blackjack":
                e.gameValueLabel = `${e.gameValue.playerScore} contre ${e.gameValue.dealerScore}` + (e.gameValue.hasDoubled ? ' + a doublé' : '')
                break
            case "NavalBattle":
                e.gameValueLabel = `${e.gameValue.soif} touché` + (e.gameValue.isStillAlive ? ' + dernier en vie' : '')
                break
        }
    })
}

function setSoif(room, data) {
    let winners = []
    let soifToGive = null

    // Find winners
    switch(room.actualGame.name) {
        case "Simon":
            if (room.actualGame.isLooserDrinking) {
                room.players.find(e => e.gameValue === 0)?.addSoifToDrink(room.actualGame.soif)
            } else {
                room.players.find(e => e.gameValue === room.roundAnswer)?.addSoifToDrink(room.roundAnswer)
            }
            // winners = room.players.filter(e => e.gameValue.win)
            // soifToGive = Math.floor(room.actualGame.level/room.players.length) + 1
            break;
        case "Blackjack":
            winners = room.players.filter(e => e.gameValue.win)
            break;
        case "NavalBattle":
            winners = room.players.filter(e => e.gameValue.soif > 0 || e.gameValue.isStillAlive)
            break;
        case "TTMC":
            winners = room.players.filter(e => e.gameValue === room.roundAnswer || room.roundAnswer.split(" ").filter(e => e).includes(e.gameValue))
            break;
        default:
            winners = room.players.filter(e => e.gameValue === room.roundAnswer)
            soifToGive = room.actualGame.soif
            break
    }

    // Assign soif
    winners.forEach(e => { 
        e.winner = true

        // If soif to give is different between players
        if (soifToGive === null) {
            switch(room.actualGame.name) {
                case "TTMC":
                    e.addSoifToGive(room.actualGame.chosenQuestionNumber + 1)
                    break
                case "Blackjack":
                    e.addSoifToGive(e.gameValue.soif)
                    break
                case "NavalBattle":
                    e.addSoifToGive(e.gameValue.soif + (e.gameValue.isStillAlive ? 2 : 0))
                    break
            }
        } else {
            e.addSoifToGive(soifToGive)
        }
    })
}

function resetRoom(roomId) {
    const room = getRoom(roomId)
    const actualRoundNumber = room.gamesTour.length
    
    // Reset players
    room.players.forEach(player => {
        player.reset()
    })

    room.gamesTour = getGamesTour(actualRoundNumber, room.players.length)
    room.gameIdx = 0
}

// TODO si le joueur supprimé était le roommaster le rajouter
function deletePlayer(roomId, socketId) {
    try {
        console.log(`[${socketId}] quit room ${roomId}`)
        const room = getRoom(roomId)
        room.players = room.players.filter(e => e.socketId !== socketId)
        
        // Room deleted
        if (room.players.length === 0) {
            roomState = roomState.filter(e => e.roomId !== roomId)
        }

        let avatarRoom = getAvatarRoom(roomId)
        avatarRoom.avatars = avatarRoom.avatars.filter(e => e.socketId !== socketId)

        // Avatar room deleted
        if (avatarRoom.avatars.length === 0) {
            roomAvatars = roomAvatars.filter(e => e.roomId !== roomId)
        }
    }
    catch(e) {
        console.log(`erreur dans la suppression du joueur: ${e}`)
    }
}

function getRoom(roomId) {
    return roomState.find(e => e.roomId === roomId)
}

function getAvatarRoom(roomId) {
    return roomAvatars.find(e => e.roomId === roomId)
}

function getAvatarPlayer(roomId, socketId) {
    return getAvatarRoom(roomId).avatars?.find(e => e.socketId === socketId)?.avatar
}

function getPlayerRoomState(roomId) {
    return getRoom(roomId)?.players ?? []
}

function getPlayerState(roomId, socketId) {
    return getPlayerRoomState(roomId)?.find(e => e.socketId === socketId) ?? {};
}

function getGamesTour(number = 2, nbPlayers) {
    const tour = []
	
	// Filter the games that cannot be played
	const gamesPlayable = allGames.filter(e => {
		let gameCanBePlayed = true
		if (e.minPlayers && e.minPlayers > nbPlayers)
			gameCanBePlayed = false
		if (e.maxPlayers && e.maxPlayers < nbPlayers)
			gameCanBePlayed = false
        return gameCanBePlayed
	})

    while (tour.length != number) {
		tour.push(utils.GetRandomElement(gamesPlayable))
    }

    tour.push({name: "PodiumSoif", description: "Tableau des scores"})
    return tour
}

// Generate a random string with a fixed length
function makeid(length) {
    let result             = '';
    const characters       = '0123456789'; // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}