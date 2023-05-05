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
  currentRoom?: string;
  roomList?: string[];
  sendMessageToServer: (message: string) => void;
}

const SocketContext = createContext<ContextValues>(null as any);
export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: PropsWithChildren) {
  const [socket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io);
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("username")
  );
  const [currentRoom, setCurrentRoom] = useState<string>();
  const [roomList, setRoomList] = useState<string[]>();

  function joinRoom(room: string) {
    socket.emit("leave", currentRoom as string)
    socket.emit("join", room);
    setCurrentRoom(room);
  }

  const sendMessageToServer = (message: string) => {
    if (!currentRoom) throw Error("Can't send message without a room");
    socket.emit("message", currentRoom, message);
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
      setRoomList(rooms)
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
        currentRoom,
        sendMessageToServer,
        roomList
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
