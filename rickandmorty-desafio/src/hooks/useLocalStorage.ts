import { useEffect, useState } from "react";

export default function useLocalStorage<T>(
  chave: string,
  valorInicial: T
) {
  const [valor, setValor] = useState<T>(() => {
    const item = localStorage.getItem(chave);

    if (item) {
      return JSON.parse(item);
    }

    return valorInicial;
  });

  useEffect(() => {
    localStorage.setItem(
      chave,
      JSON.stringify(valor)
    );
  }, [chave, valor]);

  return [valor, setValor] as const;
}