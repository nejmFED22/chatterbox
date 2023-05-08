import { Box, Container, useMediaQuery } from "@mui/material";
import { CSSProperties, Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import MessageInput from "../components/MessageInput";
import MessageStack from "../components/MessageStack";
import Sidebar from "../components/sidebar-components/Sidebar";
import { theme } from "../theme";

export default function ChatPage() {
  const drawerWidth = 340;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<string>("100%");
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setWindowWidth(isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`);
  }, [isMobile]);

  return (
    <Fragment>
      {activeRoom ? (
        <>
          <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} setActiveRoom={setActiveRoom} />
          <Box sx={{ width: windowWidth, ...styledBox }} component={"main"}>
            <MessageStack isMobile={isMobile} />
            <Container component={"div"} sx={styledInputContainer}>
              <MessageInput isMobile={isMobile} />
            </Container>
          </Box>
        </>
      ) : (
        <div>No Active Room</div>
      )}
      <Sidebar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} setActiveRoom={setActiveRoom}/>
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
