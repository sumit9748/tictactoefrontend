import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { AuthContextProvider } from "./context/AuthContext";

if (process.env.NODE_ENV === "production") disableReactDevTools();

ReactDOM.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  document.getElementById("root")
);
