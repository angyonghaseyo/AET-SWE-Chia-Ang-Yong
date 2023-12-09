import io from 'socket.io-client';

// Initialize socket connection
const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:3000');

export default socket;
