import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Message } from "../../../types";
import { useSocket } from "../context/SocketContext";

  export default function ChatWindow() {
    const { socket, loggedInUser } = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
  
    const sendMessage = () => {
      if (message.trim() !== "") {
        socket.emit("message", { content: message, author: loggedInUser });
        setMessage("");
      }
    };
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(event.target.value);
    };
  
    socket.on("message", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  
    return (
      <Box>
        <Typography variant="h2">Chat</Typography>
        <Box>
          {messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.author}:</strong> {msg.content}
            </p>
          ))}
        </Box>
        <Box>
          <TextField
            value={message}
            onChange={handleInputChange}
            fullWidth
          />
          <Button onClick={sendMessage}>Send</Button>
        </Box>
      </Box>
    );
  }