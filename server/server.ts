import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../communications";

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();

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
});

io.listen(3000);
console.log("listening on port 3000");
