import { Box, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/header";
import { useSocket } from "./context/SocketContext";
import ChatPage from "./pages/ChatPage";
import LandingPage from "./pages/LandingPage";
import { theme } from "./theme";

function App() {
  const drawerWidth = 240;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loggedInUser } = useSocket();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <Sidebar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        {loggedInUser ? <ChatPage /> : <LandingPage />}
      </>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(94% - ${drawerWidth}px)` },
        }}
      >
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          qui
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
