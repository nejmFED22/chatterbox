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
  room?: string;
  sendMessageToServer: (message: string) => void;
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
  const [room, setRoom] = useState<string>();

  function joinRoom(room: string) {
    socket.emit("join", room);
    setRoom(room);
  }

  const sendMessageToServer = (message: string) => {
    if (!room) throw Error("Can't send message without a room");
    socket.emit("message", room, message);
  };

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
    function rooms(rooms: string[]) {
      console.log(rooms);
    }

    socket.on("connect", connect);
    socket.on("message", message);
    socket.on("disconnect", disconnect);
    socket.on("rooms", rooms);

    return () => {
      socket.off("connect", connect);
      socket.off("message", message);
      socket.off("disconnect", disconnect);
      socket.off("rooms", rooms);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        loggedInUser,
        setLoggedInUser,
        joinRoom,
        room,
        sendMessageToServer,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
