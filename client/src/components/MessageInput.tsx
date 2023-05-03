import { Box, Typography } from "@mui/material";
import { CSSProperties } from "react";

export default function MessageInput() {
  return (
    <Box sx={inputBoxStyling}>
      <Typography variant="h3">message input here</Typography>
    </Box>
  );
}

const inputBoxStyling: CSSProperties = {
  width: "100%",
  backgroundColor: "Blue",
};
