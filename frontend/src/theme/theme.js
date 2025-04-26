import { createTheme } from "@mui/material/styles";

const theme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#66ccaa",
      },
      secondary: {
        main: "#66d7f2",
      },
      tertiary: {
        main: "#66bbe4",
      },
      white: {
        main: "#ffffff",
      },
      background: {
        default: mode === "dark" ? "#071017" : "#fcfcfc",
      },
    },
    typography: {
      fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    },
  });

export default theme;
