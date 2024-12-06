import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);