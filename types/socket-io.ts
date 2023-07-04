import * as Socket from 'socket.io';

export interface SocketIOEvents {
  connect: () => void;
  connect_error: (err: Error) => void;
  disconnect: (reason: Socket.DisconnectReason) => void;
}
export interface ServerToClientEvents extends SocketIOEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  resend: (s: string) => void;

}

export interface ClientToServerEvents extends SocketIOEvents {
  hello: () => void;
  sendMessage: (s: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}