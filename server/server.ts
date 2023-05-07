import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from "../communications";
import { Message, Room } from "../types";

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
  // socket.on("message", (message, room) => {
  //   socket.broadcast.to(room).emit("message", message.content);
  //   // io.to(room).emit("message", message);
  // });

  socket.on("message", (room: string, message: Message) => {
    //console.log('Received message:', room, message);
    console.log(`Message received: ${message.content} from ${message.author} in room ${room}`);
    io.emit("message", { content: message.content, author: message.author });
  });

  // Disconnecting and leaving all rooms
  socket.on("disconnect", () => {
    io.emit("rooms", getRooms());
    console.log("A user has disconnected");
  });

  // socket.on("createRoom", (roomName, firstUser) => {
  //   socket.join(roomName);
  //   const newRoom: Room = {
  //     roomName,
  //     users: [firstUser],
  //     messages: [],
  //   };
  //   rooms.push(newRoom);
  //   console.log(rooms);
  //   socket.emit("roomCreated", newRoom.roomName);
  //   console.log(socket.id, "created room", roomName);
  // });
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

