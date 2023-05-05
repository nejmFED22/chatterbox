import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../communications";
import { Room } from "../types";

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();

const rooms: Room[] = [];

io.on("connection", (socket) => {
  console.log("A user has connected");

  // Joins room
  socket.on("join", (room) => {
    socket.join(room);
  });

  // Sends message to everyone in same room
  socket.on("message", (message, room) => {
    socket.broadcast.to(room).emit("message", message);
    // io.to(room).emit("message", message);
  });

  // Disconnecting and leaving all rooms
  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });
  socket.on("createRoom", (roomName, firstUser) => {
    socket.join(roomName);
    const newRoom: Room = {
      roomName,
      users: [firstUser],
      messages: [],
    };
    rooms.push(newRoom);
    console.log(rooms);
    socket.emit("roomCreated", newRoom.roomName);
    console.log(socket.id, "created room", roomName);
  });
});

io.listen(3000);
console.log("listening on port 3000");
