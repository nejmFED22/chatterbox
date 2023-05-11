import { zodResolver } from "@hookform/resolvers/zod";
import { Box, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextButton from "../components/TextButton";
import { useSocket } from "../context/SocketContext";
import { theme } from "../theme";

const schema = z.object({
  username: z.string().min(2).max(20),
});

type FormValues = z.infer<typeof schema>;

export default function LandingPage() {
  const { setLoggedInUser, socket } = useSocket();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    const { username } = data;
    if (username) {
      sessionStorage.setItem("username", username);
      setLoggedInUser(username);
      socket.auth = { username };
    } else {
      console.log("Empty username is not allowed");
    }
  };

  return (
    <Box sx={outerContainer}>
      <Typography variant="h1">
        Welcome to Chatterb🄾x!
        <br />
        What's your name?
        {/* □ ▣ ❑ ⛾ 🞔 🞑 ⌗ ⬚ 🞖*/}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={formContainer}>
          <TextField
            fullWidth
            id="username"
            variant="standard"
            {...register("username", { required: true })}
            error={Boolean(errors.username)}
            helperText={errors.username?.message}
            sx={textFieldStyles}
            autoComplete="off"
          />
          <Box sx={buttonContainer}>
            <TextButton>Continue</TextButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

const outerContainer = {
  marginTop: "7rem",
  padding: "45px",
};

const formContainer = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  maxWidth: "52rem",
  marginTop: { xs: "6rem", sm: "3rem" },
  alignItems: "end",
};

const textFieldStyles = {
  input: {
    textAlign: "center",
    typography: theme.typography.body2,
  },
};

const buttonContainer = {
  padding: { xs: "1rem 0rem", sm: "0.5rem 0.5rem 0rem" },
};
