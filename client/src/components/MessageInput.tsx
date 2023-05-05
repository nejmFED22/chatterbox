import {
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Props {
  isMobile: boolean;
}

export default function MessageInput({ isMobile }: Props) {
  const [userTyping, setUserTyping] = useState(false);
  const [message, setMessage] = useState("");

  function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
    setUserTyping(true);
    setMessage(e.target.value);
    setTimeout(() => setUserTyping(false), 5000);
  }

  function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Message '" + message + "' has been sent.");
    setMessage("");
  }

  return (
    <Paper sx={styledPaper}>
      <Typography variant="body2" sx={styledType}></Typography>
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
            size="small"
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
  border: "1px solid black",
};
