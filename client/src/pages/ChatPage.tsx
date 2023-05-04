import { Box, Container } from "@mui/material";
import { CSSProperties, Fragment } from "react";
import Header from "../components/Header";
import MessageInput from "../components/MessageInput";
import MessageStack from "../components/MessageStack";
import Sidebar from "../components/Sidebar";

export default function ChatPage() {
  return (
    <Fragment>
      <Box sx={styledBox} component={"main"}>
        <Header />
        <Container>
          <MessageStack />
        </Container>
        <Container sx={styledInputContainer}>
          <MessageInput />
        </Container>
      </Box>
      <Sidebar />
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
