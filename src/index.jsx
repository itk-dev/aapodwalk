import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ApiEndpointContext from "./context/api-endpoint-context";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApiEndpointContext.Provider
        value={{
          url:
            import.meta.env.VITE_APP_API_BASE +
            import.meta.env.VITE_APP_API_ROUTE,
          fileUrl: import.meta.env.VITE_APP_API_BASE,
          token: import.meta.env.VITE_APP_TOKEN,
        }}
      >
        <App />
      </ApiEndpointContext.Provider>
    </BrowserRouter>
  </React.StrictMode>
);
