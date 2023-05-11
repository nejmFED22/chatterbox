import { Link, List, ListItem, Typography } from "@mui/material";
import { useSocket } from "../../context/SocketContext";
import { theme } from "../../theme";

export default function SidebarUserList() {
  const { joinDM, sessionList, currentUser, loggedInUser } = useSocket();

  return (
    <List>
      {sessionList.map((user) => 
       user.username !== loggedInUser && (
        <ListItem key={user.userID} sx={listItemStyling}>
          <Link
            sx={{
              ...styledLink,
              backgroundColor: user.userID === currentUser?.userID ? theme.palette.primary.main : "",
            }}
            onClick={() => {
              joinDM(user);
            }}
          >
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
  cursor: "pointer",
  width: "100%",
  weight: "100%",
  color: theme.palette.primary.dark,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    textDecoration: "underline",
  },
};

const listItemStyling = {
  padding: 0,
};
