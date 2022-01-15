import { io } from 'socket.io-client';

let url = '';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  url = 'http://localhost:5000';
} else {
  url = 'http://kltnapi.herokuapp.com';
}

export const socketClient = io(url, {
  transports: ['websocket', 'polling', 'flashsocket'],
});
