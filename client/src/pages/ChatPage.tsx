import { Box, Container, useMediaQuery } from "@mui/material";
import { CSSProperties, Fragment, useEffect, useRef, useState } from "react";
import MessageInput from "../components/MessageInput";
import MessageStack from "../components/MessageStack";
import Sidebar from "../components/Sidebar";
import Header from "../components/header";
import { theme } from "../theme";

export default function ChatPage() {
  const [inputHeight, setInputHeight] = useState(0);
  const inputRef = useRef<HTMLDivElement>(null);
  const drawerWidth = 240;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  function getBoxStyles() {
    return {
      position: "relative",
      width: !isMobile ? `calc(100% - ${drawerWidth}px)` : "100%",
    };
  }

  useEffect(() => {
    inputRef.current && setInputHeight(inputRef.current.clientHeight);
  }, [inputRef]);

  return (
    <Fragment>
      <Box sx={getBoxStyles()} component={"main"}>
        <Header
          toggleSidebar={toggleSidebar}
          drawerWidth={drawerWidth}
          sidebarOpen={sidebarOpen}
        />
        <Container sx={{ marginBottom: inputHeight }}>
          <MessageStack />
        </Container>
        <Container component={"div"} sx={styledInputContainer} ref={inputRef}>
          <MessageInput />
        </Container>
      </Box>
      <Sidebar
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
      />
    </Fragment>
  );
}

const styledInputContainer: CSSProperties = {
  position: "sticky",
  bottom: 0,
};
