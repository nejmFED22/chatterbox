import { ThemeProvider } from "@emotion/react";
import "./App.css";
import Header from "./components/Header";
import ChatPage from "./pages/ChatPage";
import LandingPage from "./pages/LandingPage";

import { useSocket } from "./context/SocketContext";
import { theme } from "./theme";

export default function App() {
  const { loggedInUser } = useSocket();
  return (
    <ThemeProvider theme={theme}>
      <>
        <Header />
      {loggedInUser ? <ChatPage /> : <LandingPage />}
      </>
    </ThemeProvider>
  );
}
