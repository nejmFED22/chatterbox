import { ThemeProvider } from "@emotion/react";
import "./App.css";
import TextButton from "./components/TextButton";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <TextButton>Continue</TextButton>
      </>
    </ThemeProvider>
  );
}
