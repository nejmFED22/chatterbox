import { Box, TextField, Typography } from "@mui/material";
import TextButton from "../components/TextButton";

export default function LandingPage() {
    return (
        <Box>
            <Typography>
                Welcome to Chatterb□x!
                <br/>
                What's your name?
            </Typography>
            <TextField fullWidth id="username" variant="standard" />
            <TextButton>Continue</TextButton>
        </Box>
    )
}