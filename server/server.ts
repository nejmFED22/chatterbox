import { createAdapter } from "@socket.io/mongo-adapter";
import { Emitter } from "@socket.io/mongo-emitter";
import { MongoClient } from "mongodb";
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from "../communications";
import { Message, Room, SocketData } from "../types";
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
  //"mongodb+srv://jenny:zyqluPwgsy7Scf5H@chatterboxtest.w6o91jx.mongodb.net/"
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
  const historyCollection = mongoClient.db(DB).collection("history");
  const sessionCollection = mongoClient.db(DB).collection("session");
  const sessionEmitter = new Emitter(sessionCollection);

  io.adapter(createAdapter(mongoCollection));

  io.use(async (socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    //console.log("Session ID: " + sessionID);
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
    //console.log("Creating user");
    socket.data.sessionID = uuidv4();
    socket.data.userID = uuidv4();
    socket.data.username = username;
    sessionCollection.insertOne({
      sessionID: socket.data.sessionID,
      userID: socket.data.userID,
      username: socket.data.username,
      isConnected: true,
    });
    next();
  });

  io.on("connection", async (socket) => {
    // Setup for client
    //console.log("A user has connected");

    await sessionCollection.updateOne(
      { sessionID: socket.data.sessionID },
      { $set: { isConnected: true } }
    );

    socket.emit("rooms", getRooms());

    await emitSessions(socket);
    io.emit("users", await getConnectedUsers());

    socket.emit("session", {
      username: socket.data.username as string,
      userID: socket.data.userID as string,
      sessionID: socket.data.sessionID as string,
    });

    socket.on("sessions", (socket) => {
      emitSessions(socket);
    });

    // Joins room
    socket.on("join", async (room) => {
      socket.join(room);
      //socket.emit("joined", room);
      
      const roomHistory = await getRoomHistory(room);
      socket.emit("roomHistory", room, roomHistory);
      
      io.emit("rooms", getRooms());
    });

    // Leaves room
    socket.on("leave", (room) => {
      socket.leave(room);
      io.emit("rooms", getRooms());
    });

    // Receives and sends out messages
    socket.on("message", async (room: string, message: Message) => {

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
      await sessionCollection.updateOne(
        { sessionID: socket.data.sessionID },
        { $set: { isConnected: false } }
      );

      io.emit("rooms", getRooms());
      io.emit("users", await getConnectedUsers());
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

  async function emitSessions(socket: Socket) {
    const sessions = await sessionCollection.find().toArray();
    socket.emit("sessions", sessions);
  }

  async function getConnectedUsers() {
    try {
      const activeSessions = await sessionCollection
        .find({ isConnected: true })
        .toArray();
      const connectedUserList = activeSessions.map((session) => ({
        userID: session.userID,
        username: session.username,
        sessionID: session.sessionID,
      }));

      return connectedUserList;
    } catch (e) {
      console.error("Failed to fetch active sessions:", e);
      return [];
    }
  }

  async function getRoomHistory(room: string) {
    try {
      const historyDocs = await historyCollection.find({ room }).toArray();
      const history: Message[] = historyDocs.map((doc) => ({
        content: doc.content,
        author: doc.author,
      }));

      return history;
    } catch (e) {
      console.error("Failed to fetch room history:", e);
      return [];
    }
  }

  io.listen(3000);
  console.log("listening on port 3000");
};

main();
