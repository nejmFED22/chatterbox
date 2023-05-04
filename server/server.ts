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
  socket.emit("message", "Message from server");
  socket.on("disconnect", (socket) => {
    console.log("A user has disconnected");
  });
});

io.listen(3000);
console.log("listening on port 3000");
