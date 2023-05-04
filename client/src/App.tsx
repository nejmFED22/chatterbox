import { ThemeProvider } from "@emotion/react";
import "./App.css";
import Header from "./components/Header";
import LandingPage from './pages/LandingPage';
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <Header />
      <LandingPage/>
      </>
    </ThemeProvider>
  );
}

export default App;
