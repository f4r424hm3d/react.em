import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// ✅✅✅ YE 3 LINES ADD KARO - IMPORT KE NEECHE ✅✅✅
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")).render(
  <Router>
    <App />
  </Router>,
);
