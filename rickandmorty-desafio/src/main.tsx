import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./App.css";

import App from "./App";

import { FavoritosProvider } from "./contexts/FavoritosContext";
import { TemaProvider } from "./contexts/TemaContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TemaProvider>
      <FavoritosProvider>
        <App />
      </FavoritosProvider>
    </TemaProvider>
  </StrictMode>
);