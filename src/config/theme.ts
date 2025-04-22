import { Shadows, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D9D9D9",
    },
    secondary: {
      main: "#2FCC59",
    },
    error: {
      main: "#FF0000",
    },
    background: {
      default: "#E9E9EB",
    },
  },
  typography: {
    body2: {
      fontWeight: "200",
      fontSize: "0.6rem",
    },
  },
  spacing: 5,
  shadows: Array(25).fill("none") as Shadows,
});

export default theme;
