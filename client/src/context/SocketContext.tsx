import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { Message, PrivateMessage, Room, Session, User } from "../../../types";

// Context setup
interface ContextValues {
  socket: Socket;
  loggedInUser: string;
  setLoggedInUser: React.Dispatch<React.SetStateAction<string>>;
  typingUsers: string[];
  typingStart: () => void;
  typingStop: () => void;
  joinRoom: (room: string) => void;
  joinDM: (user: Session) => void;
  leaveAllRooms: () => void;
  messages: Message[];
  privateMessages: PrivateMessage[];
  sendMessage: (message: Message) => void;
  sendPrivateMessage: (message: PrivateMessage) => void;
  currentRoom?: string;
  roomList?: Room[];
  userList: User[];
  sessionList: Session[];
  isPrivate: boolean;
  setIsPrivate: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser?: User;
}

const SocketContext = createContext<ContextValues>(null as any);
export const useSocket = () => useContext(SocketContext);
const socket = io({ autoConnect: false });

function SocketProvider({ children }: PropsWithChildren) {
  //-------------------------------------STATES AND VARIABLES-------------------------------------//

  const [loggedInUser, setLoggedInUser] = useState(
    sessionStorage.getItem("username") || ""
  );
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string>();
  const [currentUser, setCurrentUser] = useState<User>();

  const [roomList, setRoomList] = useState<Room[]>([]);
  const [sessionList, setSessonList] = useState<Session[]>([]);
  const [userList, setUserList] = useState<User[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    const localSession = sessionStorage.getItem("sessionID");
    if (localSession) {
      socket.auth = { sessionID: localSession };
      socket.connect();
    }
  }, []);

  //-----------------------------FUNCTIONS-----------------------------//

  function joinRoom(room: string) {
    setIsPrivate(false);
    if (currentRoom) {
      console.log(`Left room: ${currentRoom}`);
      socket.emit("leave", currentRoom as string);
    }
    socket.emit("join", room);
    console.log(`Joined room: ${room}`);
    setCurrentUser(undefined);
    setCurrentRoom(room);
  }

  function joinDM(user: Session) {
    setIsPrivate(true);
    if (currentRoom) {
      console.log(`Left room: ${currentRoom}`);
      socket.emit("leave", currentRoom as string);
      setCurrentRoom(undefined);
    }
    socket.emit("joinDM", user);
    console.log(`Joined DM with ${user.username}`);
    setCurrentUser(user);
  }

  function leaveAllRooms() {
    socket.emit("leave", currentRoom as string);
    setCurrentRoom(undefined);
    setCurrentUser(undefined);
  }

  function typingStart() {
    socket.emit("typingStart", currentRoom, loggedInUser);
  }

  function typingStop() {
    socket.emit("typingStop", currentRoom, loggedInUser);
  }

  const sendMessage = (message: Message) => {
    if (!currentRoom) throw Error("Can't send message without a room");
    socket.emit("message", currentRoom, message);
  };

  const sendPrivateMessage = (message: PrivateMessage) => {
    setPrivateMessages((privateMessages) => [...privateMessages, message]);
    socket.emit("sendPrivateMessage", message, currentUser);
  };

  //-----------CONNECTION AND SESSION MANAGEMENT----------//

  useEffect(() => {
    function connect() {
      socket.emit("sessions");
      console.log("Connected to server");
    }

    function handleSessions(sessions: Session[]) {
      setSessonList(sessions);
    }

    function setUserSession({ sessionID }: { sessionID: string }) {
      socket.auth = { sessionID };
      sessionStorage.setItem("sessionID", sessionID);
    }

    function disconnect() {
      console.log("Disconnected from server");
    }

    //------------------USER------------------//

    function getUsers(users: User[]) {
      setUserList(users.map((user) => ({ ...user, isConnected: true })));
    }

    //------------------ROOM------------------//

    function rooms(rooms: Room[]) {
      setRoomList(rooms);
    }

    function handleRoomHistory(room: string, history: Message[]) {
      if (room === currentRoom) {
        setMessages(history);
      }
    }
    function handleDMHistory(user: User, history: PrivateMessage[]) {
      // if (user === currentUser) {
      setPrivateMessages(history);
      // }
    }

    //------------------MESSAGE------------------//

    function message(room: string, message: Message) {
      if (room === currentRoom) {
        setMessages((messages) => [...messages, message]);
      }
    }

    function recievePrivateMessage(message: PrivateMessage) {
      if (currentUser) {
        if (currentUser.userID === message.author) {
          setPrivateMessages((privateMessages) => [
            ...privateMessages,
            message,
          ]);
        }
      }
    }

    function typingStart(user: string) {
      setTypingUsers((users) => [...users, user]);
    }

    function typingStop(user: string) {
      setTypingUsers((users) => users.filter((u) => u !== user));
    }

    //-------------EVENT LISTENERS------------//

    socket.on("connect", connect);
    socket.on("setSession", setUserSession);
    socket.on("updateSessionList", handleSessions);
    socket.on("disconnect", disconnect);
    socket.on("message", message);
    socket.on("recievePrivateMessage", recievePrivateMessage);
    socket.on("typingStart", typingStart);
    socket.on("typingStop", typingStop);
    socket.on("rooms", rooms);
    socket.on("users", getUsers);
    socket.on("roomHistory", handleRoomHistory);
    socket.on("DMHistory", handleDMHistory);

    return () => {
      socket.off("connect", connect);
      socket.off("setSession", setUserSession);
      socket.off("updateSessionList", handleSessions);
      socket.off("disconnect", disconnect);
      socket.off("message", message);
      socket.off("recievePrivateMessage", recievePrivateMessage);
      socket.off("typingStart", typingStart);
      socket.off("typingStop", typingStop);
      socket.off("rooms", rooms);
      socket.off("users", getUsers);
      socket.off("roomHistory", handleRoomHistory);
      socket.off("DMHistory", handleDMHistory);
    };
  }, [currentRoom, currentUser]);

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
        joinDM,
        messages,
        privateMessages,
        currentRoom,
        roomList,
        userList,
        sendMessage,
        sendPrivateMessage,
        sessionList,
        isPrivate,
        setIsPrivate,
        currentUser,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
