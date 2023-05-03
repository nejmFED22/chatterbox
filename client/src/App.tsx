import { ThemeProvider } from "@emotion/react";
import "./App.css";
import LandingPage from './pages/LandingPage';
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
      <LandingPage/>
      </>
    </ThemeProvider>
  );
}

export default App;
