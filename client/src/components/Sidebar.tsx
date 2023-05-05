import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Link,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { theme } from "../theme";
import AddRoomButtom from "./AddRoomButton";

const rooms = ["FED22", "Another room", "Fun", "HKHNJ"];
const users = ["Jenny", "Nat", "Marcus", "Ellen"];
const drawerWidth = 340;

export default function Sidebar({
  toggleSidebar,
  sidebarOpen,
}: {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}) {
  const handleSidebarToggle = () => {
    toggleSidebar();
  };
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Box sx={sidebarStyles}>
      {!isMobile || sidebarOpen ? (
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            display: "block",
            zIndex: 1,
            "& .MuiDrawer-paper": drawerPaperStyles,
          }}
          open={sidebarOpen}
        >
          <Box sx={styledBox}>
            <List>
              <Link sx={styledLink}>Rooms</Link>
              <Link sx={styledLink}>DMs</Link>
              <Link sx={styledLink}>Users</Link>
            </List>

            {isMobile && sidebarOpen && (
              <IconButton
                size="small"
                sx={styledCloseIcon}
                onClick={handleSidebarToggle}
              >
                <CloseIcon sx={styledCloseIcon} />
              </IconButton>
            )}
          </Box>
          <List sx={styledList}>
            {rooms.map((room) => (
              <ListItem key={room} sx={styledListItem}>
                <Accordion sx={styledAccordion}>
                  <AccordionSummary
                    expandIcon={<ArrowForwardIosIcon sx={styledArrowIcon} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={styledAccordionSummary}
                  >
                    <Typography variant="h4">{room}</Typography>
                  </AccordionSummary>
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
          <AddRoomButtom />
        </Drawer>
      ) : null}
    </Box>
  );
}

const sidebarStyles = {
  display: "flex",
  width: "100vw",
  zIndex: 10,
  position: "relative",
};

const styledBox = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  justifyContent: "space-between",
  padding: "1rem",
};

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

const hoverStyles = {
  "&:hover": {
    background: theme.palette.primary.dark,
    color: theme.palette.primary.light,
  },
};

const activeStyles = {
  "&:active": {
    background: theme.palette.primary.main,
    color: theme.palette.primary.dark,
  },
};

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

const styledAccordionInner = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
};

const drawerPaperStyles = {
  width: drawerWidth,
  borderLeft: "1px solid",
  borderColor: theme.palette.primary.dark,
};

const styledCloseIcon = {
  color: theme.palette.primary.dark,
  cursor: "pointer",
  padding: 0,
  zIndex: 2,
};
