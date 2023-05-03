import { Container } from "@mui/material";
import { CSSProperties, Fragment } from "react";
import Header from "../components/Header";
import MessageInput from "../components/MessageInput";
import MessageStack from "../components/MessageStack";
import Sidebar from "../components/Sidebar";

export default function ChatPage() {
  return (
    <Fragment>
      <Container sx={styledContainer}>
        <Header />
        <MessageInput />
        <MessageStack />
      </Container>
      <Sidebar />
    </Fragment>
  );
}

const styledContainer: CSSProperties = {
  height: "100vh",
  overflowY: "scroll",
};
