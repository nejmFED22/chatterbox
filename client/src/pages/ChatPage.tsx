import { Box, Container, useMediaQuery } from "@mui/material";
import { CSSProperties, Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import MessageInput from "../components/MessageInput";
import MessageStack from "../components/MessageStack";
import Sidebar from "../components/Sidebar";
import { useSocket } from "../context/SocketContext";
import { theme } from "../theme";

export default function ChatPage() {
  const drawerWidth = 340;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<string>("100%");
  const { joinRoom } = useSocket();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  joinRoom("default-room");

  useEffect(() => {
    setWindowWidth(isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`);
  }, [isMobile]);

  return (
    <Fragment>
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Box sx={{ width: windowWidth, ...styledBox }} component={"main"}>
        <MessageStack isMobile={isMobile} />
        <Container component={"div"} sx={styledInputContainer}>
          <MessageInput isMobile={isMobile} />
        </Container>
      </Box>
      <Sidebar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
    </Fragment>
  );
}

const styledBox: CSSProperties = {
  position: "relative",
};

const styledInputContainer: CSSProperties = {
  position: "sticky",
  bottom: 0,
  paddingBottom: "0.5rem",
};
