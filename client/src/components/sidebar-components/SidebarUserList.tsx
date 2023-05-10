import { Link, List, ListItem } from "@mui/material";
import { useSocket } from "../../context/SocketContext";

export default function SidebarUserList() {
  const { joinDM, sessionList } = useSocket();

  return (
    <List>
      {sessionList.map((session) => (
        <ListItem key={session.userID}>
          <Link
            onClick={() => {
              joinDM(session);
            }}
          >
            {session.username}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
