import { useState } from "react";
import { CssBaseline, ThemeProvider, IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import "./App.css";
import theme from "./theme/theme";
import List from "./list";
import { SnackbarProvider } from "./context/SnackbarContext";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [mode, setMode] = useState("light"); // Armazena o estado do tema (light/dark)

  const handleThemeToggle = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light")); // Alterna o tema
  };

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme(mode)}>
        <SnackbarProvider>
          <CssBaseline />
          <div className="App">
            <div className="App-content">
              <Tooltip title={mode === "light" ? "Alternar para modo escuro" : "Alterar para modo claro"}>
                <IconButton
                  onClick={handleThemeToggle}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    zIndex: 10,
                  }}
                >
                  {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
              </Tooltip>
              <List />
            </div>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
