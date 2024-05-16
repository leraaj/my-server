import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/styles.css";
import { BrowserRouter } from "react-router-dom";
// Sonner
import { Toaster } from "sonner";
// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Toaster
          richColors
          position="bottom-left"
          toastOptions={{
            style: {
              position: "fixed",
              bottom: "30px",
              // top: "50px",
              left: "30px",
            },
          }}
        />
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
