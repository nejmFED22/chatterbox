import {
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { CSSProperties, useState } from "react";
import { theme } from "../theme";

export default function MessageStack() {
  // We'll fetch this from the context eventually
  const [username] = useState("John Doe");

  const largeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const mockMessages = [
    {
      id: 1,
      user: "John Doe",
      content: "Hello World!",
    },
    {
      id: 2,
      user: "Jane Doe",
      content: "Hello World again!",
    },
    {
      id: 3,
      user: "Doe Doe",
      content: "Hello World again again!",
    },
    {
      id: 4,
      user: "John Doe",
      content: "Hello World!",
    },
    {
      id: 5,
      user: "Jane Doe",
      content: "Hello World again!",
    },
    {
      id: 6,
      user: "Doe Doe",
      content: "Hello World again again!",
    },
    {
      id: 7,
      user: "John Doe",
      content: "Hello World!",
    },
    {
      id: 8,
      user: "Jane Doe",
      content: "Hello World again!",
    },
    {
      id: 9,
      user: "Doe Doe",
      content: "Hello World again again!",
    },
    {
      id: 10,
      user: "Doe Doe",
      content: "Hello World again again!",
    },
    {
      id: 11,
      user: "Doe Doe",
      content: "Hello World again again!",
    },
    {
      id: 12,
      user: "Doe Doe",
      content: "Hello World again again!",
    },
  ];

  return (
    <Stack divider={<Divider sx={styledDivider} />} sx={styledStack}>
      {mockMessages.map((message) => (
        <Card key={message.id}>
          <Container>
            <CardContent sx={styledCardContent(username === message.user)}>
              <Typography variant="body2">{message.user}</Typography>
              <Typography variant={largeScreen ? "h3" : "h4"}>
                {message.content}
              </Typography>
            </CardContent>
          </Container>
        </Card>
      ))}
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
  marginBottom: "1rem",
};

const styledDivider: CSSProperties = {
  margin: "1.2rem 0",
  borderColor: "black",
};
