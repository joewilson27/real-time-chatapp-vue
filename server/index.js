const app = require('express')(); // Express initializes app to be 
//a function handler that you can supply to an HTTP server down below
const http = require('http').createServer(app);
const PORT = 3000;
const io = require('socket.io')(http, {
    cors: {
      origins: ['http://localhost:8080']
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

const jwt = require('jsonwebtoken');
// jwt secret
const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

io.use(async (socket, next) => {
    // fetch token from handshake auth sent by FrontEnd
    const token = socket.handshake.auth.token;
    try {
        // verify jwt token and get user data
        const user = await jwt.verify(token, JWT_SECRET);
        console.log('user', user);
        // save the user data into socket object, to be used further
        socket.user = user;
        next();
    } catch (e) {
        // if token is invalid, close connection
        console.log('error', e.message);
        return next(new Error(e.message));
    }
});

io.on('connection', (socket) => {
    // join user's own room
    socket.join(socket.user.id);
    console.log("a user connected");

    let token = socket.handshake.auth.token;
    console.log(`a user connected with id ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`user disconnected with an id ${socket.id}`);
    });

    socket.on('my message', (msg) => {
        console.log(`broadcast this message to all users connected`);
        console.log('message: ' + msg);
        io.emit('my broadcast', `server: ${msg}`);
    });

    socket.on("join", (roomName) => {
        console.log("join: " + roomName);
        socket.join(roomName);
    });

    socket.on("message", ({ message, roomName }, callback) => {
        console.log("message: " + message + " in " + roomName);

        // generate data to send to receivers
        const outgoingMessage = {
            name: socket.user.name,
            id: socket.user.id,
            message,
        };
        
        // send socket to all in room except sender
        socket.to(roomName).emit("message", outgoingMessage);
        callback({
          status: "ok"
        });
        // send to all including sender
        // io.to(roomName).emit("message", message);
    });

});

http.listen(PORT, () => {
    console.log(`listening http on *:${PORT}`);
});
