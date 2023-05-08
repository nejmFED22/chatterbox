export interface Room {
  name: string;
  onlineUsers: number;
  //users: User[];
  //messages: Message[]
}

export interface User {
  //SessionID: socket.sessionID
  //UserID: socket.userID;
  id: string;
  username: string;
  isConnected?: boolean;
}

export interface Message {
  content: string;
  author: string;
}
