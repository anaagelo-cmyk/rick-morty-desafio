import { useEffect, useState } from "react";

export default function useDebounce<T>(
  valor: T,
  delay: number
) {
  const [valorDebounce, setValorDebounce] =
    useState(valor);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setValorDebounce(valor);
    }, delay);

    return () => clearTimeout(timeout);
  }, [valor, delay]);

  return valorDebounce;
}