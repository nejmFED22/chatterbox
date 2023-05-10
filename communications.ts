import { Message, PrivateMessage, Room, Session, SocketData, User } from "./types";

export interface ServerToClientEvents {
  updateSessionList: (sessions: Session[]) => void;
  message: (room: string, message: Message) => void;
  privateMessage: (message: PrivateMessage) => void;
  users: (users: User[]) => void;
  rooms: (rooms: Room[]) => void;
  setSession: (session: SocketData) => void;
  typingStart: (user: string) => void;
  typingStop: (user: string) => void;
  roomHistory: (room: string, history: Message[]) => void;
}

export interface ClientToServerEvents {
  updateSessionList: (socket: any) => void;
  message: (room: string, message: Message) => void;
  privateMessage: (room: string, message: PrivateMessage) => void;
  join: (room: string) => void;
  leave: (room: string) => void;
  createRoom: (roomName: string, firstUser: string) => void;
  typingStart: (room: string, user: string) => void;
  typingStop: (room: string, user: string) => void;
  getRoomHistory: (room: string) => void;
}

export interface InterServerEvents {}
