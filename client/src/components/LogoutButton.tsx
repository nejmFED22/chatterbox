import { Button, Typography } from "@mui/material";

function handleClearSessionStorage() {
  sessionStorage.clear();
  sessionStorage.clear();
  location.reload();
}

export default function LogoutButton() {

  return (
    <>
      <Button sx={styledAddButton} onClick={handleClearSessionStorage}>
        <Typography variant={"body2"}>Logout</Typography>
      </Button>
    </>
  );
}

const styledAddButton = {
  padding: "1rem",
  fontWeight: 600,
  color: "black",
  justifySelf: "center",
  width: "4.8rem",
  height: "2.2rem",
  position: "absolute",
  bottom: "1.6rem",
  right: "14.5rem",
  "&:hover": {
    textDecoration: "underline",
  },
};
