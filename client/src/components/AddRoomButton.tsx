import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import { CSSProperties, useState } from "react";
import CreateRoomForm from "../components/CreateRoomForm";
import { theme } from "../theme";

export default function AddRoomButton() {
  const [openCreateRoom, setOpenCreateRoom] = useState(false);

  const handleToggleCreateRoom = () => {
    setOpenCreateRoom(!openCreateRoom);
  };

  const handleCloseCreateRoom = () => {
    setOpenCreateRoom(false);
  };

  return (
    <>
      <IconButton sx={styledAddButton} onClick={handleToggleCreateRoom}>
        <AddIcon sx={styledAddIcon} />
      </IconButton>
      {openCreateRoom && (
        <CreateRoomForm onClose={handleCloseCreateRoom} /> // Passa onClose-funktionen som prop
      )}
    </>
  );
}

const styledAddButton = {
  padding: "1rem",
  background: theme.palette.primary.main,
  justifySelf: "flex-end",
  width: "2.8rem",
  height: "2.8rem",
  position: "absolute",
  bottom: "1.2rem",
  right: "1.2rem",
  "&:hover": {
    background: theme.palette.primary.dark,
  },
  '&:hover > svg': {
    color: theme.palette.primary.main,
  },
};

const styledAddIcon: CSSProperties = {
  color: theme.palette.primary.dark,
  fontSize: "1.6rem",
};
