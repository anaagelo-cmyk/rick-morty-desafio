import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import useLocalStorage from "../hooks/useLocalStorage";

type Tema = "claro" | "escuro";

interface TemaContextProps {
  tema: Tema;
  alternarTema: () => void;
}

const TemaContext =
  createContext<TemaContextProps | null>(null);

export function TemaProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tema, setTema] =
    useLocalStorage<Tema>("tema", "escuro");

  function alternarTema() {
    setTema((temaAtual) =>
      temaAtual === "escuro" ? "claro" : "escuro"
    );
  }

  return (
    <TemaContext.Provider
      value={{
        tema,
        alternarTema,
      }}
    >
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const context = useContext(TemaContext);

  if (!context) {
    throw new Error(
      "useTema precisa estar dentro do TemaProvider"
    );
  }

  return context;
}