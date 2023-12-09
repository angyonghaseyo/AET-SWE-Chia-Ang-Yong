import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import GameList from './components/GameList';
import GameSession from './components/GameSession';
import TicTacToeBoard from './components/TicTacToeBoard';
import WaitingRoom from './components/WaitingRoom'; // Import the WaitingRoom component
import api from './services/api';
import './App.css';

function App() {
  const [gameSessions, setGameSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [userName, setUserName] = useState(''); 

  useEffect(() => {
    const fetchGameSessions = async () => {
      try {
        const response = await api.getSessions();
        setGameSessions(response);
      } catch (error) {
        console.error("Failed to fetch game sessions:", error);
      }
    };

    fetchGameSessions();
  }, []);

    useEffect(() => {
    let name = localStorage.getItem('userName');
    if (!name) {
      name = prompt('Please enter your name:', '');
      localStorage.setItem('userName', name);
    }
    setUserName(name);
  }, []);

  const createGameSession = async () => {
    try {
      const newSession = await api.createSession();
      setGameSessions([...gameSessions, newSession]);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const selectGameSession = (sessionId) => {
    const session = gameSessions.find(session => session.id === sessionId);
    setCurrentSession(session);
  };

  return (
    <div className="App">

      {userName && <header className="App-header">Welcome, {userName}
      <h1>Tic Tac Toe for Everyone</h1>
      </header>}
      
      <Routes>
        <Route 
          path="/" 
          element={<GameList 
                      gameSessions={gameSessions} 
                      onSelectSession={selectGameSession} 
                      onCreateSession={createGameSession} />} 
        />
        <Route 
          path="/session/:sessionId" 
          element={<GameSession 
                      session={currentSession} 
                      onGameUpdate={createGameSession} />} 
        />
        {/* Updated the '/play' route to use dynamic ':sessionId' */}
        <Route 
          path="/play/:sessionId" 
          element={<TicTacToeBoardWrapper />} 
        />
        <Route 
          path="/session/:sessionId/waiting" 
          element={<WaitingRoomWrapper userName={userName} />}
        />
        {/* New route for the game board */}
        <Route 
          path="/game/:sessionId" 
          element={<TicTacToeBoardWrapper />} 
        />
      </Routes>
    </div>
  );
}

// Wrapper component for TicTacToeBoard to use useParams hook
function TicTacToeBoardWrapper() {
  const { sessionId } = useParams(); // Extract the sessionId from the URL
  
  // Pass the sessionId prop to TicTacToeBoard
  return <TicTacToeBoard sessionId={sessionId} />;
}

// Wrapper component for WaitingRoom to use useParams hook
function WaitingRoomWrapper() {
  const { sessionId } = useParams(); 
  const { userName } = useParams(); 
  
  return <WaitingRoom sessionId={sessionId} playerName={userName} />;
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
export default AppWithRouter;
