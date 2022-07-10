import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ActionResultMessageProvider } from "./context/actionResultMessageContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <AuthContextProvider>
        <ActionResultMessageProvider>
          <App />
        </ActionResultMessageProvider>
      </AuthContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>,
);
