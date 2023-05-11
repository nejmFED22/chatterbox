import { Button } from "@mui/material";
import { theme } from "../theme";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function TextButton({
  children,
  onClick,
  disabled = false,
}: Props) {
  return (
    <Button
      variant="contained"
      type="submit"
      sx={styledButton}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

const styledButton = {
  padding: { xs: "0.3rem 0.6rem", sm: "0.3rem 2rem" },
  fontSize: { xs: "18px", sm: "24px" },
  textTransform: "none",
  "&:disabled": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
  },
};
