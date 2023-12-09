import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TicTacToeBoard.css';
import api from '../services/api';
import io from 'socket.io-client';
import socket from './socket'; 

const TicTacToeBoard = () => {
  const { sessionId } = useParams();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // Fetch initial game state from the API
    api.getGameState(sessionId)
      .then(response => {
        console.log('Game state from backend:', response);
        console.log("set currentState ", response.currentState)
        setBoard(response.currentState  );
        setCurrentPlayer(response.currentPlayer);
        setWinner(response.winner);
      })
      .catch(error => {
        console.error('Error fetching game state:', error);
      });

    // Establish WebSocket connection
    

    // Join the session
    socket.emit('join session', sessionId);
    socket.on('player type', (playerType) => {
      console.log(`You are player ${playerType}`);
      // Set state or react accordingly
    });
    // Handle game updates
    socket.on('game update', (updatedSessionState) => {
      setBoard(updatedSessionState.currentState);
      setCurrentPlayer(updatedSessionState.currentPlayer);
      setWinner(updatedSessionState.winner);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [sessionId]); // Dependency array ensures this effect runs only when sessionId changes

  const handleCellClick = async (index) => {
    if (board && !board[index] && !winner) {
      // Emit 'make move' event to the server
      console.log("emitting make move");
      socket.emit('make move', sessionId, index);
    }
  };

  const renderCell = (index) => {
    return (
      <button className="cell" onClick={() => handleCellClick(index)} disabled={!!winner || board[index]}>
        {board[index]}
      </button>
    );
  };

  return (
    <div>
      <div className="board">
        {Array.from({ length: 9 }, (_, index) => renderCell(index))}
      </div>
      {winner && <div className="winner">Winner: {winner}</div>}
    </div>
  );
};
export default TicTacToeBoard;
