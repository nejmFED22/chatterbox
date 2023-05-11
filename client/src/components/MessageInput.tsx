import {
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";

interface Props {
  isMobile: boolean;
}

export default function MessageInput({ isMobile }: Props) {
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const timerRef = useRef<number | null>(null);

  const { typingStart, typingStop, typingUsers, sendMessage, sendPrivateMessage, loggedInUser, currentRoom, currentUser, isPrivate } =
    useSocket();

  function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
    if (!typing) {
      typingStart();
      setTyping(true);
    }
    setMessage(e.target.value);
    clearTimeout(timerRef.current!);
    timerRef.current = setTimeout(() => {
      typingStop();
      setTyping(false);
    }, 5000);
  }

  function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (message.trim() && loggedInUser) {
      if (isPrivate && currentUser) {
        console.log("Current user: ", currentUser)
        console.log("Current room: ", currentRoom)
        sendPrivateMessage({ content: message, author: loggedInUser, recipient: currentUser.userID as string });
      } else {
        console.log("Current user: ", currentUser)
        console.log("Current room: ", currentRoom)
        sendMessage({ content: message, author: loggedInUser });
      }
      setMessage("");
    }
  }

  const renderTypingUsers = () => {
    return (
      typingUsers.map(
        (user, index) =>
          `${user}${
            typingUsers.length > 1 && index < typingUsers.length - 1 ? "," : ""
          } `
      ) + `${typingUsers.length > 1 ? "are" : "is"} typing...`
    );
  };

  return (
    <Paper sx={styledPaper}>
      <Typography variant="body1" sx={styledType}>
        {typingUsers.length > 0 && renderTypingUsers()}
      </Typography>
      <form onSubmit={handleSendMessage}>
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
          <Button type="submit" variant="contained">
            Send
          </Button>
        </FormControl>
      </form>
    </Paper>
  );
}

const styledPaper = {
  padding: "0.5rem",
  border: "1px solid black",
};

const styledType = {
  height: "1.5rem",
};

const styledFormControl = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "flex-end",
};

const styledTextField = {
  flex: 1,
  width: "100%",
};
