export const BROADCAST_CHANNEL_NAME = 'rigamo-channel';
export const BroadcastEvents = {
  Login: 'BE_LOGIN',
  Logout: 'BE_LOGOUT',
};

export const SocketEvents = {
  Connect: 'connect',
  Disconnect: 'disconnect',
  UserOnline: 'USER_ONLINE',
  UserOffline: 'USER_OFFLINE',
  UsersOnline: 'USERS_ONLINE',
  Errors: {
    Connect: 'connect_error'
  }
};
