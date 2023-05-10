// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Tab, Tabs, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import React from "react";
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
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  return (
    <Box sx={sidebarStyles}>
      {!isMobile || sidebarOpen ? (
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
                sx={styledTabs}
              >
                <Tab sx={styledLink} label="Rooms" {...a11yProps(0)} />
                <Tab sx={styledLink} label="DMs" {...a11yProps(1)} />
                <Tab sx={styledLink} label="Users" {...a11yProps(2)} />
              </Tabs>

              {/* Close button on mobile */}
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

            {/* Tab content */}
            <TabPanel value={tab} index={0}>
              <Box>
                <SidebarRoomList />
              </Box>
              <AddRoomButtom />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Box sx={{ p: 3 }}>
                <SidebarDMList />
              </Box>
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <Box sx={{ p: 3 }}>
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
