import { List, ListItem } from "@mui/material";
import { useSocket } from "../../context/SocketContext";

export default function SidebarUserList() {
  const { sessionList } = useSocket();

  return (
    <List>
      {sessionList.map((session) => (
        <ListItem key={session.userID}>{session.username}</ListItem>
      ))}
    </List>
  );
}
