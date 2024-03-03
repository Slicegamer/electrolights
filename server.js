const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Store chat history
let chatHistory = [];

// Send chat history to the client when it connects
io.on('connection', (socket) => {
    socket.emit('chatHistory', chatHistory);
});

// Receive and broadcast messages
io.on('connection', (socket) => {
    socket.on('message', (data) => {
        const date = new Date();
        const messageData = { ...data, date };
        chatHistory.push(messageData);
        io.emit('message', messageData);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
