import * as http from 'http';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '~/types';
import { setCodeRoutes } from './codeRoutes';

export const setSocketIO = (httpServer: http.Server) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer);
  setCodeRoutes(io);

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('noArg');
    socket.emit('basicEmit', 1, '2', Buffer.from([3]));
    socket.emit('withAck', '4', (e) => {
      // e is inferred as number
    });
    // works when broadcast to all
    io.emit('noArg');

    // works when broadcasting to a room
    io.to('room1').emit('basicEmit', 1, '2', Buffer.from([3]));
  });
  return io;
};