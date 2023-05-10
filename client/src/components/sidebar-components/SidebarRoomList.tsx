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
  const [activeRoom, setActiveRoom] = useState<string | null>(null); // Skapa en state-variabel för att hålla reda på det aktiva styledAccordion-elementet

  useEffect(() => {
    console.log("activeRoom " + activeRoom);
  }, [activeRoom]);

  const getAccordionStyle = (roomName: string) => ({
    width: "100%",
    background: "none",
    fontSize: "35px",
    padding: "0 0.5rem",

    "& .MuiAccordionSummary-content": {
      margin: 0,
      height: "3rem",
    },

    "& .MuiAccordionSummary-expandIconWrapper": {
      margin: 0,
      height: "100%",
    },

    "& .MuiTypography-root": {
      display: "flex",
      alignItems: "center",
      color: theme.palette.primary.dark,
    },

    "&.Mui-expanded": {
      minHeight: "0px",
    },

    "& .MuiSvgIcon-root": {
      fill: theme.palette.primary.dark,
    },

    ...(activeRoom === roomName && {
      background: theme.palette.primary.main,
      textDecoration: "none",
      color: theme.palette.primary.main,
    }),

    "&:hover": {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.light,

      "& .MuiTypography-root": {
        color: theme.palette.primary.light,
      },

      "& .MuiSvgIcon-root": {
        fill: theme.palette.primary.light,
      },
    },
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
                  expandIcon={<ArrowForwardIosIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={getAccordionStyle(room.name)}
                >
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
                <AccordionDetails sx={styledAccordionDetails}>
                  <List>
                    {room.onlineUsers &&
                      room.onlineUsers.map((user) => (
                        <ListItem key={user} sx={styledUsername}>
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
        <Box sx={styledBox}>
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
  textDecoration: "none",

  "&:hover": {
    textDecorationColor: "none",
    textDecoration: "none",
  },
};

const styledAccordion = {
  width: "100%",
  fontSize: "35px",
  padding: 0,
  justifyContent: "space-between",
};

const styledList = {
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const styledListItem = {
  padding: 0,
  color: theme.palette.primary.light,
  textDecoration: "none",
  cursor: "pointer",
};

const styledAccordionDetails = {
  padding: "0 0.5rem",
};

const styledUsername = {
  padding: 0,
};

const styledBox = {
  padding: "0 0.3rem",
};
