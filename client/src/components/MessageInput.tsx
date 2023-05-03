import { Box } from "@mui/material";
import { CSSProperties } from "react";

export default function MessageInput() {
  return <Box sx={inputBoxStyling} />;
}

const inputBoxStyling: CSSProperties = {
  width: "100%",
  backgroundColor: "Blue",
};
