import { Box, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextButton from "../components/TextButton";

const schema = z.object({
  name: z.string().min(3).max(20),
});

type FormValues = z.infer<typeof schema>;

export default function LandingPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
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

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Box sx={outerContainer}>
      <Typography variant="h1">
        Welcome to Chatterb□x!
        <br />
        What's your name?
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={formContainer}>
          <TextField
            fullWidth
            id="username"
            variant="standard"
            {...register("name", { required: true })}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            sx={textFieldStyles}
            autoComplete="off"
          />
          <Box sx={buttonContainer}>
            <TextButton disabled={!isValid}>Continue</TextButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

const outerContainer = {
  padding: "45px",
};

const formContainer = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  maxWidth: "52rem",
  marginTop: { xs: "6rem", sm: "3rem" },
  alignItems: { xs: "center", sm: "end" },
};

const textFieldStyles = {
  input: {
    textAlign: "center",
  },
};

const buttonContainer = {
  marginTop: { xs: "2rem", sm: "0rem" },
}
