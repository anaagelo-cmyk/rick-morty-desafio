import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import useLocalStorage from "../hooks/useLocalStorage";

interface FavoritosContextProps {
  favoritos: number[];
  toggleFavorito: (id: number) => void;
  favoritoExiste: (id: number) => boolean;
}

const FavoritosContext =
  createContext<FavoritosContextProps | null>(null);

export function FavoritosProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [favoritos, setFavoritos] =
    useLocalStorage<number[]>("favoritos", []);

  function toggleFavorito(id: number) {
    setFavoritos((estadoAtual) => {
      if (estadoAtual.includes(id)) {
        return estadoAtual.filter(
          (favorito) => favorito !== id
        );
      }

      return [...estadoAtual, id];
    });
  }

  function favoritoExiste(id: number) {
    return favoritos.includes(id);
  }

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        toggleFavorito,
        favoritoExiste,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const context = useContext(FavoritosContext);

  if (!context) {
    throw new Error(
      "useFavoritos precisa estar dentro do FavoritosProvider"
    );
  }

  return context;
}