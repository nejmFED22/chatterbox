import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { Message, Room } from "../../../types";

// Context setup
interface ContextValues {
  socket: Socket;
  loggedInUser: string | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<string | null>>;
  joinRoom: (room: string) => void;
  messages: Message[];
  sendMessage: (message: Message) => void;
  currentRoom?: string;
  roomList?: Room[];
  //sendMessage: (message: string) => void;
}

const socket = io();

const SocketContext = createContext<ContextValues>(null as any);
export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: PropsWithChildren) {
  // States and variables
  // const [socket] =
  //   useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io);

  // TODO: Create a localStorage-hook
  // TODO: Change from localStorage to sessionStorage

  //-------------------------------------STATES AND VARIABLES-------------------------------------//

  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("username")
  );
  const [currentRoom, setCurrentRoom] = useState<string>();
  const [roomList, setRoomList] = useState<Room[]>();
  const [messages, setMessages] = useState<Message[]>([]);

   //-------------------------------------FUNCTIONS-------------------------------------//

  function joinRoom(room: string) {
    if (currentRoom) {
      console.log(`Left room: ${currentRoom}`);
      socket.emit("leave", currentRoom as string);
    }
    socket.emit("join", room);
    console.log(`Joined room: ${room}`);
    setCurrentRoom(room);
  }

  const sendMessage = (message: Message) => {
    if (!currentRoom) throw Error("Can't send message without a room");
    console.log('Sending message:', currentRoom, message);
    socket.emit("message", currentRoom, message);
  };

  // Listening from server
  useEffect(() => {

    //------------------CONNECTION------------------//

    function connect() {
      console.log("Connected to server");
    }
    function disconnect() {
      console.log("Disconnected from server");
    }

    //------------------ROOM------------------//

    function roomConfirmation(roomName: string) {
      console.log("Joined room " + roomName);
    }

    function rooms(rooms: Room[]) {
      setRoomList(rooms);
    }

    //------------------MESSAGE------------------//

    function message(message: Message) {
      setMessages((messages) => [...messages, message])
    }
    

    socket.on("connect", connect);
    socket.on("disconnect", disconnect);
    socket.on("rooms", rooms);
    socket.on("message", message);

    return () => {
      socket.off("connect", connect);
      socket.off("disconnect", disconnect);
      socket.off("rooms", rooms);
      socket.off("message", message);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        loggedInUser,
        setLoggedInUser,
        joinRoom,
        messages,
        currentRoom,
        roomList,
        sendMessage
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
