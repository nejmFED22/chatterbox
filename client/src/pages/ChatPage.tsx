import { Box, Container } from "@mui/material";
import { CSSProperties, Fragment, useEffect, useRef, useState } from "react";
import MessageInput from "../components/MessageInput";
import MessageStack from "../components/MessageStack";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function ChatPage() {
  const [inputHeight, setInputHeight] = useState(0);
  const inputRef = useRef<HTMLDivElement>(null);
  const drawerWidth = 240;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    inputRef.current && setInputHeight(inputRef.current.clientHeight);
  }, [inputRef]);

  // Not working, fix later
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  return (
    <Fragment>
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Box sx={styledBox} component={"main"}>
        <MessageStack marginBottom={`${inputHeight}px`} />
        <Container ref={inputRef} sx={styledInputContainer}>
          <MessageInput />
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
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
};
