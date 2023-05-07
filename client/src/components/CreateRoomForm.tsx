import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { theme } from "../theme";

interface CreateRoomFormProps {
  onClose: () => void;
}

export default function CreateRoomForm({ onClose }: CreateRoomFormProps) {
  const [roomName, setRoomName] = useState("");
  const { joinRoom } = useSocket();

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Created room: ${roomName}`)
    joinRoom(roomName);
    // TODO: switch to room on client side
    setRoomName("");
    onClose();
  };

  return (
    <Box sx={styledForm}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" sx={styledTitle}>
          Name your room
        </Typography>
        <TextField
          label="Room name"
          value={roomName}
          variant="standard"
          onChange={handleRoomNameChange}
          required
          sx={styledTextField}
        />
        <Typography variant="body2" sx={styledWarning}>
          WARNING
          <br /> Empty rooms are removed from the list. If you are the only
          member, the room will be removed when you leave.
        </Typography>
        <Button type="submit" sx={styledButton}>
          Create!
        </Button>
        <IconButton sx={styledCloseButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </form>
    </Box>
  );
}

const styledForm = {
  background: theme.palette.primary.main,
  padding: "1rem",
  position: "absolute",
  bottom: "0",
};

const styledTitle = {
  fontWeight: 400,
};

const styledTextField = {
  marginBottom: "1rem",
  width: "100%",
  // label only for accessibility and not visible
  "& .MuiInputLabel-root": {
    fontSize: "0.01px",
    color: theme.palette.primary.main,
  },
};

const styledWarning = {
  marginBottom: "5rem",
  fontSize: "0.9rem",
};

const styledButton = {
  color: theme.palette.primary.dark,
  border: "1px solid",
  background: "none",
  borderColor: theme.palette.primary.dark,
  position: "absolute",
  bottom: "1rem",
  right: "1rem",
  padding: "0.5rem 1.2rem",
};

const styledCloseButton = {
  position: "absolute",
  top: "1rem",
  right: "1rem",
  width: "1rem",
  padding: "1rem",
  height: "1rem",
  minWidth: "none",
  color: theme.palette.primary.dark,
};
