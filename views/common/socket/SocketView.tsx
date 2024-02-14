import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import io, { Socket } from 'socket.io-client';

import appConfig from 'config/appConfig';
import { SocketEvents } from 'constants/socket';

import SocketContext, { ISocketEventResponse } from './SocketContext';

interface IProps {
  channels?: Array<string>;
  children?: ReactNode;
}

const SocketView = ({ children, channels }: IProps) => {
  const [socket, setSocket] = useState<Socket>();

  // Connect to socket on first render
  useEffect(() => {
    let socketIo: Socket;

    (async () => {
      socketIo = io(appConfig.serviceUrl, { transports: ['websocket'] });
      setSocket(socketIo);
    })();

    return () => {
      if (socketIo) {
        socketIo.disconnect();
      }
    };
  }, []);

  // Join channels after socket connected
  useEffect(() => {
    const channelsToJoin = channels?.slice();

    if (socket && channelsToJoin) {
      channelsToJoin.forEach((channel) => {
        socket.emit(SocketEvents.Channels, { action: 'join', channel });
      });
    }

    return () => {
      if (socket && channelsToJoin) {
        channelsToJoin.forEach((channel) => {
          socket.emit(SocketEvents.Channels, { action: 'leave', channel });
        });
      }
    };
  }, [socket, channels]);

  const emit = useCallback(
    (event: SocketEvents, data: Record<string, string | number>) => {
      if (socket) {
        socket.emit(event, data);
      }
    },
    [socket],
  );

  const subscribe = useCallback(
    (event: SocketEvents, handler: (eventData: ISocketEventResponse) => void) => {
      if (socket) {
        socket.on(event, handler);
      }
    },
    [socket],
  );

  const context = useMemo(
    () => ({
      socket,
      emit,
      subscribe,
    }),
    [socket, emit, subscribe],
  );

  return <SocketContext.Provider value={context}>{children}</SocketContext.Provider>;
};

export default SocketView;
