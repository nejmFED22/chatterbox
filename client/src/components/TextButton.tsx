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
      variant="outlined"
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
  lineHeight: 1,
  fontWeight: 400,
  padding: { xs: "0.3rem 0.6rem", sm: "0.3rem 2rem" },
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.dark,
  borderColor: theme.palette.primary.dark,
  fontSize: { xs: "18px", sm: "24px" },
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    borderColor: theme.palette.primary.dark,
  },
  "&:disabled": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
    //display: "none",
  },
};
