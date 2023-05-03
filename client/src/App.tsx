import { ThemeProvider } from "@emotion/react";
import { useState } from "react";
import "./App.css";
import ChatPage from "./pages/ChatPage";
import LandingPage from "./pages/LandingPage";

import { theme } from "./theme";

export default function App() {
  const [user] = useState(true);
  return (
    <ThemeProvider theme={theme}>
      {user ? <ChatPage /> : <LandingPage />}
    </ThemeProvider>
  );
}
