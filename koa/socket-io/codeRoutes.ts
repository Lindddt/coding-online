
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '~/types';
import { Server } from 'socket.io';
import {
  cunstomLogger
} from '../logger/logs/log4js';
const logPrefix = '[websocket/code]: ';
export const setCodeRoutes = (
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  const codeRoutes = io.of('/code');

  codeRoutes.on('connection', (socket) => {
    cunstomLogger.logDebug([logPrefix, 'code connected'].join(''));

    socket.onAny((eventName, ...args) => {
      cunstomLogger.logDebug([logPrefix, 'code routes', eventName, ...args].join(''));
    });
    socket.on('sendMessage', (arg) => {
      console.log(arg); // world
      socket.emit('resend', arg);
    });
  });
  return codeRoutes;
};