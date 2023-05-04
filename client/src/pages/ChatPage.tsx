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
  const [windowWidth, setWindowWidth] = useState<string>("100%");
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setWindowWidth(isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`);
  }, [isMobile]);

  useEffect(() => {
    inputRef.current && setInputHeight(inputRef.current.clientHeight);
  }, [inputRef]);

  return (
    <Fragment>
      <Header
        toggleSidebar={toggleSidebar}
        drawerWidth={drawerWidth}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        width={windowWidth}
      />
      <Box sx={{ width: windowWidth, ...styledBox }} component={"main"}>
        <MessageStack marginBottom={`${inputHeight}px`} />
        <Container component={"div"} sx={styledInputContainer} ref={inputRef}>
          <MessageInput isMobile={isMobile} />
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

const styledBox: CSSProperties = {
  position: "relative",
};

const styledInputContainer: CSSProperties = {
  position: "sticky",
  bottom: 0,
};
