import { Button } from "@mui/material";

interface Props {
    children: React.ReactNode;
    onClick?: () => void;
}

export default function TextButton({ children, onClick }: Props) {
    return (
        <Button variant="outlined" size="medium" sx={styledButton} onClick={onClick}>
            {children}
        </Button>
    )
}

const styledButton = {
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