import { Link, List, ListItem, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { theme } from "../../theme";

export default function SidebarUserList() {
  const { joinDM, sessionList } = useSocket();

  useEffect(() => {
    console.log(sessionList);
  }, [sessionList]);

  return (
    <List sx={styledList}>
      {sessionList.map((user) => (
        <ListItem key={user.userID} sx={listItemStyling}>
          <Link
            sx={styledLink}
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
  color: theme.palette.primary.dark,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    textDecoration: "underline",
  },
};

const styledList = {
  padding: "0",
};

const listItemStyling = {
  padding: 0,
};
