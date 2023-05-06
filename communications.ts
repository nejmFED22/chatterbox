import { Room } from "./types"

export interface ServerToClientEvents {
  message: (message: string) => void;
  rooms: (rooms: Room[]) => void;
}

export interface ClientToServerEvents {
  message: (message: string, room: string) => void;
  join: (room: string) => void;
  leave: (room: string) => void;
  createRoom: (roomName: string, firstUser: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}