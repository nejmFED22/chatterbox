import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from "../communications";
import { Room } from "../types"

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  Room
>();

const rooms: Room[] = [];

io.on("connection", (socket) => {
  // Setup for client
  console.log("A user has connected");
  socket.emit("rooms", getRooms());

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

  // Sends message to everyone in same room
  socket.on("message", (room, message) => {
    socket.broadcast.to(room).emit("message", message);
    // io.to(room).emit("message", message);
  });

  // Disconnecting and leaving all rooms
  socket.on("disconnect", () => {
    io.emit("rooms", getRooms());
    console.log("A user has disconnected");
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

io.listen(3000);
console.log("listening on port 3000");
