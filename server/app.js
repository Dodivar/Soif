const Express = require("express")();
const Http = require("http").Server(Express);
const io = require("socket.io")(Http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

var Player = require("./player.js");

// Init model of room
const initRoomState = (socket) => {
    const actualPlayer = new Player(socket.id, socket.pseudo)
    return  {
        roomId: socket.actualRoomId,
        gamesTour: null,
        players: [actualPlayer],
        player: actualPlayer,
        isPlaying: false
    }
}

var roomState = []; // State of rooms

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

        const roomObj = initRoomState(socket);
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
        io.to(roomId).broadcast.emit("refresh players", getPlayerRoomState(socket.actualRoomId))
    });

    socket.on("quit room", () => {
        deletePlayer(socket.actualRoomId, socket.id)
        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
    });

    socket.on("ready to play", () => {
        getPlayerState(socket.actualRoomId, socket.id).isReady = true

        // if (getPlayerRoomState(socket.actualRoomId)?.every(e => e.isReady)) {
        //     io.to(socket.actualRoomId).emit("launch games")
        // }
        console.log(getPlayerRoomState(socket.actualRoomId))
        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
    });

    socket.on("give soif", (socketId, soifNumber) => {
        giveSoif(socket.actualRoomId, socketId, soifNumber)
        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
    });

    socket.on("score timeout", () => {
        resetPlayersReady(socket.actualRoomId)
        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
    })

    socket.on("playGame", (gameName, data) => {
        playGame(socket, gameName, data)

        io.to(socket.actualRoomId).emit("refresh players", getPlayerRoomState(socket.actualRoomId))
    })
})

Http.listen(3333, () => {
    console.log("Listening at : 3333");
})

function playGame(socket, name, data) {
    let choices, rightAnswer;
    let player = getPlayerState(socket.actualRoomId, socket.id)

    try {
        switch(name) {
            case "RedOrBlack":
                choices = ["red", "black"]
                rightAnswer = choices[Math.round(Math.random())]

                if (data === rightAnswer) {
                    player.winner = true
                }

                socket.emit("RedOrBlack answer", rightAnswer)
                break

            case "CardColors":
                choices = ["♠️", "❤️", "🔶", "♣️"]
                rightAnswer = choices[Math.floor(Math.random() * choices.length - 1)]

                if (data === rightAnswer) {
                    player.winner = true
                }

                socket.emit("CardColors answer", rightAnswer)
                break

            case "StopSlider":

                const everyPlayerPlayed = getPlayerRoomState(socket.actualRoomId).every(e => e.gameValue !== null)

                // Assign the winner
                if (everyPlayerPlayed) {
                    console.log('every has played !')
                    const bestScore = Math.max.apply(Math, getPlayerRoomState(socket.actualRoomId).map(e => e.gameValue));
                    getPlayerRoomState(socket.actualRoomId).filter(e => e.gameValue === bestScore).forEach(e => {
                        e.gameWinner = true
                    })
                }
                break
            default:
                break
        }

        player.gameValue = data
        player.hasPlayed = true
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

function deleteRoomData (roomId) {
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

function giveSoif(roomId, socketId, number) {
    const player = getPlayerState(roomId, socketId)
    player.soif += number
    player.soifAdded = number
    player.givedSoif = true
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
    const games = {
        qa: ['RedOrBlack', 'CardColors'],
        reflexe: ['StopSlider']
    }
    const types = Object.keys(games)

    const tour = []
    let typeIdx = 0

    while (tour.length != number) {
        const possibilities = games[types[typeIdx]]

        if (possibilities.length === 1) {
            tour.push(possibilities[0])
        } else {
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