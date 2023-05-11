import { Message, Room, Session, SocketData, User } from "./types";

export interface ServerToClientEvents {
  sessions: (sessions: Session[]) => void;
  rooms: (rooms: Room[]) => void;
  roomJoined: (room: string) => void;
  roomHistory: (room: string, history: Message[]) => void;
  message: (room: string, message: Message) => void;
  users: (users: User[]) => void;
  session: (session: SocketData) => void;
  typingStart: (user: string) => void;
  typingStop: (user: string) => void;
}

export interface ClientToServerEvents {
  sessions: (socket: any) => void;
  message: (room: string, message: Message) => void;
  join: (room: string) => void;
  leave: (room: string) => void;
  createRoom: (roomName: string, firstUser: string) => void;
  typingStart: (room: string, user: string) => void;
  typingStop: (room: string, user: string) => void;
  getRoomHistory: (room: string) => void;
}

export interface InterServerEvents {}
