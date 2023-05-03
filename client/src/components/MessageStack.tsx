import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import { CSSProperties } from "react";

export default function MessageStack() {
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
  ];
  return (
    <Stack sx={stack}>
      {mockMessages.map((message) => (
        <Card>
          <CardHeader title={message.user} />
          <CardContent>{message.content}</CardContent>
        </Card>
      ))}
    </Stack>
  );
}

const stack: CSSProperties = {
  width: "100%",
};
