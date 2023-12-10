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
  const [isSpeaking, setIsSpeaking] = useState(false);

  const resetGame = () => {
    socket.emit('reset game', sessionId);
  };


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

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening even after a command is recognized
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);

    };
    
    recognition.onend = () => {
      
      console.log('Speech recognition ended');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log(transcript);
      handleVoiceCommand(transcript);
    };

    recognition.start();


    return () => {
      recognition.stop();
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

  const readCellInfo = (index) => {

    setIsSpeaking(true);

    const row = Math.floor(index / 3) + 1; // Calculate row
    const col = (index % 3) + 1;           // Calculate column
    const value = board[index] ? board[index] : 'empty';

    console.log(`Row: ${row}, Column: ${col}, Value: ${value}`);


    const msg = new SpeechSynthesisUtterance();
    msg.text = `Row: ${row}, Column: ${col}, Value: ${value}`;
    msg.onend = () => {
      setIsSpeaking(false);
  };
    window.speechSynthesis.speak(msg);

};


const handleVoiceCommand = (transcript) => {
  // Parse the transcript to extract row and column
  const matches = transcript.match(/row (\d) column (\d)/i);
  if (matches) {
    console.log("matched")

    const row = parseInt(matches[1], 10);
    const col = parseInt(matches[2], 10);
    const index = (row - 1) * 3 + (col - 1);
    if (index >= 0 && index < 9) {
      handleCellClick(index);
    }
  }
};

  const renderCell = (index) => {
    return (
        <button 
            className="cell" 
            onClick={() => handleCellClick(index)} 
            onMouseEnter={() => !isSpeaking && readCellInfo(index)}
            disabled={!!winner}>
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

      <button onClick={resetGame}>Start New Game</button>

    </div>
  );
};
export default TicTacToeBoard;
