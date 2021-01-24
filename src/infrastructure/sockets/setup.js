import { config } from '../../config';

import socketIOClient from 'socket.io-client';
import { SocketEvents } from '../../shared/constants/events';
import { appStore } from '../../shared/store/AppStore';

const socket = socketIOClient(config.BASE_URL, { transports: ['websocket'] });

socket.on(SocketEvents.UsersOnline, data => {
  appStore.setOnlineUsers(data.onlineUsers);
});

socket.on(SocketEvents.Connect, function() {
  appStore.setIsWebSocketConnected(true);
});

socket.on(SocketEvents.Errors.Connect, function() {
  appStore.setIsWebSocketConnected(false);
});

export { socket };
