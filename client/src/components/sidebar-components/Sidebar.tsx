// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Tab, Tabs, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import React, { useEffect } from "react";
import { theme } from "../../theme";
import LogoutButton from "../LogoutButton";
import AddRoomButtom from "./../AddRoomButton";
import SidebarDMList from "./SidebarDMList";
import SidebarRoomList from "./SidebarRoomList";
import SidebarUserList from "./SidebarUserList";

// Tab panel logic
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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

// Accessability props for tabs
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Sidebar component
export default function Sidebar({
  toggleSidebar,
  sidebarOpen = true,
}: {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}) {
  const handleSidebarToggle = () => {
    toggleSidebar();
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Changes sidebar open when you resize window.
  useEffect(() => {
    const handleResize = () => {
      if (isMobile && sidebarOpen) {
        toggleSidebar();
      }
      if (!isMobile && !sidebarOpen) {
        toggleSidebar();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, sidebarOpen, toggleSidebar]);

  // Tab logic
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  return (
    <Box sx={sidebarStyles}>
      {sidebarOpen ? (
        <>
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
                value={tab}
                onChange={handleTabChange}
                aria-label="basic tabs example"
                indicatorColor="secondary"
                sx={styledTabs}
              >
                <Tab sx={styledLink} label="Rooms" {...a11yProps(0)} />
                {/* <Tab sx={styledLink} label="DMs" {...a11yProps(1)} /> */}
                <Tab sx={styledLink} label="Direct Messages" {...a11yProps(1)} />
              </Tabs>

              {/* Close button on mobile */}
              <IconButton
                size="small"
                sx={styledCloseIcon}
                onClick={handleSidebarToggle}
              >
                <CloseIcon sx={styledCloseIcon} />
              </IconButton>
            </Box>

            {/* Tab content */}
            <TabPanel value={tab} index={0}>
              <Box>
                <SidebarRoomList />
              </Box>
              <AddRoomButtom />
            </TabPanel>
            {/* <TabPanel value={tab} index={1}>
              <Box sx={{ p: 3 }}>
                <SidebarDMList />
              </Box>
            </TabPanel> */}
            <TabPanel value={tab} index={1}>
              <Box sx={{ p: 0 }}>
                <SidebarUserList />
              </Box>
            </TabPanel>
            <LogoutButton />
          </Drawer>
        </>
      ) : null}
    </Box>
  );
}

// CSS styling

const drawerWidth = 340;

const sidebarStyles = {
  display: "flex",
  width: "100vw",
  zIndex: 10000000,
  position: "fixed",
};

const styledBox = {
  padding: 0,
  display: "flex",
  gap: "0.1rem",
  justifyContent: "center",
  marginBottom: "0.8rem",
};

const styledTabs = {
  minHeight: "40px",
  height: "44px",
};

const styledLink = {
  color: theme.palette.primary.dark,
  textDecoration: "none",
  cursor: "pointer",
  justifyContent: "center",
  fontWeight: 700,
  padding: "0px 16px",

  "&.Mui-selected": {
    color: "black",
  },
};

const drawerPaperStyles = {
  width: drawerWidth,
  borderLeft: "1px solid",
  borderColor: theme.palette.primary.dark,
};

const styledCloseIcon = {
  color: theme.palette.primary.dark,
  cursor: "pointer",
  paddingLeft: "0.4rem",
  paddingRight: "0.4rem",
  zIndex: 2,
};
