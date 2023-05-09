import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData
} from "../communications";
import { Message, Room, User } from "../types";

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();

io.use((socket, next) => {
  // const sessionID = socket.handshake.auth.sessionID;
  // if (sessionID) {
  //   const session = findSession(sessionID);
  //   if (session) {
  //     socket.data.sessionID = sessionID;
  //     socket.data.userID = session.userID;
  //     socket.data.username = session.username;
  //     return next();
  //   }
  // }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.data.sessionID = uuidv4();
  socket.data.userID = uuidv4();
  socket.data.username = username;
  next();
});

io.on("connection", (socket) => {
  // Setup for client
  console.log("A user has connected");
  socket.emit("rooms", getRooms());
  io.emit("users", getUsers());

  socket.emit("session", {
    username: socket.data.username as string,
    sessionID: socket.data.sessionID as string,
    userID: socket.data.userID as string,
  });

  // Joins room
  socket.on("join", (room) => {
    socket.join(room);
    io.emit("rooms", getRooms());
  });

  // Leaves room
  socket.on("leave", (room) => {
    socket.leave(room);
    io.emit("rooms", getRooms());
  });

  // Receives and sends out messages
  socket.on("message", (room: string, message: Message) => {
    console.log(
      `Message received: ${message.content} from ${message.author} in room ${room}`
    );
    io.to(room).emit("message", room, {
      content: message.content,
      author: message.author,
    });
  });

  // Communicate to client that user started typing
  socket.on("typingStart", (room, user) => {
    socket.broadcast.to(room).emit("typingStart", user);
  });

  // Communicate to client that user stopped typing
  socket.on("typingStop", (room, user) => {
    socket.broadcast.to(room).emit("typingStop", user);
  });

  // Disconnecting and leaving all rooms
  socket.on("disconnect", () => {
    io.emit("rooms", getRooms());
    io.emit("users", getUsers());
  });
});

// Updates list of rooms
function getRooms() {
  const { rooms } = io.sockets.adapter;
  const roomList: Room[] = [];

  for (const [name, setOfSocketIds] of rooms) {
    if (!setOfSocketIds.has(name)) {
      roomList.push({
        name: name,
        onlineUsers: setOfSocketIds.size,
      });
    }
  }
  return roomList;
}

function getUsers() {
  const userList:User[] = [];
  console.log(userList);
  for (let [id, socket] of io.of("/").sockets) {
    userList.push({
      userID: id,
      username: socket.data.username as string,
      sessionID: socket.data.sessionID as string,
    });
  }
  return userList;
}

io.listen(3000);
console.log("listening on port 3000");
