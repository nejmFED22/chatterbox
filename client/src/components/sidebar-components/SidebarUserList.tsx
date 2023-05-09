import { List, ListItem } from "@mui/material";
import { useSocket } from "../../context/SocketContext";

export default function SidebarUserList() {
  const { userList } = useSocket();

  return (
    <List>
      {userList.map((user) => (
        <ListItem key={user.userID}>{user.userID}</ListItem>
      ))}
    </List>
  );
}
