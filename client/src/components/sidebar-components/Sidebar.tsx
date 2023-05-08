// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import {
  IconButton,
  Tab,
  Tabs,
  Typography,
  useMediaQuery
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { theme } from "../../theme";
import SidebarRoomList from "./SidebarRoomList";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
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
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab sx={styledLink} label="Rooms" {...a11yProps(0)} />
              <Tab sx={styledLink} label="DMs" {...a11yProps(1)} />
              <Tab sx={styledLink} label="Users" {...a11yProps(2)} />
            </Tabs>

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
          <TabPanel value={value} index={0}>
          <SidebarRoomList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
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
