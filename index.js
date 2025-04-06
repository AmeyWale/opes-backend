const express = require('express')
const cors = require("cors")
require('dotenv').config()
const socketIO = require('socket.io');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const server = http.createServer(app);
const io = socketIO(server);

// Socket.io to handle real-time events
io.on('connection', (socket) => {
    console.log('New client connected');

    // Listening to camera feed event from frontend
    socket.on('camera_feed', (data) => {
        // send this feed to proctoring service
        console.log('Camera Feed Data:', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('Connected!');
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
