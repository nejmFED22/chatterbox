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
  loggedInUser: string;
  setLoggedInUser: React.Dispatch<React.SetStateAction<string>>;
  typingUsers: string[];
  typingStart: () => void;
  typingStop: () => void;
  joinRoom: (room: string) => void;
}

const SocketContext = createContext<ContextValues>(null as any);
export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: PropsWithChildren) {
  const [socket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io);
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("username") || ""
  );
  const [room, setRoom] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  function joinRoom(room: string) {
    socket.emit("join", room);
    setRoom(room);
  }

  function typingStart() {
    socket.emit("typingStart", room, loggedInUser);
  }

  function typingStop() {
    socket.emit("typingStop", room, loggedInUser);
  }

  useEffect(() => {
    function connect() {
      console.log("Connected to server");
    }
    function disconnect() {
      console.log("Disconnected from server");
    }

    function roomConfirmation(roomName: string) {
      console.log("Joined room " + roomName);
    }

    function message(message: string) {
      console.log(message);
    }

    function typingStart(user: string) {
      setTypingUsers((users) => [...users, user]);
    }

    function typingStop(user: string) {
      setTypingUsers((users) => users.filter((u) => u !== user));
    }

    socket.on("connect", connect);
    socket.on("message", message);
    socket.on("roomCreated", roomConfirmation);
    socket.on("typingStart", typingStart);
    socket.on("typingStop", typingStop);
    socket.on("disconnect", disconnect);

    return () => {
      socket.off("connect", connect);
      socket.off("message", message);
      socket.off("disconnect", disconnect);
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        loggedInUser,
        setLoggedInUser,
        typingUsers,
        typingStart,
        typingStop,
        joinRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
