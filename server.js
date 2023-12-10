require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const GameSession = require('./src/models/GameSession');
const gameLogic = require('./src/utils/gameLogic');
const sessionRoutes = require('./routes/sessions');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Database Connection
// mongoose.connect("mongodb+srv://chiaangyong:Bundancekk1@clusteray.sl3fcv9.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));


// Database Connection
mongoose.connect("mongodb://localhost:27017/yourDatabaseName", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/sessions', sessionRoutes);
let sessionPlayerSockets = {};

// WebSocket logic
io.on('connection', (socket) => {

  socket.on('reset game', async (sessionId) => {
    console.log("resetting")
    try {
      let session = await GameSession.findById(sessionId);
      if (!session) {
        socket.emit('error', 'Session not found');
        return;
      }

      // Reset the game state
      session.currentState = Array(9).fill(null);
      session.winner = null;
      session.status = 'in_progress';
      await session.save();

      // Emit the updated session state to all clients
      io.emit('game update', session);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('join session', async (sessionId) => {
    
    try {
      let session = await GameSession.findById(sessionId);
      if (!session) {
        socket.emit('error', 'Session not found');
        return;
      }
  
      let playerType;
      if (!sessionPlayerSockets[sessionId]) {
        sessionPlayerSockets[sessionId] = {};
      }

      if (Object.keys(sessionPlayerSockets[sessionId]).length === 0) {
        playerType = 'X';
      } else if (Object.keys(sessionPlayerSockets[sessionId]).length === 1) {
        playerType = 'X' in sessionPlayerSockets[sessionId] ? 'O' : 'X';
      } else {
        socket.emit('error', 'Session is full');
        return;
      }

        // Track the player's socket ID and type
      sessionPlayerSockets[sessionId][playerType] = socket.id;
      if (session.players.length === 0) {
        playerType = 'X';
      } else if (session.players.length === 1) {
        // Assign the opposite type to the second player
        playerType = session.players[0] === 'X' ? 'O' : 'X';
      } else {
        socket.emit('error', 'Session is full');
        return;
      }
  
        // Track the player's socket ID and type
        sessionPlayerSockets[sessionId][playerType] = socket.id;

        // Update session with player type if not already present
        if (!session.players.includes(playerType)) {
          session.players.push(playerType);
        }
        session.status = session.players.length === 2 ? 'in_progress' : session.status;
        await session.save();
        io.emit('session update', session);
        socket.emit('player type', playerType);

        // Update player count in the database
        session.playerCount = Object.keys(sessionPlayerSockets[sessionId]).length;
        await session.save();
        // Emit player count update
        const playerCount = Object.keys(sessionPlayerSockets[sessionId]).length;
        io.emit('player count update', { sessionId, playerCount });

      } catch (error) {
        socket.emit('error', error.message);
      }
  });
  socket.on('disconnect', async () => {
    // Find which session and player type the socket belongs to
    for (const [sessionId, players] of Object.entries(sessionPlayerSockets)) {
      for (const [playerType, id] of Object.entries(players)) {
        if (id === socket.id) {
          let session = await GameSession.findById(sessionId);
          if (session) {
            // Remove the player from the session
            session.players = session.players.filter(p => p !== playerType);
            session.status = 'waiting';
            await session.save();
            io.emit('session update', session);

            // Remove the player's socket ID from the tracking object
            delete sessionPlayerSockets[sessionId][playerType];

            // Emit player count update
            const playerCount = session ? Object.keys(sessionPlayerSockets[sessionId]).length : 0;
            io.emit('player count update', { sessionId, playerCount });
            // Update player count in the database
            session.playerCount = Object.keys(sessionPlayerSockets[sessionId]).length;
            await session.save();
            break;
          }
        }
      }
    }
  });
  socket.on('make move', async (sessionId, position) => {
    try {

      let session = await GameSession.findById(sessionId);
      if (!session || session.status !== 'in_progress') {
        console.log("not in pgoress")
        socket.emit('error', 'Invalid session state');
        return;
      }

      // Determine the player type based on the socket ID
      const playerTypes = sessionPlayerSockets[sessionId];
      if (!playerTypes) {
        console.log("session not in pgoress")

        socket.emit('error', 'Session not found in socket tracking');
        return;
      }
  
      const playerType = Object.keys(playerTypes).find(type => playerTypes[type] === socket.id);
      console.log(sessionPlayerSockets)
      console.log(socket.id)
      console.log(playerTypes)
      if (!playerType) {
        console.log('player not recognised')

        socket.emit('error', 'Player not recognized in the session');
        return;
      }
      console.log(playerType)
      // Check if it's the correct player's turn
      console.log(session.currentPlayer)
      const currentPlayerType = session.currentPlayer === 'X' ? 'X' : 'O';
      if (currentPlayerType !== playerType) {
        console.log("not your turn ")

        socket.emit('error', 'Not your turn');
        return;
      }
  
      const isValidMove = gameLogic.isValidMove(session.currentState, position);
      console.log("Check valid move ")
      console.log(isValidMove)
      console.log(session.currentState)
      console.log(position)

      if (isValidMove) {

        // Assign the move based on the player type
        session.currentState[position] = playerType === 'X' ? 'X' : 'O';
  
        const winner = gameLogic.checkWinner(session.currentState);
        if (winner) {
          session.winner = winner;
          session.status = 'completed';
        } else {
          // Switch the current player
          session.currentPlayer = session.currentPlayer === 'X' ? 'O' : 'X';
        }
  
        await session.save();
        io.emit('game update', session); // Broadcast the updated state
      } else {
        console.log('invalid move')
        socket.emit('error', 'Invalid move');
      }
    } catch (error) {
      console.log(error.message)

      socket.emit('error', error.message);
    }

  });
  
});

// Start the server with WebSocket support
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
