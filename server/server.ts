import { createAdapter } from "@socket.io/mongo-adapter";
import { MongoClient } from "mongodb";
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from "../communications";
import { Message, Room, SocketData, User } from "../types";
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();

const DB = "chatterbox";
const COLLECTION = "socket.io-adapter-events";

const mongoClient = new MongoClient(
  "mongodb+srv://nabl:o8A3Lq7bAFyvlUg1@chatterbox.ugl1wjb.mongodb.net/"
);

const main = async () => {
  await mongoClient.connect();

  try {
    await mongoClient.db(DB).createCollection(COLLECTION, {
      capped: true,
      size: 1e6,
    });
  } catch (e) {
    // collection already exists
  }
  const mongoCollection = mongoClient.db(DB).collection(COLLECTION);
  const roomsCollection = mongoClient.db(DB).collection("rooms");
  const historyCollection = mongoClient.db(DB).collection("history");
  const sessionCollection = mongoClient.db(DB).collection("session");

  io.adapter(createAdapter(mongoCollection));
  const mainAdapter = io.of("/").adapter;

  io.use(async (socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      const session = await sessionCollection.findOne({ sessionID });
      if (session) {
        socket.data.sessionID = session.sessionID;
        socket.data.userID = session.userID;
        socket.data.username = session.username;
        return next();
      }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.data.sessionID = uuidv4();
    socket.data.userID = uuidv4();
    socket.data.username = username;
    sessionCollection.insertOne({
      sessionID: socket.data.sessionID,
      userID: socket.data.userID,
      username: socket.data.username,
    });
    next();
  });

  io.on("connection", async (socket) => {
    // Setup for client
    console.log("A user has connected");
    emitRooms(socket);
    io.emit("users", getUsers());

    socket.emit("session", {
      username: socket.data.username as string,
      userID: socket.data.userID as string,
      sessionID: socket.data.sessionID as string,
    });

    // socket.on("sessions", (socket) => {
    //   emitSessions(socket);
    // });

    // Joins room
    socket.on("join", async (room) => {
      socket.join(room);
      console.log("Post room join: ", io.sockets.adapter.rooms);
      emitRooms(io);
      const roomHistory = await getRoomHistory(room);
      socket.emit("roomHistory", room, roomHistory);
    });

    // Leaves room
    socket.on("leave", (room) => {
      socket.leave(room);
      emitRooms(io);
    });

    // Receives and sends out messages
    socket.on("message", async (room: string, message: Message) => {
      console.log(
        `Message received: ${message.content} from ${message.author} in room ${room}`
      );

      // Save message to history collection
      try {
        await historyCollection.insertOne({
          room: room,
          content: message.content,
          author: message.author,
        });
      } catch (e) {
        console.error("Failed to save message to history:", e);
      }

      // Fetch the message from the history collection
      const historyDocs = await historyCollection
        .find({ room, content: message.content, author: message.author })
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
      const retrievedMessage = historyDocs[0];

      io.to(room).emit("message", room, {
        content: retrievedMessage.content,
        author: retrievedMessage.author,
      });
    });

    // Fetch room history from database
    socket.on("getRoomHistory", async (room: string) => {
      const history = await getRoomHistory(room);
      socket.emit("roomHistory", room, history);
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
    socket.on("disconnect", async () => {
      emitRooms(io);
      io.emit("users", getUsers());
    });
  });

  // Updates list of rooms
  async function emitRooms(source: Socket | Server = io) {
    const { rooms } = io.sockets.adapter;
    // const rooms = await mongoCollection.find().toArray();
    console.log("Room check: ", rooms);
    const roomList: Room[] = [];

    // Room names not always being saved??
    // for (const [name, setOfSocketIds] of rooms) {
    //   roomList.push({
    //     name: name,
    //     onlineUsers: setOfSocketIds.size,
    //   });
    // }

    // Marcus' original code
    for (const [name, setOfSocketIds] of rooms) {
      if (!setOfSocketIds.has(name)) {
        roomList.push({
          name: name,
          onlineUsers: setOfSocketIds.size,
        });
      }
    }

    console.log("Room list: ", roomList);
    source.emit("rooms", roomList);
  }

  // async function emitSessions(socket: Socket) {
  //   const sessions = await sessionCollection.find().toArray();
  //   socket.emit("sessions", sessions);
  // }

  function getUsers() {
    const userList: User[] = [];
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

  async function getRoomHistory(room: string) {
    const historyDocs = await historyCollection.find({ room }).toArray();
    const history: Message[] = historyDocs.map((doc) => {
      return {
        content: doc.content,
        author: doc.author,
      };
    });
    return history;
  }

  io.listen(3000);
  console.log("listening on port 3000");
};

main();
