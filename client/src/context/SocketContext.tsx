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
  sendMessage: (message: string) => void;
  createRoom: (roomName: string, firstUser: string) => void;
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
    socket.on("roomCreated", (roomName: string) => {
      // socket.join(roomName); Invalid code but I want to do something like this.
      console.log(`Joined room ${roomName}`);
    });
    socket.on("disconnect", disconnect);

    return () => {
      socket.off("connect", connect);
      socket.off("message", message);
      socket.off("disconnect", disconnect);
    };
  }, [socket]);

  function sendMessage(message: string) {
    socket.emit("message", message);
  }

  function createRoom(roomName: string, firstUser: string) {
    socket.emit("createRoom", roomName, firstUser);
    console.log(socket.id);
  }

  return (
    <SocketContext.Provider
      value={{ socket, loggedInUser, setLoggedInUser, sendMessage, createRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
