import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import { CSSProperties, Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import MessageInput from "../components/MessageInput";
import MessageStack from "../components/MessageStack";
import Sidebar from "../components/sidebar-components/Sidebar";
import { useSocket } from "../context/SocketContext";
import { theme } from "../theme";

export default function ChatPage() {
  const drawerWidth = 340;
  const [windowWidth, setWindowWidth] = useState<string>("100%");
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { currentRoom, socket } = useSocket();

  useEffect(() => {
    socket.connect();
  });

  useEffect(() => {
    setWindowWidth(
      isMobile || !sidebarOpen ? "100%" : `calc(100% - ${drawerWidth}px)`
    );
  }, [isMobile, sidebarOpen]);

  return (
    <Fragment>
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      {currentRoom ? (
        <>
          <Box sx={{ width: windowWidth, ...styledBox }} component={"main"}>
            <MessageStack isMobile={isMobile} />
            <Container component={"div"} sx={styledInputContainer}>
              <MessageInput />
            </Container>
          </Box>
        </>
      ) : (
        <Box sx={{ width: windowWidth, ...styledBox }} component={"main"}>
          <Container component={"div"} sx={styledInputContainer}>
            <Typography variant={"h1"}>
              Welcome back! Join or create a room.
            </Typography>
          </Container>
        </Box>
      )}
      <Sidebar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
    </Fragment>
  );
}

const styledBox: CSSProperties = {
  position: "relative",
  minHeight: "calc(100vh - 103.76px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  paddingTop: "6rem",
};

const styledInputContainer: CSSProperties = {
  position: "sticky",
  bottom: 0,
  paddingBottom: "0.5rem",
};
