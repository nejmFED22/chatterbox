import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextButton from "../components/TextButton";

const schema = z.object({
  username: z.string().min(3).max(20),
});

type FormValues = z.infer<typeof schema>;

export default function LandingPage() {

  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("username"));
  const [inputValue, setInputValue] = useState("");
  
  //Jag installerade @hookform/resolvers som David gjort i sitt exempel,
  //men formuläret brjade strula så avinstallerade igen. 
  //Kanske försöker igen vid ett senare tillfälle.
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({
    mode: "onChange",
    resolver: async (data) => {
      try {
        const parsedData = schema.parse(data);
        return { values: parsedData, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorFields = error.flatten().fieldErrors;
          return { values: {}, errors: errorFields };
        }
        throw error;
      }
    },
  });

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  };

  const onSubmit = () => {
    if (inputValue !== "") {
      localStorage.setItem("username", inputValue);
      setLoggedInUser(inputValue);
      setInputValue("");
    } else {
      console.log("Empty username is not allowed")
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
            value={inputValue}
            onChange={handleUsernameChange}
            autoComplete="off"
          />
          <Box sx={buttonContainer}>
            <TextButton disabled={!isValid}>Continue</TextButton>
          </Box>
        </Box>
      </form>
      {loggedInUser ? (
        <p>Current user logged in: {loggedInUser}</p>
      ) : (
        <p>Not logged in</p>
      )}
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
  },
};

const buttonContainer = {
  padding: {xs: "1rem 0rem", sm: "0.5rem 0.5rem 0rem"},
}
