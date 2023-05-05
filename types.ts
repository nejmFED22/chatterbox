// export interface Room {
//   roomName: string;
//   users: string[];
//   messages: Message[];
// }

export interface User {
  //SessionID: socket.sessionID
  //UserID: socket.userID;
  username: string;
  isConnected: boolean;
}

export interface Message {
  content: string;
  author: string;
}
