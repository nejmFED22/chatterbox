import { ThemeProvider } from "@emotion/react";
import "./App.css";
import Header from "./components/header";
import UsernameInputField from "./components/UsernameInputField"
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        {/* <Header /> */}
        <UsernameInputField />
      </>
    </ThemeProvider>
  );
}

export default App;
