import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { AuthContextProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient();

// if (process.env.NODE_ENV === "production") disableReactDevTools();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </QueryClientProvider>,
  document.getElementById("root")
);
