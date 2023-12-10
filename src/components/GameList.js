import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import socket from './socket'; 

const GameList = ({ onSelectSession, userName }) => {
    const [playerCounts, setPlayerCounts] = useState({}); // State to track player counts
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {

        // Listen for player count updates
        socket.on('player count update', (data) => {
            setPlayerCounts(prevCounts => ({
                ...prevCounts,
                [data.sessionId]: data.playerCount
            }));
        });

        fetchSessions();

    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/sessions');
            setSessions(response.data);

            // Initialize player counts from fetched data
            const initialCounts = response.data.reduce((counts, session) => {
                counts[session._id] = session.playerCount;
                return counts;
            }, {});
            setPlayerCounts(initialCounts);
        } catch (err) {
            setError('Failed to fetch sessions: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSession = async () => {
        try {
            setLoading(true); // Set loading before the API call
            const response = await axios.post('/api/sessions', { playerName: userName });
            const newSession = response.data;
            setSessions(prevSessions => [...prevSessions, newSession]); // Add the new session to the state
        } catch (err) {
            setError('Failed to create a new session: ' + err.message);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const handleSelectSession = (sessionId) => {
        onSelectSession(sessionId); // Update the App state with the selected session
        navigate(`/session/${sessionId}/waiting`); // Navigate to the waiting room for the selected session
    };

    return (
        <div>
            <h2>Available Game Sessions</h2>
            <button onClick={handleCreateSession}>Create Game Session</button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <ul>
                {sessions.map((session) => (
                    // Check if session is defined and has _id property before rendering
                    session && session._id ? (
                        <li key={session._id}>
                            <button onClick={() => handleSelectSession(session._id)}>
                            Game Session {session._id} - Players: {playerCounts[session._id] || 0}/2
                            </button>
                        </li>
                    ) : null
                ))}
            </ul>
        </div>
    );
};

export default GameList;

