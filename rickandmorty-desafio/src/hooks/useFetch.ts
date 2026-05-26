import { useEffect, useState } from "react";

export default function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(
    null
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);

        setError("");

        const resposta = await fetch(url, {
          signal: controller.signal,
        });

        if (!resposta.ok) {
          throw new Error("Erro na requisição");
        }

        const dados = await resposta.json();

        setData(dados);
      } catch (erro) {
        if (erro instanceof Error) {
          if (erro.name !== "AbortError") {
            setError(erro.message);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, [url]);

  return {
    data,
    loading,
    error,
  };
}