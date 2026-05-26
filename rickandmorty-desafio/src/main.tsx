import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./App.css";

import App from "./App";

import { FavoritosProvider } from "./contexts/FavoritosContext";

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <FavoritosProvider>
      <App />
    </FavoritosProvider>
  </StrictMode>
);