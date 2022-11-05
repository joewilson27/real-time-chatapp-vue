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

io.on('connection', (socket) => {
    console.log(`a user connected with id ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`user disconnected with an id ${socket.id}`);
    });
});

http.listen(PORT, () => {
    console.log(`listening http on *:${PORT}`);
});