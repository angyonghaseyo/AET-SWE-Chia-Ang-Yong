import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import socket from './socket'; 


const WaitingRoom = ({ sessionId, playerName }) => {
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const joinSession = () => {
      socket.emit('join session', sessionId);
    };

    const handleSessionUpdate = (updatedSessionState) => {
      setSession(updatedSessionState);
      if (updatedSessionState.status === 'in_progress') {
        navigate(`/game/${sessionId}`);
      }
    };

    const handleError = (errorMessage) => {
      setError(errorMessage);
    };

    // Attach event listeners
    socket.on('session update', handleSessionUpdate);
    socket.on('error', handleError);

    // Join the session
    joinSession();

    // Clean up listeners when the component unmounts
    return () => {
      socket.off('session update', handleSessionUpdate);
      socket.off('error', handleError);
    };
  }, [sessionId, navigate]);

  // Display error if any
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Display the joining message until the session info is loaded
  if (!session) {
    return <div>Joining session as {playerName}...</div>;
  }

  // Display a message while waiting for another player to join
  if (session.status === 'waiting') {
    return <div>Waiting for another player to join, {playerName}...</div>;
  }

  // Display a message when the game is starting
  if (session.status === 'in_progress') {
    return <div>Game is starting...</div>;
  }

  // If the above conditions are not met, it's safe to assume we're still waiting for updates
  return (
    <div>
      Waiting for session updates...
    </div>
  );
};

export default WaitingRoom;
