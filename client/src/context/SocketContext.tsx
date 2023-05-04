import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../server/communication";

interface ContextValues {
  socket: Socket;
}

const SocketContext = createContext<ContextValues>(null as any);
export const useSocket = () => useContext(SocketContext);
// export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

function SocketProvider({ children }: PropsWithChildren) {
  const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io);

  useEffect(() => {
    function connect() {
      console.log("Connected to server");
    }
    function disconnect() {
      console.log("Disconnected from server");
    }
    function message(message: string) {
      console.log(message);
    }

    socket.on("connect", connect);
    socket.on("message", message);
    socket.on("disconnect", disconnect);

    return () => {
      socket.off("connect", connect);
      socket.off("message", message);
      socket.off("disconnect", disconnect);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
