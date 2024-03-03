const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Load chat history from file
let chatHistory = [];
try {
    const data = fs.readFileSync('chat_history.json', 'utf8');
    chatHistory = JSON.parse(data);
} catch (err) {
    console.error("Error reading chat history:", err);
}

// Save chat history to file
function saveChatHistory() {
    fs.writeFileSync('chat_history.json', JSON.stringify(chatHistory), 'utf8');
}

// Socket.IO connection
io.on('connection', (socket) => {
    // Send chat history to newly connected client
    socket.emit('chatHistory', chatHistory);

    // Receive new messages from clients and broadcast to all clients
    socket.on('message', (data) => {
        chatHistory.push(data);
        saveChatHistory();
        io.emit('message', data); // Broadcast message to all clients
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

