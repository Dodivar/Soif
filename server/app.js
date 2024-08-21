const express = require("express")();
const Http = require("http").Server(express);
const io = require("socket.io")(Http, {
  cors: {
    origin: "http://192.168.1.15:3000"
  }
});
const PORT = process.env.PORT || 3333;
Http.listen(PORT, () => {
    console.log("Listening at : " + PORT);
})
const TtmcThemes = require("./games/TTMC_themes.json")


const Player = require("./player.js");
const Room = require("./room.js");

// Init model of room
const initRoomState = (socket, isRoomMaster) => {
    const actualPlayer = new Player(socket.id, socket.pseudo, isRoomMaster)
    return new Room(socket, actualPlayer)
}

var roomState = []; // State of rooms
var roomAvatars = []; // Avatar of players

const allGames = [
    {
        theme: 'qa',
        games: [
            {name: 'RedOrBlack', description: 'Rouge ou noir ?', soif: 2, templateAnswer: 'La réponse était :'}, 
            {name: 'CardColors', description: 'Pique, coeur, carreaux ou trèfles ?', soif: 4, templateAnswer: 'La réponse était :'}, 
            {name: 'TTMC', description: 'Répond correctement à la question !', soif: 5, templateAnswer: 'La réponse était :'}
        ],
    },
    {
        theme: 'reflexe',
        games: [
            {name: 'StopSlider', description: 'Arrête le curseur le plus proche du milieu !', soif: 4, templateAnswer: 'Le meilleur score :'}, 
            {name: 'ReactionClick', description: 'Clic sur l\'emoji dès qu\'il apparaît !', soif: 4, templateAnswer: 'Le meilleur score :'}, 
            {name: 'FastClick', description: 'Clic le plus rapidement possible !', soif: 4, templateAnswer: 'Le meilleur score :'}, 
            {name: 'DotClick', soif: 4, description: 'Les points bleu valent +3 points, les verts +5, mais les oranges -2 !', templateAnswer: 'Le meilleur score :'}, 
            {name: 'SurvivalEmoji', description: 'Reste en vie le plus longtemps possible en gardant ton doigt sur l\'écran !',  soif: 4, templateAnswer: 'Le meilleur score :'}
        ],
    },
    {
        theme: 'reflexion',
        games: [
            {name: 'Simon', description: 'Mémorise la suite des couleurs', soif: 4, templateAnswer: 'Niveau :'}, 
            {name: 'GuessNumber', soif: 4, description: 'Devine le nombre mystère !', templateAnswer: 'Le nombre était :'},
            // {name: 'FaceExpressionDetector', soif: 4}
        ],
    },
]

io.on("connection", socket => {

    console.log("Connexion " + socket.id)

    // Disconnect socket
    socket.on('disconnect', (reason) => {
        console.log('user disconnected [' + socket.id + '] cause ' + reason)
        deletePlayer(socket.actualRoomId, socket.id)
        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
        // TODO si c'était le dernier joueur qui devait jouer alors envoyer le prochain jeu
    });

    // Disconnect socket room
    socket.on('disconnecting', () => {
        console.log('disconnect : ' + socket.id + ' to room ');
    });

    socket.on("create room", (player, avatar, roundNumber) => {
        let roomId = makeid(6);
        
        // Check room exist already
        while (roomState.find(e => e.roomId === roomId) !== undefined) {
            roomId = makeid(6);
        }

        // Set socket data
        socket.actualRoomId = roomId
        socket.pseudo = player.pseudo
        socket.isRoomMaster = true
        socket.join(roomId);

        // Set new room
        const roomObj = initRoomState(socket, true);
        roomObj.gamesTour = getGamesTour(roundNumber)
        roomState.push(roomObj)

        // Save avatar
        const avatarObj = { socketId: socket.id, avatar }
        const newRoomAvatars = {
            roomId,
            avatars: [avatarObj]
        }
        roomAvatars.push(newRoomAvatars)
        
        io.emit('join room', roomObj, newRoomAvatars);
    });

    socket.on("join room", (roomId, player, avatar) => {
        try {
            if (!roomId) {           
                socket.emit('msg', "Aucun channel pour " + roomId);
                return;
            }

            // Set socket data
            socket.join(roomId);
            socket.actualRoomId = roomId
            socket.pseudo = player.pseudo

            // Set new player in room
            const newPlayer = new Player(socket.id, player.pseudo)
            let room = getRoom(roomId)
            room.players.push(newPlayer)
            
            // Save avatar
            const avatarObj = { socketId: socket.id, avatar }
            const actualRoomAvatars = roomAvatars.find(e => e.roomId === roomId)
            actualRoomAvatars.avatars.push(avatarObj)

            io.emit('join room', room, actualRoomAvatars);
        }
        catch(e) {
            console.error(e)
        }
    });

    socket.on("quit room", () => {
        deletePlayer(socket.actualRoomId, socket.id)
        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
    });

    socket.on("ready to play", () => {
        getPlayerState(socket.actualRoomId, socket.id).isReady = true
        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))

        if (getPlayerRoomState(socket.actualRoomId).every(e => e.isReady)) {
            sendNextGame(io, socket, 500)
        }
    });

    socket.on("replay", () => {
        if (!socket.isRoomMaster) return
        resetRoom(socket.actualRoomId)
        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
    })
    
    socket.on("playGame", (data) => {
        playGame(io, socket, data)
    });

    socket.on("give soif", (socketId, soifNumber = 1) => {
        // Give the soif
        const playerToGive = getPlayerState(socket.actualRoomId, socketId)
        playerToGive.soifTotal += soifNumber
        playerToGive.soifAddedThisRound += soifNumber
        playerToGive.hasDrink = false

        // Set soif has been gived by the player
        const player = getPlayerState(socket.actualRoomId, socket.id)
        player.soifToGive -= soifNumber
        player.totalSoifGived += soifNumber
        player.givedSoif = player.soifToGive === 0

        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))

    });
	
    socket.on("HasDrink", () => {
        const player = getPlayerState(socket.actualRoomId, socket.id)
		player.hasDrink = true
		
		// If all soif has been gived soif, launch next game
		const players = getPlayerRoomState(socket.actualRoomId)
        const winnersHasGived = players.filter(e => e.winner).every(e => e.givedSoif)
        const everyHasDrink = players.filter(e => e.soifAddedThisRound > 0).every(e => e.hasDrink)
        if (winnersHasGived && everyHasDrink) {
            sendNextGame(io, socket)
        }
    });

    // SIMON
    socket.on("SimonLightUpButton", (color) => {
        socket.broadcast.emit("SimonLightUpButton", color)
    });
    socket.on("SimonNextRound", () => {
        const actualGame = getRoom(socket.actualRoomId).actualGame
        actualGame.level++
        actualGame.message = `${actualGame.level}`
        io.to(socket.actualRoomId).emit("UpdateActualGame", actualGame)
    });
    socket.on("SimonUpdateMsg", (msg) => {
        const actualGame = getRoom(socket.actualRoomId).actualGame
        actualGame.message = msg
        io.to(socket.actualRoomId).emit("SimonUpdateMsg", actualGame.message)
    });

    // TTMC
    socket.on("TTMCChosenQuestionNumber", (index) => {
        getRoom(socket.actualRoomId).actualGame.chosenQuestionNumber = index
        io.to(socket.actualRoomId).emit("TTMCChosenQuestionNumber", index)
    });
})

function setActualGameData(room, nextGameName) {
    room.actualGame = {}
    room.actualGame.name = nextGameName.name
    room.actualGame.templateAnswer = nextGameName.templateAnswer

    switch(room.actualGame.name) {
        case "ReactionClick":
            room.actualGame.randomDelay = Math.floor(Math.random() * 9000) + 1000 // Entre 1000ms et 10000ms
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
            break
        case "TTMC":
            const theme = TtmcThemes[Math.floor(Math.random() * TtmcThemes.length)]
            const playerChooseQuestionNumber = room.players[Math.floor(Math.random() * room.players.length)]
            
            room.actualGame.theme = theme
            room.actualGame.playerChooseQuestionNumber = playerChooseQuestionNumber
            room.actualGame.chosenQuestionNumber = null
            break
        default:
            break
    }
}

function nextGameDescription(room) {
    const nextGameIdx = room.gameIdx + 1
    if (nextGameIdx > room.gamesTour.length - 1) return null
    return room.gamesTour[nextGameIdx].description
}

function sendNextGame(io, socket, wait = 2000) {
    const room = getRoom(socket.actualRoomId)
    const nextGame = room.gamesTour[room.gameIdx]
    
    setActualGameData(room, nextGame)
    room.nextGameDescription = nextGameDescription(room)

    // Re-init players state for next game
    room.players.forEach(e => {
        e.hasPlayed = false
        e.winner = false
        e.soifToGive = 0
        e.gameValue = null
        e.soifAddedThisRound = 0
        e.givedSoif = false
    })
    
    setTimeout(() => {
        io.to(socket.actualRoomId).emit("refresh room", room)
        room.gameIdx++
    }, wait)
}

function playGame(io, socket, data) {
    let choices
    let player = getPlayerState(socket.actualRoomId, socket.id)
	if (player.hasPlayed) return
	
    const room = getRoom(socket.actualRoomId)
    let waitBeforeNextRound = 2000

    // Assign value played at player
    player.gameValue = data
    player.hasPlayed = true

    // Send answer if all played has played
    if (!room.players.every(e => e.hasPlayed && e.gameValue !== null) && room.actualGame.name !== "Simon") {
        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
        return;
    }

    try {
        // Check answer
        switch(room.actualGame.name) {
            case "RedOrBlack":
                choices = ["ROUGE", "NOIR"]
                room.roundAnswer = choices[Math.round(Math.random())]
                break

            case "CardColors":
                choices = ["♠️", "❤️", "🔶", "♣️"]
                room.roundAnswer = choices[Math.floor(Math.random() * choices.length)]
                break

            // Best score of players
            case "StopSlider":
            case "ReactionClick":
            case "FastClick":
            case "SurvivalEmoji":
            case "DotClick":
                room.roundAnswer = Math.max.apply(Math, room.players.map(e => e.gameValue));
                break
                
            case "Simon":
                // If the score is > 0 then it's a win, else if the score = 0, it's a loose for this player  
                if (data === 0) {
                    // Assign to other players the right value
                    room.players.filter(e => e.socketId !== socket.id).forEach(e => {
                        e.gameValue = room.roundAnswer
                        e.hasPlayed = true
                    })
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
                waitBeforeNextRound = 4000
                break
            default:
                break
        }

        // Assign winner, if no one send next game
        const winners = room.players.filter(e => e.gameValue === room.roundAnswer)
        if (winners.length > 0) {

            // Get the number of soif to give
            let soifToGive = 2
            allGames.forEach(theme => {
                const filter = theme.games.find(e => e.name === room.actualGame.name)
                if (!filter) return 
                
                if (filter.name === "Simon") {
                    soifToGive = Math.floor(room.actualGame.level/room.players.length) + 1
                }
                else {
                    soifToGive = filter.soif
                }
                return;
            })
            
            winners.forEach(e => { 
                e.winner = true
                e.soifToGive = soifToGive
             })
             
            io.to(socket.actualRoomId).emit("refresh room", getRoom(socket.actualRoomId))
        }
        else {
            io.to(socket.actualRoomId).emit("refresh room", getRoom(socket.actualRoomId))
            sendNextGame(io, socket, waitBeforeNextRound)
        }
    }
    catch(e) {
        console.error(e)
    }
}

function resetRoom(roomId) {
    const room = getRoom(roomId)
    const actualRoundNumber = room.gamesTour.length
    
    // Reset players
    room.players.forEach(player => {
        player.reset()
    })

    room.gamesTour = getGamesTour(actualRoundNumber)
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

function getPlayerRoomState(roomId) {
    return getRoom(roomId)?.players
}

function getPlayerState(roomId, socketId) {
    return getPlayerRoomState(roomId)?.find(e => e.socketId === socketId);
}

function getGamesTour(number = 2) {
    const tour = []
    let typeIdx = 0

    while (tour.length != number) {
        const possibilities = allGames[typeIdx].games

        if (possibilities.length === 1) {
            tour.push(possibilities[0])
        } 
        else {
            const rdm = Math.floor(
                Math.random() * possibilities.length
            )
            tour.push(possibilities[rdm])
        }

        typeIdx = typeIdx + 1 === allGames.length ? 0 : typeIdx + 1
    }

    tour.push({name: "PodiumSoif"})
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

function deleteRoomData(roomId) {
    const roomIdx = roomState.findIndex(e => e.roomId === roomId)
    roomState = roomState.splice(roomIdx, 1)
    delete io.sockets.adapter.rooms[roomId];
}