export interface Room {
  name: string;
  onlineUsers: number;
  //users: User[];
  //messages: Message[]
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

export interface Session {
  sessionID: string;
  userID: string;
  username: string;
}

export interface SocketData {
  username: string;
  userID: string;
  sessionID: string;
  //isConnected?: boolean;
}
