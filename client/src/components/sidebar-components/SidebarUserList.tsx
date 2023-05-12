import { Box, Link, List, ListItem, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { theme } from "../../theme";

export default function SidebarUserList() {
  const { joinDM, sessionList, currentUser, loggedInUser } = useSocket();

  useEffect(() => {
    console.log(sessionList);
  }, [sessionList]);

  return (
    <>
      {sessionList && sessionList.length > 0 ? (
        <List sx={styledList}>
          {sessionList.map((user) => (
            user.username !== loggedInUser && (
              <ListItem key={user.userID} sx={listItemStyling}>
                <Link
                  sx={{
                    ...styledLink,
                    backgroundColor: user.userID === currentUser?.userID ? theme.palette.primary.main : '',
                  }}
                  onClick={() => {
                    joinDM(user);
                  }}
                >
                  <Typography variant="h4">{user.username}</Typography>
                </Link>
              </ListItem>
            )
          ))}
        </List>
      ) : (
        <Box sx={styledNoRoomText}>
        <Typography gutterBottom variant="h3">
          No users online :-(
        </Typography>
        <Typography variant="h5">
          Recommend Chatterbox to your friends!
        </Typography>
      </Box>
      )}
    </>
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

const styledNoRoomText = {
  padding: "1rem 2rem",

  "& h3": {
    fontSize: "1.66rem",
  },
};