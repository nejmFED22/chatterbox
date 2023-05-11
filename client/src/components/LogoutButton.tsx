import { Button, Typography } from "@mui/material";
import { useSocket } from "../context/SocketContext";
import { theme } from "../theme";

export default function LogoutButton() {
  const { socket } = useSocket();

  function handleClearSessionStorage() {
    const deletedSession = sessionStorage.getItem("sessionID");
    sessionStorage.clear();
    socket.emit("logout", deletedSession);
    location.reload();
  }

  return (
    <>
      <Button sx={styledAddButton} onClick={handleClearSessionStorage}>
        <Typography variant={"body2"}>Logout</Typography>
      </Button>
    </>
  );
}

const styledAddButton = {
  padding: "1.6rem",
  paddingBottom: "2.6rem",
  background: theme.palette.primary.light,
  fontWeight: 600,
  color: "black",
  justifySelf: "center",
  width: "4.8rem",
  height: "2.2rem",
  position: "fixed",
  bottom: "0",
  right: "14.5rem",
  "&:hover": {
    textDecoration: "underline",
  },
};
