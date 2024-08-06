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

var Player = require("./player.js");

// Init model of room
const initRoomState = (socket, isRoomMaster) => {
    const actualPlayer = new Player(socket.id, socket.pseudo, isRoomMaster)
    return  {
        roomId: socket.actualRoomId,
        gamesTour: null,
        gameIdx: 0,
        actualGameName: null,
        players: [actualPlayer],
        player: actualPlayer,
        roundAnswer: null,
    }
}

var roomState = []; // State of rooms

const games = {
    qa: 
    [
        {name: 'RedOrBlack', soif: 2}, 
        {name: 'CardColors', soif: 4}, 
        // {name: 'TTMC', soif: 5}
    ],
    reflexe:
    [
        {name: 'StopSlider', soif: 4}, 
        // {name: 'ReactionClick', soif: 4}, 
        // {name: 'FastClick', soif: 4}, 
        // {name: 'DotClick', soif: 4}, 
        // {name: 'SurvivalEmoji', soif: 4}
    ],
    reflexion: 
    [
        // {name: 'Simon', soif: 4}, 
        // {name: 'GuessNumber', soif: 4}
    ]
}

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
                let players = null;

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

    socket.on("score timeout", () => {
        resetPlayersReady(socket.actualRoomId)
        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
    })

    socket.on("playGame", (data) => {
        playGame(io, socket, data)
    })

    socket.on("refresh players", (players) => {
        getPlayerRoomState(socket.actualRoomId) = players;
        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
    }) 
})


function sendNextGame(io, socket, wait = 2000) {
    const room = getRoom(socket.actualRoomId)
    const nextGameName = room.gamesTour[room.gameIdx].name
    room.actualGameName = nextGameName

    // Re-init players state for next game
    room.players.forEach(e => {
        e.hasPlayed = false
        e.winner = false
        e.soifToGive = 0
        e.gameValue = null
        e.soifAddedThisRound = 0
        e.givedSoif = false
    })

    console.log(`prochain round ${nextGameName} dans ${wait}ms`)
    setTimeout(() => {
        console.log('ooo')
        io.to(socket.actualRoomId).emit("refresh room", room)
        room.gameIdx++
    }, wait)
}

function playGame(io, socket, data) {
    let choices
    let player = getPlayerState(socket.actualRoomId, socket.id)
    const room = getRoom(socket.actualRoomId)

    player.gameValue = data
    player.hasPlayed = true

    // Send answer if all played has played
    if (!room.players.every(e => e.hasPlayed && e.gameValue !== null)) {
            io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
        return;
    }

    try {
        // Check answer
        switch(room.actualGameName) {
            case "RedOrBlack":
                choices = ["red", "black"]
                room.roundAnswer = choices[Math.round(Math.random())]
                break

            case "CardColors":
                choices = ["♠️", "❤️", "🔶", "♣️"]
                room.roundAnswer = choices[Math.floor(Math.random() * choices.length - 1)]
                break

            case "StopSlider":
                const bestScore = Math.max.apply(Math, room.players.map(e => e.gameValue));
                room.roundAnswer = bestScore
                break
            default:
                break
        }
        console.log(`Réponse: ${room.roundAnswer}`)



        // Assign winner, if no one send next game
        const winners = room.players.filter(e => e.gameValue === room.roundAnswer)
        if (winners.length > 0) {

            // Get the number of soif to give
            let soifToGive = 2
            Object.keys(games).forEach(type => {
                const filter = games[type].find(e => e.name === room.actualGameName)
                if (filter) {
                    soifToGive = filter.soif
                    return;
                }
            })
            
            winners.forEach(e => { 
                e.winner = true
                e.soifToGive = soifToGive
             })
             
            io.to(socket.actualRoomId).emit("refresh room", getRoom(socket.actualRoomId))
        }
        else {
            io.to(socket.actualRoomId).emit("refresh room", getRoom(socket.actualRoomId))
            sendNextGame(io, socket)
        }
    }
    catch(e) {
        console.error(e)
    }
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

function deletePlayer(roomId, socketId) {
    try {
        console.log("room to quit " + roomId)
        const playerIdx = getPlayerRoomState(roomId).findIndex(e => e.socketId === socketId)
        getPlayerRoomState(roomId) = getPlayerRoomState(roomId).splice(playerIdx, 1)
    }
    catch(e) {}
}

function resetPlayersReady(roomId) {
    getPlayerRoomState(roomId).forEach(player => 
    {
        player.isReady = false
        player.soifAdded = 0
    })
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

    const types = Object.keys(games)

    const tour = []
    let typeIdx = 0

    while (tour.length != number) {
        const possibilities = games[types[typeIdx]]

        if (possibilities.length === 1) {
            tour.push(possibilities[0])
        } 
        else {
            const rdm = Math.floor(
                Math.random() * possibilities.length
            )
            tour.push(possibilities[rdm])
        }

        typeIdx = typeIdx + 1 > games[types[typeIdx]].length ? 0 : typeIdx + 1
    }

    tour.push("ScoreSoif")
    return tour
}