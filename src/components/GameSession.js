const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  players: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} exceeds the limit of 2']
  },
  board: {
    type: [String],
    default: Array(9).fill('') // 3x3 Tic-Tac-Toe board
  },
  currentPlayer: {
    type: String,
    default: 'X' // X or O
  },
  winner: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['ongoing', 'finished'],
    default: 'ongoing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    required: true, // Set to true if you want to enforce sessionId, otherwise set to false
    unique: true
  }

});

function arrayLimit(val) {
  return val.length <= 2;
}

gameSessionSchema.statics.createSession = async function (sessionId, players) {
  const session = new this({ sessionId, players });
  await session.save();
  return session;
};

gameSessionSchema.methods.addMove = function (player, index) {
  if (this.status === 'finished' || this.board[index] !== '' || player !== this.currentPlayer) {
    return;
  }

  this.board[index] = player;
  if (checkWinner(this.board, player)) {
    this.winner = player;
    this.status = 'finished';
  } else if (this.board.every(cell => cell !== '')) {
    this.status = 'finished'; // Draw
  } else {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  return this.save();
};

function checkWinner(board, player) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return lines.some(line => {
    return line.every(index => {
      return board[index] === player;
    });
  });
}

module.exports = mongoose.model('GameSession', gameSessionSchema);
