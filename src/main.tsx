import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { LanguageProvider } from "./i18n";
import "./index.css";

const basePath = import.meta.env.BASE_URL;

if (basePath !== "/" && window.location.pathname === "/") {
  window.location.replace(basePath);
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find root element");
}

createRoot(container).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
