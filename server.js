const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the static files (HTML, CSS, JavaScript)
app.use(express.static('public'));

const chatHistory = []; // Array to store chat messages

// Event handler for new connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send chat history to the new client
    socket.emit('chatHistory', chatHistory);

    // Event handler for new messages
    socket.on('message', (data) => {
        chatHistory.push(data); // Store the message
        io.emit('message', data); // Broadcast the message to all clients
    });

    // Event handler for disconnections
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
