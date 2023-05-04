import { ThemeProvider } from "@mui/material";
import "./App.css";
import { useSocket } from "./context/SocketContext";
import ChatPage from "./pages/ChatPage";
import LandingPage from "./pages/LandingPage";
import { theme } from "./theme";

function App() {
  const { loggedInUser } = useSocket();

  return (
    <ThemeProvider theme={theme}>
      <>{loggedInUser ? <ChatPage /> : <LandingPage />}</>
    </ThemeProvider>
  );
}

export default App;
