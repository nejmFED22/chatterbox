import { CloseOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
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
    <Slide appear={false} direction="down" in={trigger}>
      {children}
    </Slide>
  );
}

export default function Header() {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <HideOnScroll>
        <AppBar sx={styledAppBar}>
          <Container maxWidth="lg" sx={styledContainer}>
            <Box sx={styledLeft}>
              <IconButton aria-label="exit-room" sx={styledLeft}>
                <CloseOutlined sx={styledLeft} />
              </IconButton>
              <Typography variant="h6" component="div" sx={styledLeft}>
                Room: 1337
              </Typography>
            </Box>
            {isMobile && (
              <IconButton
                size="small"
                sx={styledMenuIcon}
                color="inherit"
                aria-label="open drawer"
              >
                <MenuIcon sx={styledMenuIcon} />
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
  padding: "1rem 0",
  "@media (max-width: 600px)": {
    fontSize: "1.25rem",
  },
};

const styledContainer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const styledLeft = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#fff",
  fontSize: "1.875rem",
  paddingLeft: 0,

  "@media (max-width: 600px)": {
    fontSize: "1.25rem",
  },
};

const styledMenuIcon = {
  fontSize: "1.65rem",
};
