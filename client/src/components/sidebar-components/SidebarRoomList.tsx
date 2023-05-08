import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Link,
  List,
  ListItem,
  Typography
} from "@mui/material";
import { useSocket } from "../../context/SocketContext";
import { theme } from "../../theme";

export default function SidebarRoomList() {
  // States and variables
  const { roomList, joinRoom } = useSocket();
  const users = ["Jenny", "Nat", "Marcus", "Ellen"];

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
                  sx={styledAccordionSummary}
                >
                  <Link
                    sx={styledLink}
                    onClick={(e) => {
                      e.stopPropagation();
                      joinRoom(room.name);
                    }}
                  >
                    <Typography variant="h4">
                      ({room.onlineUsers}) {room.name}
                    </Typography>
                  </Link>
                </AccordionSummary>
                {/* List of online users in the room */}
                <AccordionDetails>
                  <List>
                    {users.map((user) => (
                      <ListItem key={user}>
                        <Typography variant="body2">{user}</Typography>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </ListItem>
          ))}
        </List>
      ) : (
        <>
          <Typography gutterBottom variant="h3">
            No rooms available :-(
          </Typography>
          <Typography variant="h5">
            Why not create one with the button below?
          </Typography>
        </>
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

  "&:hover": {
    textDecoration: "underline",
  },
};

// const hoverStyles = {
//   "&:hover": {
//     background: theme.palette.primary.dark,
//     color: theme.palette.primary.light,
//   },
// };

// const activeStyles = {
//   "&:active": {
//     background: theme.palette.primary.main,
//     color: theme.palette.primary.dark,
//   },
// };

const styledArrowIcon = {
  color: theme.palette.primary.dark,
  cursor: "pointer",
  zIndex: 2,
  background: theme.palette.primary.light,
  paddingRight: "1rem",
  // ...activeStyles,
};

const styledList = {
  padding: "0",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const styledListItem = {
  padding: "0px",
  color: theme.palette.primary.light,
  textDecoration: "none",
  cursor: "pointer",
  // ...hoverStyles,
  // ...activeStyles,
};

const styledAccordion = {
  width: "100%",
  background: "none",
  paddingLeft: "1rem",
  fontSize: "35px",

  // ...hoverStyles,
};

const styledAccordionSummary = {
  minHeight: "0px",
  padding: "0px",
  // ...activeStyles,
};

// const styledAccordionInner = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   width: "100%",
// };