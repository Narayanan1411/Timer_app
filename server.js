const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let timer = 60; // Initial timer value in seconds
let timerInterval;

io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Send the initial timer value to the client
    socket.emit('timer', timer);

    // Start the timer
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
                console.log(`Timer: ${timer}`);
                io.emit('timer', timer);

                if (timer === 0) {
                    io.emit('notification', 'Timer has ended!');
                }
            }
        }, 1000);
    }

    // Clean up when client disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
