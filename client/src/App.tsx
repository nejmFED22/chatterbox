import { ThemeProvider } from "@emotion/react";
import "./App.css";
import Header from "./components/header";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <Header />
      </>
    </ThemeProvider>
  );
}

export default App;
