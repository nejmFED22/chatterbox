import { FormControl, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useSocket } from "../context/SocketContext";
import TextButton from "./TextButton";

interface Props {
  isMobile: boolean;
}

export default function MessageInput({ isMobile }: Props) {
  const [userTyping, setUserTyping] = useState(false);
  const [message, setMessage] = useState("");
  const { socket } = useSocket();

  function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
    setUserTyping(true);
    setMessage(e.target.value);
    setTimeout(() => setUserTyping(false), 5000);
  }

  function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.emit("message", message, "default-room");
    console.log("Message '" + message + "' has been sent.");
    setMessage("");
  }

  return (
    <Paper sx={styledPaper}>
      <Typography variant="body2" sx={styledType}></Typography>
      <form onSubmit={sendMessage}>
        <FormControl
          sx={{
            ...styledFormControl,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <TextField
            multiline={true}
            onChange={handleTyping}
            variant="standard"
            value={message}
            placeholder="Write your message here"
            sx={styledTextField}
          />
          <TextButton>Send</TextButton>
        </FormControl>
      </form>
    </Paper>
  );
}

const styledType = {
  height: "1.5rem",
};

const styledFormControl = {
  display: "flex",
  gap: "0.5rem",
};

const styledTextField = {
  flex: 1,
};

const styledPaper = {
  padding: "0.5rem",
  marginBottom: "0.5rem",
  border: "1px solid black",
};
