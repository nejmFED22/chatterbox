import { Container } from "@mui/material";
import { CSSProperties, Fragment } from "react";
import MessageInput from "../components/MessageInput";
import MessageStack from "../components/MessageStack";
import Sidebar from "../components/Sidebar";
import Header from "../components/header";

export default function ChatPage() {
  return (
    <Fragment>
      <Container sx={styledContainer}>
        <Header />
        <MessageStack />
        <MessageInput />
      </Container>
      <Sidebar />
    </Fragment>
  );
}

const styledContainer: CSSProperties = {
  height: "100vh",
};
