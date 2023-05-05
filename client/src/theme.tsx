import {
  createTheme,
  responsiveFontSizes,
  Shadows,
  Theme,
} from "@mui/material";

export let theme: Theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1400,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 400,
      fontSize: "6.25rem", // 100px
      color: "black",
      "@media (max-width:600px)": {
        fontSize: "2.875rem", // 35px
      },
    },
    h2: {
      fontWeight: 400,
      fontSize: "2.875rem", // 35px
    },
    h3: {
      fontSize: "1.875rem", // 30px
    },
    h4: {
      fontSize: "1.5rem", // 26px
    },
    h5: {
      fontSize: "1.125rem", // 18px
    },
    h6: {
      fontSize: "1rem", // 16px
    },
    body1: {
      fontSize: "1.125rem", // 18px
      "@media (max-width: 600px)": {
        fontSize: "1rem", // 16px
      },
    },
    body2: {
      fontSize: "1.875rem", // 30px
      "@media (max-width: 600px)": {
        fontSize: "1.25rem", // 20px
      },
    },
  },
  palette: {
    primary: {
      main: "#C1FF10",
      light: "#fff",
      dark: "#000",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "0.7rem 1rem",
          textTransform: "none",
          fontWeight: 400,
          lineHeight: 1,
        },
        containedPrimary: {
          border: "1px solid #000",
          color: "#000",
          backgroundColor: "#C1FF10",
          "&:hover": {
            color: "#fff",
            backgroundColor: "#000",
          },
        },
      },
    },
  },
  shadows: Array(25).fill("none") as Shadows,
});
theme = responsiveFontSizes(theme, {
  breakpoints: ["sm", "md", "lg"],
  factor: 1.75,
  variants: ["h1", "h2", "h3", "h4", "h5", "h6"],
});
