import { io } from 'socket.io-client';

export const socketClient = io('http://localhost:5000', {
  transports: ['websocket', 'polling', 'flashsocket'],
});
