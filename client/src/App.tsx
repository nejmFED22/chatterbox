import { useState } from "react";
import "./App.css";
import ChatPage from "./pages/ChatPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
  const [user] = useState(true);

  return user ? <ChatPage /> : <LandingPage />;
}
