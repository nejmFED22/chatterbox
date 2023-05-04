import { Button, TextField } from "@mui/material";
import { useState } from "react";

export default function UsernameInputField() {

  const loggedInUser = localStorage.getItem("username")
  const [username, setUsername] = useState("");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSaveUsername = () => {
    if (username !== "") {
      localStorage.setItem("username", username);
      setUsername("");
    } else {
      console.log("Empty username is not allowed")
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
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
        value={username}
        onChange={handleUsernameChange}
      />
      <Button variant="contained" onClick={handleSaveUsername}>
        Save
      </Button>
      <Button variant="contained" onClick={handleLogout}>
        Log out
      </Button>
    </>
  );
}
