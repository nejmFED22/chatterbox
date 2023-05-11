import {
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { CSSProperties, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { theme } from "../theme";

interface Props {
  isMobile: boolean;
}

export default function MessageStack(
  { isMobile }: Props = { isMobile: false }
) {
  // We'll fetch this from the context eventually
  const { messages, isPrivate, privateMessages, loggedInUser } = useSocket();
  const largeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the page
  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <Stack
      divider={
        <Divider
          sx={{ margin: isMobile ? "2rem 0" : "2.5rem 0", ...styledDivider }}
        />
      }
      sx={styledStack}
    >
      {/* {mockMessages.map((message) => (
        <Card key={message.id}>
          <Container>
            <CardContent sx={styledCardContent(username === message.user)}>
              <Typography variant="body1">{message.user}</Typography>
              <Typography variant={largeScreen ? "h3" : "h4"}>
                {message.content}
              </Typography>
            </CardContent>
          </Container>
        </Card>
      ))} */}
      {/* TODO: Ändra index till id? */}
      
      {!isPrivate ? (
      messages.map((message, index) => (
        <Card key={index}>
          <Container>
            <CardContent
              sx={styledCardContent(loggedInUser === message.author)}
            >
              <Typography variant="body1">{message.author}</Typography>
              <Typography variant={largeScreen ? "h3" : "h4"}>
                {message.content}
              </Typography>
            </CardContent>
          </Container>
        </Card>
      ))
      ) : (
        privateMessages.map((message, index) => (
          <Card key={index}>
            <Container>
              <CardContent
                sx={styledCardContent(loggedInUser === message.authorUsername)}
              >
                <Typography variant="body1">{message.authorUsername}</Typography>
                <Typography variant={largeScreen ? "h3" : "h4"}>
                  {message.content}
                </Typography>
              </CardContent>
            </Container>
          </Card>
        ))
      )
    }
      <div ref={messageEndRef} />
    </Stack>
  );
}

function styledCardContent(isItMe: boolean) {
  const textAlign = isItMe ? "right" : "left";
  return {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
    textAlign,
  };
}

const styledStack: CSSProperties = {
  width: "100%",
  marginBottom: "2rem",
};

const styledDivider: CSSProperties = {
  borderColor: "black",
};
