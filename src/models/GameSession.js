const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  players: {
    type: [String],
    default: [], // allow players to be empty initially
    validate: [arrayLimit, '{PATH} exceeds the limit of 2']
  },
  playerNames: {
    type: [String],
    default: [] // New field to store player names
  },
  currentState: {
    type: [String],
    default: Array(9).fill('') // This represents the board.
  },
  currentPlayer: {
    type: String,
    default: 'X' // This is either 'X' or 'O'.
  },
  winner: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'completed'],
    default: 'waiting'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


function arrayLimit(val) {
  return val.length <= 2;
}

gameSessionSchema.methods.joinSession = function(playerName) {
  if (this.status === 'waiting' && this.players.length < 2) {
    this.players.push(playerName);
    if (this.players.length === 2) {
      this.status = 'in_progress';
      this.currentPlayer = this.players[0] === 'X' ? 'O' : 'X'; // Set the currentPlayer to the opposite of the first player
    }
    return true;
  }
  return false;
};
// Method to make a move
gameSessionSchema.methods.makeMove = function(player, index) {
  if (this.status !== 'in_progress' || this.currentState[index] !== '' || this.winner) {
    // Invalid move
    return false;
  }

  this.moves.push({ player, index });
  this.currentState[index] = player;

  // Check for a winner after the move
  if (this.checkWinner(player)) {
    this.winner = player;
    this.status = 'completed';
  } else if (this.moves.length === 9) {
    // Draw condition
    this.status = 'completed';
  }

  return true;
};

// Method to check for a winner
gameSessionSchema.methods.checkWinner = function(player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  return winningCombinations.some(combination => {
    return combination.every(index => {
      return this.currentState[index] === player;
    });
  });
};

//Method to get current game state

gameSessionSchema.methods.getCurrentState = function() {
  return {
    sessionId: this.sessionId,
    players: this.players,
    playerNames: this.playerNames,
    currentState: this.currentState,
    currentPlayer: this.currentPlayer,
    winner: this.winner,
    status: this.status
  };
};

module.exports = mongoose.model('GameSession', gameSessionSchema);
