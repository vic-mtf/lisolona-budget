import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: "dark",
          background: { default: "hsl(243, 100%, 4%)" },
        },
      })}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
