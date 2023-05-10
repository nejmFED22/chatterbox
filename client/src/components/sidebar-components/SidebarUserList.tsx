import { Link, List, ListItem, Typography } from "@mui/material";
import { useSocket } from "../../context/SocketContext";
import { theme } from "../../theme";

export default function SidebarUserList() {
  const { userList } = useSocket();

  return (
    <List>
      {userList.map((user) => (
        <ListItem key={user.userID} sx={listItemStyling}>
          <Link sx={styledLink}>
          <Typography variant="h4">{user.username}</Typography>          
          </Link>
        </ListItem>
      ))}
    </List>
  );
}

const styledLink = {
  padding: "1rem 2rem",
  textDecoration: "none",
  width: "100%",
  weight: "100%",
  color: theme.palette.primary.dark,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    textDecoration: "underline",
  },
}

const listItemStyling = {
  padding: 0,
}


