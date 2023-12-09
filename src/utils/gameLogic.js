const checkWinner = (board) => {
    // Define the winning combinations
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

    // Check for a winner
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return null;
};

const isBoardFull = (board) => {
    return board.every(cell => cell !== null && cell !== '');
};

const isValidMove = (board, index) => {
    return index >= 0 && index < board.length && !board[index];
};

const makeMove = (board, index, player) => {
    if (isValidMove(board, index)) {
        const newBoard = [...board];
        newBoard[index] = player;
        return newBoard;
    }
    return board;
};

module.exports = {
    checkWinner,
    isBoardFull,
    isValidMove,
    makeMove,
};
