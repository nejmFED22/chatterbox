import { CloseOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Container,
  IconButton,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import { ReactElement } from "react";
import { theme } from "../theme";

interface HideOnScrollProps {
  children: ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={true} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const drawerWidth = 340;

export default function Header({ toggleSidebar, sidebarOpen }: HeaderProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSidebarToggle = () => {
    toggleSidebar();
  };
  const getStyleAppBar = () => {
    return {
      background: "#000",
      padding: "0.15rem 0",
      height: "3.26rem",

      width:
        sidebarOpen || !isMobile ? `calc(100% - ${drawerWidth}px)` : "100%",
      mr: { sm: `${drawerWidth}px` },
      left: 0,
      "@media (max-width: 600px)": {
        fontSize: "1.25rem",
      },
    };
  };

  function handleClearLocalStorage() {
    localStorage.clear();
    localStorage.clear();
    location.reload();
  }

  return (
    <>
      <HideOnScroll>
        <AppBar sx={getStyleAppBar()}>
          <Container maxWidth="lg" sx={styledContainer}>
            <Box sx={styledLeft}>
              <IconButton aria-label="exit-room" sx={styledLeft}>
                <CloseOutlined sx={styledLeft} />
              </IconButton>
              <Typography variant="body2" component="div" sx={styledLeft}>
                Room: 1337
              </Typography>
            </Box>
            {isMobile && (
              <IconButton
                size="small"
                sx={styledMenuIcon}
                color="inherit"
                aria-label="open sidebar"
                onClick={handleSidebarToggle}
              >
                {!sidebarOpen ? <MenuIcon sx={styledMenuIcon} /> : null}
              </IconButton>
            )}
            <Button onClick={handleClearLocalStorage}>Logout</Button>
          </Container>
        </AppBar>
      </HideOnScroll>
    </>
  );
}

const styledContainer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "3.4rem",
};

const styledLeft = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#fff",
  paddingLeft: 0,
  fontWeight: "400",
  whiteSpace: "nowrap",
};

const styledMenuIcon = {
  fontSize: "1.65rem",
  color: theme.palette.primary.light,
};
