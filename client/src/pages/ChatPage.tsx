import { Container } from "@mui/material";
import { CSSProperties, Fragment } from "react";
import MessageInput from "../components/MessageInput";
import MessageStack from "../components/MessageStack";
import Sidebar from "../components/Sidebar";

export default function ChatPage() {
  return (
    <Fragment>
      <Container sx={containerStyling}>
        <MessageStack />
        <MessageInput />
      </Container>
      <Sidebar />
    </Fragment>
  );
}

const containerStyling: CSSProperties = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
};
