import { Button } from "@mui/material";

interface Props {
    children: React.ReactNode;
    onClick?: () => void;
    size?: "medium" | "large";
}

export default function TextButton({ children, size = "medium", onClick }: Props) {
    return (
        <Button variant="outlined" size={size} type="submit" sx={styledButton} onClick={onClick}>
            {children}
        </Button>
    )
}

const styledButton = {
    margin: "0rem 0.5rem",
    padding: "0.1rem 0.8rem",
    backgroundColor: "#C1FF10",
    color: "black",
    borderColor: "black",
    textTransform: "none",
    "&:hover": {
        backgroundColor: "black",
        color: "white",
        borderColor: "black",
    }
}