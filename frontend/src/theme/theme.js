import { createTheme } from "@mui/material/styles";

const theme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        light: "#b2e6d4",
        main: "#66ccaa",
      },
      secondary: {
        light: "#b2ebf8",
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
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            "::-webkit-scrollbar": {
              width: "12px",
              height: "12px",
            },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: mode === "dark" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
              borderRadius: "10px",
            },
            "::-webkit-scrollbar-track": {
              backgroundColor: mode === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
            },
            "::-webkit-scrollbar-thumb:hover": {
              backgroundColor: mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
            },
          },
        },
      },
    },
  });

export default theme;
