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
    console.log(socket.rooms)
    io.emit("rooms", getRooms());
  });

  // Leaves room
  socket.on("leave", (room) => {
    socket.leave(room);
    console.log(socket.rooms)
    io.emit("rooms", getRooms());
  });

  socket.emit("rooms", getRooms());

  // Sends message to everyone in same room
  socket.on("message", (room, message) => {
    socket.broadcast.to(room).emit("message", message);
    // io.to(room).emit("message", message);
  });

  // Disconnecting and leaving all rooms
  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });
});

function getRooms() {
  const { rooms } = io.sockets.adapter;
  const roomsFound: string[] = [];

  for (const [name, setOfSocketIds] of rooms) {
    if (!setOfSocketIds.has(name)) {
      roomsFound.push(name);
    }
  }
  console.log(roomsFound);
  return roomsFound;
}

io.listen(3000);
console.log("listening on port 3000");
