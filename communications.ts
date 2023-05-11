import { Message, PrivateMessage, Room, Session, SocketData, User } from "./types";

export interface ServerToClientEvents {
  updateSessionList: (sessions: Session[]) => void;
  message: (room: string, message: Message) => void;
  recievePrivateMessage: (message: PrivateMessage) => void;
  users: (users: User[]) => void;
  rooms: (rooms: Room[]) => void;
  setSession: (session: SocketData) => void;
  typingStart: (user: string) => void;
  typingStop: (user: string) => void;
  roomHistory: (room: string, history: Message[]) => void;
  DMHistory: (user: User, history: Message[]) => void;
}

export interface ClientToServerEvents {
  updateSessionList: (socket: any) => void;
  message: (room: string, message: Message) => void;
  sendPrivateMessage: (message: PrivateMessage, user: User) => void;
  join: (room: string) => void;
  joinDM: (user: User) => void;
  leave: (room: string) => void;
  createRoom: (roomName: string, firstUser: string) => void;
  typingStart: (room: string, user: string) => void;
  typingStop: (room: string, user: string) => void;
  getRoomHistory: (room: string) => void;
  getDMHistory: (user: User) => void;
}

export interface InterServerEvents {}
