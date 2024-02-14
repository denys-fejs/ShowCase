import { createContext } from 'react';
import { Socket } from 'socket.io-client';

import { SocketEvents } from 'constants/socket';

export interface ISocketEventResponse {
  data: Record<string, unknown>;
  meta: Record<string, unknown>;
}

export interface ISocketContext {
  socket?: Socket;
  emit?: (event: SocketEvents, data: Record<string, string | number>) => void;
  subscribe?: (event: SocketEvents, handler: (eventData: ISocketEventResponse) => void) => void;
}

export default createContext<ISocketContext>({});
