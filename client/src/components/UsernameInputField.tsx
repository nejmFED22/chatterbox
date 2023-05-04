import { Button, TextField } from "@mui/material";
import { useState } from "react";

export default function UsernameInputField() {

  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("username"));
  const [inputValue, setInputValue] = useState("");

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  };

  function handleLogin() {
    if (inputValue !== "") {
      localStorage.setItem("username", inputValue);
      setLoggedInUser(inputValue);
      setInputValue("");
    } else {
      console.log("Empty username is not allowed")
    }
  };

  function handleLogout() {
    localStorage.removeItem("username");
    setLoggedInUser(null);
  };

  return (
    <>
      {loggedInUser ? (
        <p>Current user logged in: {loggedInUser}</p>
      ) : (
        <p>Not logged in</p>
      )}
      <TextField
        label="Enter username"
        value={inputValue}
        onChange={handleUsernameChange}
      />
      <Button variant="contained" onClick={handleLogin}>
        Save
      </Button>
      <Button variant="contained" onClick={handleLogout}>
        Log out
      </Button>
    </>
  );
}