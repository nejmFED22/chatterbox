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
  "mongodb+srv://nabl:o8A3Lq7bAFyvlUg1@chatterbox.ugl1wjb.mongodb.net/"
  //"mongodb+srv://jenny:zyqluPwgsy7Scf5H@chatterboxtest.w6o91jx.mongodb.net/"
  // "mongodb+srv://marcus:5bgDikBCj7g88b6p@chatterbox.tzxzwxr.mongodb.net/"
);

const main = async () => {
  await mongoClient.connect();

  try {
    await mongoClient.db(DB).createCollection(COLLECTION, {
      capped: true,
      size: 1e6,
    });
  } catch (e) {
    // console.log("Collection already exists");
  }
  const mongoCollection = mongoClient.db(DB).collection(COLLECTION);
  const historyCollection = mongoClient.db(DB).collection("Room History");
  const DMHistoryCollection = mongoClient.db(DB).collection("DM Room History");
  const sessionCollection = mongoClient.db(DB).collection("Sessions");

  io.adapter(createAdapter(mongoCollection));

  //-----------------SOCKET SESSION SETUP-----------------//
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
      return next(new Error("Not logged in"));
    }
    socket.data.sessionID = uuidv4();
    socket.data.userID = uuidv4();
    socket.data.username = username;
    sessionCollection.insertOne({
      sessionID: socket.data.sessionID,
      userID: socket.data.userID,
      username: socket.data.username,
      isConnected: true,
      lastRoom: undefined,
    });
    socket.emit("setSession", {
      username: socket.data.username as string,
      userID: socket.data.userID as string,
      sessionID: socket.data.sessionID as string,
    });
    const sessionList = await updateSessionList();
    console.log(sessionList);
    io.emit("updateSessionList", sessionList);
    next();
  });

  //-----------------SOCKET CONNECTION-----------------//

  io.on("connection", async (socket) => {
    // Updates session list and room list
    socket.join(socket.data.userID as string);
    console.log("A user has connected");
    socket.emit("rooms", await getRooms());

    await sessionCollection.updateOne(
      { sessionID: socket.data.sessionID },
      { $set: { isConnected: true } }
    );

    await joinLastRoom(socket);

    io.emit("users", await getConnectedUsers());

    //----------------ROOMS----------------//

    // Joins room
    socket.on("join", (room) => {
      joinRoom(room, socket);
    });

    // Joins DM
    socket.on("joinDM", (user) => {
      joinDM(user, socket);
    });

    // Leaves room
    socket.on("leave", async (room) => {
      socket.leave(room);
      io.emit("rooms", await getRooms());
      sessionCollection.updateOne(
        { sessionID: socket.data.sessionID },
        { $set: { lastRoom: undefined } }
      );
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
      async (message: PrivateMessage, user: User) => {
        // Save message to history collection
        try {
          await DMHistoryCollection.insertOne({
            content: message.content,
            author: socket.data.userID,
            recipient: message.recipient,
            authorUsername: socket.data.username,
            recipientUsername: user.username,
          });
        } catch (e) {
          console.error("Failed to save message to history:", e);
        }

        // Fetch the message from the history collection
        const historyDocs = await DMHistoryCollection.find({
          content: message.content,
          author: socket.data.userID,
          recipient: message.recipient,
          authorUsername: socket.data.username,
          recipientUsername: user.username,
        })
          .sort({ _id: -1 })
          .limit(1)
          .toArray();
        const retrievedMessage = historyDocs[0];

        // Sends message to recipient and sender
        socket
          .to(message.recipient)
          .to(socket.data.userID as string)
          .emit("recievePrivateMessage", {
            content: retrievedMessage.content,
            author: retrievedMessage.author,
            recipient: retrievedMessage.recipient,
            authorUsername: retrievedMessage.authorUsername,
            recipientUsername: retrievedMessage.recipientUsername,
          });
      }
    );
    // Disconnecting and leaving all rooms
    socket.on("disconnect", async () => {
      await sessionCollection.updateOne(
        { sessionID: socket.data.sessionID },
        { $set: { isConnected: false } }
      );

      io.emit("rooms", await getRooms());
      io.emit("users", await getConnectedUsers());
    });
  });

  //-----------------SERVER FUNCTIONS-----------------//

  async function joinRoom(room: string, socket: Socket) {
    socket.join(room);
    io.emit("rooms", await getRooms());
    const roomHistory = await getRoomHistory(room);
    socket.emit("roomHistory", room, roomHistory);
    sessionCollection.updateOne(
      { sessionID: socket.data.sessionID },
      { $set: { lastRoom: room } }
    );
    socket.emit("roomJoined", room);
  }

  async function joinDM(user: Session, socket: Socket) {
    const DMHistory = await getDMHistory(user, socket);
    socket.emit("DMHistory", user, DMHistory);
    sessionCollection.updateOne(
      { sessionID: socket.data.sessionID },
      { $set: { lastRoom: user } }
    );
    socket.emit("DMJoined", user);
  }

  async function joinLastRoom(socket: Socket) {
    const session = await sessionCollection.findOne({
      sessionID: socket.data.sessionID,
    });
    console.log(session);
    if (Boolean(session?.lastRoom)) {
      typeof session?.lastRoom === "string"
        ? joinRoom(session.lastRoom, socket)
        : joinDM(session?.lastRoom, socket);
    }
  }

  async function getRooms() {
    const { rooms } = io.sockets.adapter;
    const roomList: Room[] = [];
    const sessionList = await sessionCollection.find({}).toArray();
    const listOfUserIDs = sessionList.map(({ userID }) => userID.toString());

    for (const [name, setOfSocketIds] of rooms) {
      if (!setOfSocketIds.has(name)) {
        if (!listOfUserIDs.includes(name)) {
          roomList.push({
            name: name,
            onlineUsers:
              Array.from(setOfSocketIds).map(
                (socketId) =>
                  io.sockets.sockets.get(socketId)?.data.username as string
              ) || [],
          });
        }
      }
    }
    return roomList;
  }

  // Updates list of sessions
  async function updateSessionList(): Promise<Session[]> {
    const sessions = await sessionCollection.find().toArray();
    console.log(sessions);
    return sessions.map(({ sessionID, userID, username }) => ({
      sessionID,
      userID,
      username,
    }));
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
    const userID = user.userID;
    const historyDocs = await DMHistoryCollection.find({
      $or: [
        {
          $and: [
            { author: userID },
            { recipient: socket.data.userID as string },
          ],
        },
        {
          $and: [
            { author: socket.data.userID as string },
            { recipient: userID },
          ],
        },
      ],
    }).toArray();
    const history: PrivateMessage[] = historyDocs.map((doc) => {
      return {
        content: doc.content,
        author: doc.author,
        recipient: doc.recipient,
        authorUsername: doc.authorUsername,
        recipientUsername: doc.recipientUsername,
      };
    });
    return history;
  }

  // Starts server
  io.listen(3000);
  console.log("listening on port 3000");
};

main();
