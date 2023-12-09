import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Adjust according to your server configuration

const api = {
  // Create a new game session
  createSession: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/sessions`);
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  // Get a list of available game sessions
  getSessions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sessions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },

  // Get details of a single game session
  getSession: async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  },

  // Make a move in a game session
  makeMove: async (sessionId, player, position) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/sessions/${sessionId}/move`, {
        player,
        position
      });
      return response.data;
    } catch (error) {
      console.error('Error making move:', error);
      throw error;
    }
  },

  // Retrieve the game state after a move
  getGameState: async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sessions/${sessionId}/state`);
      return response.data;
    } catch (error) {
      console.error('Error retrieving game state:', error);
      throw error;
    }
  },
  joinSession: async (sessionId, playerName) => {
  const response = await axios.post(`${API_BASE_URL}/api/sessions/${sessionId}/join`, { playerName });
  return response.data;
  },

  // End a game session
  endSession: async (sessionId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }
};

export default api;

