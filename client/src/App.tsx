import { Box, ThemeProvider } from "@mui/material";
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
      </>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(94% - ${drawerWidth}px)` },
        }}
      >
        {loggedInUser ? <ChatPage /> : <LandingPage />}
      </Box>
    </ThemeProvider>
  );
}

export default App;
