import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { Message, Room, User } from "../../../types";

// Context setup
interface ContextValues {
  socket: Socket;
  loggedInUser: string;
  setLoggedInUser: React.Dispatch<React.SetStateAction<string>>;
  typingUsers: string[];
  typingStart: () => void;
  typingStop: () => void;
  joinRoom: (room: string) => void;
  leaveAllRooms: () => void;
  messages: Message[];
  sendMessage: (message: Message) => void;
  currentRoom?: string;
  roomList?: Room[];
  userList: User[];
  //sendMessage: (message: string) => void;
}

const SocketContext = createContext<ContextValues>(null as any);
export const useSocket = () => useContext(SocketContext);
const socket = io({ autoConnect: false });

function SocketProvider({ children }: PropsWithChildren) {
  // States and variables

  // TODO: Create a sessionStorage-hook

  //-------------------------------------STATES AND VARIABLES-------------------------------------//

  const [loggedInUser, setLoggedInUser] = useState(
    sessionStorage.getItem("username") || ""
  );
  const [currentRoom, setCurrentRoom] = useState<string>();
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  //-------------------------------------FUNCTIONS-------------------------------------//

  function joinRoom(room: string) {
    console.log("Joining room: " + room);
    if (currentRoom) {
      console.log(`Left room: ${currentRoom}`);
      socket.emit("leave", currentRoom as string);
    }
    socket.emit("join", room);
    console.log(`Joined room: ${room}`);
    setCurrentRoom(room);
  }

  function leaveAllRooms() {
    socket.emit("leave", currentRoom as string);
    setCurrentRoom(undefined);
  }

  function typingStart() {
    socket.emit("typingStart", currentRoom, loggedInUser);
  }

  function typingStop() {
    socket.emit("typingStop", currentRoom, loggedInUser);
  }

  const sendMessage = (message: Message) => {
    if (!currentRoom) throw Error("Can't send message without a room");
    console.log("Sending message:", currentRoom, message);
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

    //------------------USERS------------------//

    function getUsers(users: User[]) {
      setUserList(users);
    }

    //------------------ROOM------------------//

    function rooms(rooms: Room[]) {
      setRoomList(rooms);
    }

    //------------------MESSAGE------------------//

    function message(room: string, message: Message) {
      console.log(room, currentRoom);
      if (room === currentRoom) {
        console.log("If statement passed");
        setMessages((messages) => [...messages, message]);
      }
    }

    function typingStart(user: string) {
      setTypingUsers((users) => [...users, user]);
    }

    function typingStop(user: string) {
      setTypingUsers((users) => users.filter((u) => u !== user));
    }

    socket.on("connect", connect);
    socket.on("disconnect", disconnect);
    socket.on("message", message);
    socket.on("typingStart", typingStart);
    socket.on("typingStop", typingStop);
    socket.on("rooms", rooms);
    socket.on("users", getUsers)

    return () => {
      socket.off("connect", connect);
      socket.off("disconnect", disconnect);
      socket.off("message", message);
      socket.off("typingStart", typingStart);
      socket.off("typingStop", typingStop);
      socket.off("rooms", rooms);
      socket.off("users", getUsers)
    };
  }, [currentRoom]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        loggedInUser,
        setLoggedInUser,
        leaveAllRooms,
        typingUsers,
        typingStart,
        typingStop,
        joinRoom,
        messages,
        currentRoom,
        roomList,
        userList,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
