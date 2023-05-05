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
  Room,
} from "../../../communications";

// Context setup
interface ContextValues {
  socket: Socket;
  loggedInUser: string | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<string | null>>;
  joinRoom: (room: string) => void;
  currentRoom?: string;
  roomList?: Room[];
  sendMessage: (message: string) => void;
}

const SocketContext = createContext<ContextValues>(null as any);
export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: PropsWithChildren) {
  // States and variables
  const [socket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io);

  // TODO: Create a localStorage-hook
  // TODO: Change from localStorage to sessionStorage
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("username")
  );
  const [currentRoom, setCurrentRoom] = useState<string>();
  const [roomList, setRoomList] = useState<Room[]>();

  // Trigger event listeners on server
  function joinRoom(room: string) {
    if (currentRoom) {
      console.log(`Left room: ${currentRoom}`);
      socket.emit("leave", currentRoom as string);
    }
    socket.emit("join", room);
    console.log(`Joined room: ${room}`);
    setCurrentRoom(room);
  }

  const sendMessage = (message: string) => {
    if (!currentRoom) throw Error("Can't send message without a room");
    socket.emit("message", currentRoom, message);
  };

  // Listening from server
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
    function rooms(rooms: Room[]) {
      setRoomList(rooms);
    }

    socket.on("connect", connect);
    socket.on("disconnect", disconnect);
    socket.on("message", message);
    socket.on("rooms", rooms);

    return () => {
      socket.off("connect", connect);
      socket.off("disconnect", disconnect);
      socket.off("message", message);
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
        roomList,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
