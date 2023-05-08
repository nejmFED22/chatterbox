// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Link, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { theme } from "../../theme";
import SidebarRoomList from "./SidebarRoomList";

export default function Sidebar({
  // Decides whether sidebar is permanent or toggleable
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

  // Sidebar component
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
          {/* Tabs */}
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
          <SidebarRoomList />
        </Drawer>
      ) : null}
    </Box>
  );
}

// CSS styling

const drawerWidth = 340;

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

// const styledAccordionInner = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   width: "100%",
// };

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
