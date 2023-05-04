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
} from "../../../communications";

interface ContextValues {
  socket: Socket;
  loggedInUser: string | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<string | null>>;
  joinRoom: (room: string) => void;
}

const SocketContext = createContext<ContextValues>(null as any);
export const useSocket = () => useContext(SocketContext);
// export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

function SocketProvider({ children }: PropsWithChildren) {
  const [socket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io);
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("username")
  );

  function joinRoom(room: string) {
    socket.emit("join", room);
  }
  
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
    <SocketContext.Provider
      value={{ socket, loggedInUser, setLoggedInUser, joinRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
