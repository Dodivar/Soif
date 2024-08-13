const Express = require("express")();
const Http = require("http").Server(Express);
const io = require("socket.io")(Http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
Http.listen(3333, () => {
    console.log("Listening at : 3333");
})
const TtmcThemes = require("./games/TTMC_themes.json")


var Player = require("./player.js");

// Init model of room
const initRoomState = (socket, isRoomMaster) => {
    const actualPlayer = new Player(socket.id, socket.pseudo, isRoomMaster)
    return  {
        roomId: socket.actualRoomId,
        gamesTour: null,
        gameIdx: 0,
        actualGame: {
            name: null,
        },
        players: [actualPlayer],
        player: actualPlayer,
        roundAnswer: null,
    }
}

var roomState = []; // State of rooms

const allGames = [
    {
        theme: 'qa',
        games: [
            {name: 'RedOrBlack', soif: 2, templateAnswer: 'La réponse était '}, 
            {name: 'CardColors', soif: 4, templateAnswer: 'La réponse était '}, 
            {name: 'TTMC', soif: 5, templateAnswer: 'La réponse était '}
        ],
    },
    {
        theme: 'reflexe',
        games: [
            {name: 'StopSlider', soif: 4, templateAnswer: 'Le meilleur score '}, 
            {name: 'ReactionClick', soif: 4, templateAnswer: 'Le meilleur score '}, 
            {name: 'FastClick', soif: 4, templateAnswer: 'Le meilleur score '}, 
            {name: 'DotClick', soif: 4, templateAnswer: 'Le meilleur score '}, 
            {name: 'SurvivalEmoji', soif: 4, templateAnswer: 'Le meilleur score '}
        ],
    },
    {
        theme: 'reflexion',
        games: [
            {name: 'Simon', soif: 4, templateAnswer: 'Le meilleur score '}, 
            {name: 'GuessNumber', soif: 4, templateAnswer: 'Le meilleur score '},
            // {name: 'FaceExpressionDetector', soif: 4}
        ],
    },
]

io.on("connection", socket => {

    // Disconnect socket
    socket.on('disconnect', () => {
        console.log('user disconnected [' + socket.id + ']')

        socket.rooms.forEach(roomId => {
            deletePlayer(roomId, socket.id)
        })
    });

    // Disconnect socket room
    socket.on('disconnecting', async () => {
        // the rooms array contains at least the socket ID
        const roomId = await Object.keys(socket.rooms)[1];
        const playerSocket = await Object.keys(socket.rooms)[0];
        console.log('disconnect : ' + playerSocket + ' to room ' + roomId);

        if (typeof roomId !== 'undefined') {

            // Get number of players
            let room = io.sockets.adapter.rooms[roomId];

            if (room) {
                // Delete player in state
                if (room.length > 1) {
                    delete roomState[roomId].players[playerSocket];
                    io.sockets.adapter.rooms[roomId].length -= 1;
    
                    // Send notif player has left
                    io.to(roomId).emit('user_left_game', io.sockets.adapter.rooms[roomId].sockets);
                } 
                
                // Delete room data 
                else {
                    deleteRoomData(roomId);
                }
            } else {
                deleteRoomData(roomId);
            }
        }
    });

    socket.on("create room", pseudo => {
        const roomId = makeid(6);
        socket.join(roomId);
        socket.actualRoomId = roomId
        socket.pseudo = pseudo
        socket.isRoomMaster = true

        const roomObj = initRoomState(socket, true);
        roomObj.gamesTour = getGamesTour()
        roomState.push(roomObj)
        console.log(roomObj)

        io.emit('join room', roomObj);
    });

    socket.on("join room", (roomId, pseudo) => {
        if (!roomId) {           
            socket.emit('msg', "Aucun channel pour " + roomId);
            return;
        }

        socket.join(roomId);
        socket.actualRoomId = roomId
        socket.pseudo = pseudo

        const newPlayer = new Player(socket.id, pseudo)
        let room = getRoom(roomId)
        room.players.push(newPlayer)

        io.emit('join room', room);
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

    socket.on("give soif", (socketId, soifNumber) => {
        // Give the soif
        const playerToGive = getPlayerState(socket.actualRoomId, socketId)
        playerToGive.soifTotal += soifNumber
        playerToGive.soifAddedThisRound = soifNumber

        // Set soif has been gived
        const player = getPlayerState(socket.actualRoomId, socket.id)
        player.givedSoif = true

        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))

        // If all soif has been gived, launch next game
        const winners = getPlayerRoomState(socket.actualRoomId).filter(e => e.winner)
        if (winners.every(e => e.givedSoif)) {
            sendNextGame(io, socket)
        }
    });

    socket.on("playGame", (data) => {
        playGame(io, socket, data)
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

            for (let i = 0; i < 20; i++) {
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

function sendNextGame(io, socket, wait = 2000) {
    const room = getRoom(socket.actualRoomId)
    const nextGame = room.gamesTour[room.gameIdx]
    setActualGameData(room, nextGame)

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
            console.log(room.actualGame)
            allGames.forEach(theme => {
                console.log(theme)
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

function deletePlayer(roomId, socketId) {
    try {
        console.log("room to quit " + roomId)
        const playerIdx = getPlayerRoomState(roomId).findIndex(e => e.socketId === socketId)
        getPlayerRoomState(roomId) = getPlayerRoomState(roomId).splice(playerIdx, 1)
    }
    catch(e) {}
}

function getRoom(roomId) {
    return roomState.find(e => e.roomId === roomId)
}

function getPlayerRoomState(roomId) {
    return getRoom(roomId)?.players
}

function getPlayerState(roomId, socketId) {
    return getPlayerRoomState(roomId).find(e => e.socketId === socketId);
}

function getGamesTour(number = 10) {
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
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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