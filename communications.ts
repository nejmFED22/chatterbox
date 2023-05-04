// Servern skickar
export interface ServerToClientEvents {
  message: (message: string) => void;
}

// Klienten skickar
export interface ClientToServerEvents {
  message: (message: string, room: string) => void;
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
