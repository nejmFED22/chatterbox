import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Link,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { theme } from "../../theme";

export default function SidebarRoomList() {
  // States and variables
  const { roomList, joinRoom } = useSocket();
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  useEffect(() => {
    console.log("activeRoom " + activeRoom);
  }, [activeRoom]);

  const getAccordionStyle = (roomName: string) => ({
    width: "100%",
    background: "none",
    fontSize: "35px",
    padding: "0",
    minHeight: "none",

    "& .MuiAccordionSummary-content": {
      margin: 0,
      height: "56px",
    },

    "& .MuiTypography-root": {
      display: "flex",
      alignItems: "center",
      paddingLeft: "1rem",
    },

    "&.Mui-expanded": {
      minHeight: "0px",
    },

    ...(activeRoom === roomName && {
      background: theme.palette.primary.main,
      padding: 0,
      textDecoration: "none",
      color: theme.palette.primary.main,
    }),
  });

  return (
    <>
      {roomList && roomList.length > 0 ? (
        <List sx={styledList}>
          {roomList.map((room) => (
            <ListItem key={room.name} sx={styledListItem}>
              <Accordion sx={styledAccordion}>
                {/* Room information */}
                <AccordionSummary
                  expandIcon={<ArrowForwardIosIcon sx={styledArrowIcon} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={getAccordionStyle(room.name)}
                >
                  <Box sx={styledArrowBackground}></Box>

                  <Link
                    sx={styledLink}
                    onClick={(e) => {
                      e.stopPropagation();
                      joinRoom(room.name);
                      setActiveRoom(room.name);
                    }}
                    className={activeRoom === room.name ? "active" : ""}
                  >
                    <Typography variant="h4">{room.name}</Typography>
                  </Link>
                </AccordionSummary>
                {/* List of online users in the room */}
                <AccordionDetails>
                  <List>
                    {room.onlineUsers.map((user) => (
                      <ListItem key={user}>
                        <Typography variant="body1">{user}</Typography>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={styledNoRoomText}>
          <Typography gutterBottom variant="h3">
            No rooms available :-(
          </Typography>
          <Typography variant="h5">
            Why not create one with the button below?
          </Typography>
        </Box>
      )}
    </>
  );
}

// CSS styling

const styledLink = {
  color: theme.palette.primary.dark,
  textDecoration: "none",
  cursor: "pointer",
  fontFamily: "Inter",
  paddingRight: "2rem",
  width: "100%",
  height: "100%",

  "&:hover": {
    textDecoration: "underline",
    background: theme.palette.primary.dark,
    color: theme.palette.primary.light,
  },
};

const styledAccordion = {
  width: "100%",
  fontSize: "35px",
  padding: 0,
  justifyContent: "space-between",
};

const styledArrowBackground = {
  position: "absolute",
  right: 0,
  background: theme.palette.primary.light,
  height: "56px",
  width: "56px",
};

const styledArrowIcon = {
  color: theme.palette.primary.dark,
  cursor: "pointer",
  padding: "1rem",
  position: "relative",
};

const styledList = {
  padding: "0",
  display: "flex",
  flexDirection: "column",
};

const styledListItem = {
  padding: "0px",
  color: theme.palette.primary.light,
  textDecoration: "none",
  cursor: "pointer",
};

const styledNoRoomText = {
  padding: "1rem 2rem",

  "& h3": {
    fontSize: "1.66rem",
  },
};
