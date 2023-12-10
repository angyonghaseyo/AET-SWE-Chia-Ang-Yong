import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useLocation } from 'react-router-dom';
import GameList from './components/GameList';
import GameSession from './components/GameSession';
import TicTacToeBoard from './components/TicTacToeBoard';
import WaitingRoom from './components/WaitingRoom';
import api from './services/api';
import './App.css';

function App() {
  const [gameSessions, setGameSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [userName, setUserName] = useState('');
  const location = useLocation();

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

  const speakWelcomeMessage = () => {
    if (location.pathname === '/') {
      const message = `Welcome ${userName}, to Tic Tac Toe for Everyone.
      Just three steps to play this game.
      Firstly, Click on Create Game Session and share with your friend the session I D.
      Secondly, Join the Game Session
      Lastly, Game Begins when two players join the room, take turns to put X and O.
      First to line up three WINS`;
      const speechSynthesisUtterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(speechSynthesisUtterance);
    }
  };

  return (
    <div className="App">
      {userName && (
        <header className="App-header" 
                onMouseEnter={speakWelcomeMessage} 
                onMouseLeave={() => window.speechSynthesis.cancel()}>
          Welcome, {userName}
          
          <h1>Tic Tac Toe for Everyone</h1>
          <br />
          <p >
          Just three steps to play this game: <br /><br /><br />
          1. Click on Create Game Session and share with your friend the session id. <br /><br />
          2. Join the Game Session <br /> <br /> 
          3. Game Begins when two players join the room, take turns to put 'X' and 'O'. <br /> <br /> 
          First to line up three WINS</p>
        </header>
      )}
      <div className="App-content">
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
          <Route 
            path="/play/:sessionId" 
            element={<TicTacToeBoardWrapper />} 
          />
          <Route 
            path="/session/:sessionId/waiting" 
            element={<WaitingRoomWrapper userName={userName} />}
          />
          <Route 
            path="/game/:sessionId" 
            element={<TicTacToeBoardWrapper />} 
          />
        </Routes>
      </div>
    </div>
  );
}

// Wrapper for TicTacToeBoard
function TicTacToeBoardWrapper() {
  const { sessionId } = useParams();
  return <TicTacToeBoard sessionId={sessionId} />;
}

// Wrapper for WaitingRoom
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
