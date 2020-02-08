import { config } from '../../config';

import socketIOClient from "socket.io-client";
export const socket = socketIOClient(config.BASE_URL, { transports: ['websocket'] });
