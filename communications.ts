import { Message } from "./types";

// Servern skickar
export interface ServerToClientEvents {
  message: (message: Message) => void;
}

// Klienten skickar
export interface ClientToServerEvents {
  message: (message: Message) => void;
  join: (room: string) => void;
  leave: (room: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
