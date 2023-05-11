import { CloseOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Container, IconButton, useMediaQuery } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { theme } from "../theme";

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const drawerWidth = 340;

export default function Header({ toggleSidebar, sidebarOpen }: HeaderProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { leaveAllRooms, currentRoom, currentUser } = useSocket();
  const [scrolledUp, setScrolledUp] = useState<boolean>(true);
  const prevPositionRef = useRef<number>(0);

  const handleSidebarToggle = () => {
    toggleSidebar();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;

      if (currentPosition < prevPositionRef.current) {
        setScrolledUp(true);
      } else {
        setScrolledUp(false);
      }
      prevPositionRef.current = currentPosition;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getStyleAppBar = () => {
    const defaultStyle = {
      background: "#000",
      padding: "0.15rem 0",
      height: "3.66rem",
      width:
        sidebarOpen && !isMobile ? `calc(100% - ${drawerWidth}px)` : "100%",
      mr: { sm: `${drawerWidth}px` },
      left: 0,
      "@media (max-width: 600px)": {
        fontSize: "1.25rem",
      },
    };
    const scrolledStyle = {
      transform: scrolledUp ? "none" : "translateY(-80px)",
      transition: "transform 0.4s ease",
    };

    return {
      ...defaultStyle,
      ...scrolledStyle,
    };
  };
  let roomName = "Chatterbox"
  if (currentRoom) {
    roomName = currentRoom;
  } else if (currentUser) {
    roomName = currentUser.username;
  }

  return (
    <>
      <AppBar sx={getStyleAppBar()} position={"fixed"}>
        <Container maxWidth="lg" sx={styledContainer}>
          <Box sx={styledLeft}>
            {currentRoom || currentUser ? (
              <IconButton
                aria-label="exit-room"
                size={"large"}
                sx={{ ...styledLeft, px: 0, mt: 0.2, mr: 1.5 }}
                onClick={leaveAllRooms}
              >
                <CloseOutlined sx={styledLeft} />
              </IconButton>
            ) : null}

            <Typography
              variant="body2"
              component="div"
              sx={{ ...styledLeft, ml: 1 }}
            >
              {roomName}
            </Typography>
          </Box>
          <IconButton
            size="small"
            sx={styledMenuIcon}
            color="inherit"
            aria-label="open sidebar"
            onClick={handleSidebarToggle}
          >
            {!sidebarOpen ? <MenuIcon sx={styledMenuIcon} /> : null}
          </IconButton>
        </Container>
      </AppBar>
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
  fontWeight: "400",
  whiteSpace: "nowrap",
};

const styledMenuIcon = {
  fontSize: "1.65rem",
  color: theme.palette.primary.light,
};
