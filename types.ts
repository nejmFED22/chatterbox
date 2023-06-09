export interface Room {
  name: string;
  onlineUsers: string[];
}

export interface User {
  sessionID: string;
  userID: string;
  username: string;
  isConnected?: boolean;
}

export interface Message {
  content: string;
  author: string;
}

export interface PrivateMessage {
  content: string;
  author: string;
  recipient: string;
  authorUsername: string;
  recipientUsername: string;
}

export interface Session {
  sessionID: string;
  userID: string;
  username: string;
}

export interface SocketData {
  username: string;
  userID: string;
  sessionID: string;
  isConnected?: boolean;
}
