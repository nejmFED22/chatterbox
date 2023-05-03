import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import {
  Accordion,
  IconButton,
  Link,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const drawerWidth = 240;

const rooms = ["FED22", "Another room", "Fun", "HKHNJ"];
const users = ["Jenny", "Nat", "Marcus", "Ellen"];

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
            <Link sx={styledLink}>Rooms</Link>
            <Link sx={styledLink}>DMs</Link>
            <Link sx={styledLink}>Users</Link>

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
          <Divider />
          <List sx={styledList}>
            {rooms.map((text) => (
              <ListItem key={text} sx={styledListItem}>
                <Accordion sx={styledAccordion}>
                  <Box sx={styledAccordionInner}>
                    <Typography variant="h4">{text}</Typography>
                    <ArrowForwardIosIcon sx={styledArrowIcon} />
                  </Box>
                  <Typography variant="body1">lite text</Typography>
                </Accordion>
              </ListItem>
            ))}
          </List>
        </Drawer>
      ) : null}
    </Box>
  );
}

const sidebarStyles = {
  display: "flex",
  width: "100vw",
  zIndex: 10,
};

const styledBox = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "1rem",
};

const styledLink = {
  color: "#000",
  textDecoration: "none",
  cursor: "pointer",
  fontFamily: "Inter",

  "&:hover": {
    textDecoration: "underline",
  },
};

const hoverStyles = {
  "&:hover": {
    background: "#000",
    color: "#fff",
  },
};

const activeStyles = {
  "&:active": {
    background: "#C1FF10",
    color: "#000",
  },
};

const styledArrowIcon = {
  color: "#000",
  cursor: "pointer",
  zIndex: 2,
  background: "#fff",
  height: "62.4px",
  padding: "1rem",
};

const styledList = {
  padding: "0",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const styledListItem = {
  padding: "0",
  color: "#fff",
  textDecoration: "none",
  cursor: "pointer",
  ...hoverStyles,
  ...activeStyles,
};

const styledAccordion = {
  width: "100%",
  background: "none",
  paddingLeft: "1rem",
  fontSize: "35px",
  ...hoverStyles,
  ...activeStyles,
};

const styledAccordionInner = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
};

const drawerPaperStyles = {
  width: drawerWidth,
};

const styledCloseIcon = {
  color: "#000",
  cursor: "pointer",
  zIndex: 2,
};
