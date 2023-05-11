import { createAdapter } from "@socket.io/mongo-adapter";
import { MongoClient } from "mongodb";
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from "../communications";
import {
  Message,
  PrivateMessage,
  Room,
  Session,
  SocketData,
  User,
} from "../types";
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();

//-------------------------MONGODB SETUP-------------------------//

const DB = "chatterbox";
const COLLECTION = "socket.io-adapter-events";

const mongoClient = new MongoClient(
  // "mongodb+srv://nabl:o8A3Lq7bAFyvlUg1@chatterbox.ugl1wjb.mongodb.net/"
  //"mongodb+srv://jenny:zyqluPwgsy7Scf5H@chatterboxtest.w6o91jx.mongodb.net/"
  "mongodb+srv://marcus:5bgDikBCj7g88b6p@chatterbox.tzxzwxr.mongodb.net/"
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
  const historyCollection = mongoClient.db(DB).collection("Room History");
  const DMHistoryCollection = mongoClient.db(DB).collection("DM Room History");
  const sessionCollection = mongoClient.db(DB).collection("Sessions");
  // const sessionEmitter = new Emitter(sessionCollection);

  io.adapter(createAdapter(mongoCollection));

  //-----------------SOCKET SESSION SETUP-----------------//

  io.use(async (socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    console.log("Session ID: " + sessionID);
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
      return next(new Error("Not logged in"));
    }
    console.log("Creating user");
    socket.data.sessionID = uuidv4();
    socket.data.userID = uuidv4();
    socket.data.username = username;
    sessionCollection.insertOne({
      sessionID: socket.data.sessionID,
      userID: socket.data.userID,
      username: socket.data.username,
    });
    socket.emit("setSession", {
      username: socket.data.username as string,
      userID: socket.data.userID as string,
      sessionID: socket.data.sessionID as string,
    });
    const sessionList = await updateSessionList();
    io.emit("updateSessionList", sessionList);
    next();
  });

  io.on("connection", async (socket) => {
    //-----------------SOCKET CONNECTION-----------------//

    // Updates session list and room list
    socket.join(socket.data.userID as string);
    console.log("A user has connected");
    socket.emit("rooms", getRooms(socket));
    const sessionList = await updateSessionList();
    io.emit("updateSessionList", sessionList);
    io.emit("users", getUsers());

    // Disconnecting and leaving all rooms
    socket.on("disconnect", () => {
      io.emit("rooms", getRooms(socket));
      io.emit("users", getUsers());
    });

    //----------------ROOMS----------------//

    // Joins room
    socket.on("join", async (room) => {
      socket.join(room);
      io.emit("rooms", getRooms(socket));
      const roomHistory = await getRoomHistory(room);
      socket.emit("roomHistory", room, roomHistory);
    });

    // Joins DM
    socket.on("joinDM", async (user) => {
      const DMHistory = await getDMHistory(user, socket);
      socket.emit("DMHistory", user, DMHistory);
    });

    // Leaves room
    socket.on("leave", (room) => {
      socket.leave(room);
      io.emit("rooms", getRooms(socket));
    });

    // Fetch room history from database
    socket.on("getRoomHistory", async (room: string) => {
      const history = await getRoomHistory(room);
      socket.emit("roomHistory", room, history);
    });

    // Fetch DM room history from database
    socket.on("getDMHistory", async (user: User) => {
      const history = await getDMHistory(user, socket);
      socket.emit("DMHistory", user, history);
    });

    //-----------------MESSAGES-----------------//

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

    // Communicate to client that user started typing
    socket.on("typingStart", (room, user) => {
      socket.broadcast.to(room).emit("typingStart", user);
    });

    // Communicate to client that user stopped typing
    socket.on("typingStop", (room, user) => {
      socket.broadcast.to(room).emit("typingStop", user);
    });

    //-----------------PRIVATE MESSAGES-----------------//

    // Receives and sends out messages
    socket.on(
      "sendPrivateMessage",
      async (message: PrivateMessage) => {

        // Save message to history collection
        try {
          await DMHistoryCollection.insertOne({
            content: message.content,
            author: socket.data.userID,
            recipient: message.recipient,
          });
        } catch (e) {
          console.error("Failed to save message to history:", e);
        }

        // Fetch the message from the history collection
        const historyDocs = await DMHistoryCollection.find({
          content: message.content,
          author: socket.data.userID,
          recipient: message.recipient,
        })
          .sort({ _id: -1 })
          .limit(1)
          .toArray();
        const retrievedMessage = historyDocs[0];

        // Sends message to recipient and sender
        console.log("Recipient: " + message.recipient);
        console.log("Sender: " + socket.data.userID);
        console.log("Message: " + retrievedMessage.content);
        console.log(socket.rooms)
        socket.to(message.recipient).to(socket.data.userID as string)
          .emit("recievePrivateMessage", {
            content: retrievedMessage.content,
            author: retrievedMessage.author,
            recipient: retrievedMessage.recipient,
          });
      }
    );
  });

  //-----------------SERVER FUNCTIONS-----------------//

  // Updates list of rooms
  function getRooms(socket: Socket) {
    const { rooms } = io.sockets.adapter;
    const roomList: Room[] = [];

    for (const [name, setOfSocketIds] of rooms) {
      if (!setOfSocketIds.has(name)) {
        console.log(name)
        if (name !== socket.data.userID) {
          roomList.push({
            name: name,
            onlineUsers: setOfSocketIds.size,
          });
        }
      }
    }
    return roomList;
  }

  // Updates list of sessions
  async function updateSessionList(): Promise<Session[]> {
    const sessions = await sessionCollection.find().toArray();
    return sessions.map(({ sessionID, userID, username }) => ({
      sessionID,
      userID,
      username,
    }));
  }

  // Updates list of users
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

  // Fetches room history from database
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

  // Fetches DM history from database
  async function getDMHistory(user: User, socket: Socket) {
    const userID = user.userID
    const historyDocs = await DMHistoryCollection.find({
      $or: [
        { $and: [{ author: userID }, { recipient: socket.data.userID as string }] },
        { $and: [{ author: socket.data.userID as string }, { recipient: userID }] }
      ]
  }).toArray();
    console.log(historyDocs)
    const history: PrivateMessage[] = historyDocs.map((doc) => {
      return {
        content: doc.content,
        author: doc.author,
        recipient: doc.recipient,
      };
    });
    return history;
  }

  // Starts server
  io.listen(3000);
  console.log("listening on port 3000");
};

main();
