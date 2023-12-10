import io from 'socket.io-client';

// Initialize socket connection
const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:3000') //|| 'https://infra-triumph-407714.an.r.appspot.com';

export default socket;
