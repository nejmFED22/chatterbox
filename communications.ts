import { Message, Room, User } from "./types";

export interface ServerToClientEvents {
  message: (room: string, message: Message) => void;
  rooms: (rooms: Room[]) => void;
  users: (users: User[]) => void;
  typingStart: (user: string) => void;
  typingStop: (suser: string) => void;
}

export interface ClientToServerEvents {
  setUser: (user: User) => void;
  getUsers: () => void;
  message: (room: string, message: Message) => void;
  join: (room: string) => void;
  leave: (room: string) => void;
  createRoom: (roomName: string, firstUser: string) => void;
  typingStart: (room: string, user: string) => void;
  typingStop: (room: string, user: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}
