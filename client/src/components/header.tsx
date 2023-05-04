import { CloseOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Container, IconButton, useScrollTrigger } from "@mui/material";
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
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  drawerWidth: number;
  isMobile: boolean;
  width: string;
}

export default function Header({
  toggleSidebar,
  sidebarOpen,
  isMobile,
  width,
}: HeaderProps) {
  const handleSidebarToggle = () => {
    toggleSidebar();
  };

  return (
    <>
      <HideOnScroll>
        <AppBar sx={{ width, ...styledAppBar }}>
          <Container maxWidth="lg" sx={styledContainer}>
            <Box sx={styledLeft}>
              <IconButton aria-label="exit-room" sx={styledLeft}>
                <CloseOutlined sx={styledLeft} />
              </IconButton>
              <Typography variant="body1" component="div" sx={styledLeft}>
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
          </Container>
        </AppBar>
      </HideOnScroll>
    </>
  );
}

const styledAppBar = {
  background: "#000",
  padding: "0.15rem 0",
  height: "3.26rem",
  left: 0,
  "@media (max-width: 600px)": {
    fontSize: "1.25rem",
  },
};

const styledContainer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "62.4px",
};

const styledLeft = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#fff",
  paddingLeft: 0,
  fontWeight: "400",
};

const styledMenuIcon = {
  fontSize: "1.65rem",
  color: theme.palette.primary.light,
};
