import { Link, List, ListItem } from "@mui/material";
import { useSocket } from "../../context/SocketContext";

export default function SidebarUserList() {
  const { joinRoom, sessionList } = useSocket();

  return (
    <List>
      {sessionList.map((session) => (
        <ListItem key={session.userID}>
          <Link
            onClick={() => {
              joinRoom(session.userID);
            }}
          >
            {session.username}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
