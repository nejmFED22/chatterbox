import { Card, CardContent, Stack, Typography } from "@mui/material";
import { CSSProperties, useState } from "react";

export default function MessageStack() {
  // We'll fetch this from the context eventually
  const [username] = useState("John Doe");

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
  ];
  return (
    <Stack sx={styledStack}>
      {mockMessages.map((message) => (
        <Card key={message.id}>
          <CardContent sx={styledCardContent(username === message.user)}>
            <Typography variant="body1">{message.user}</Typography>
            <Typography variant="h5">{message.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function styledCardContent(isItMe: boolean): CSSProperties {
  const textAlign = isItMe ? "right" : "left";
  return {
    padding: 0,
    textAlign,
  };
}

const styledStack: CSSProperties = {
  width: "100%",
};
