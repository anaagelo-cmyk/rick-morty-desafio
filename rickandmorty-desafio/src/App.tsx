import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import "./App.css";

import CartaoPersonagem from "./components/CartaoPersonagem";
import BarraBusca from "./components/BarraBusca";
import BotoesStatus from "./components/BotoesStatus";
import Paginacao from "./components/Paginacao";

import { useFavoritos } from "./contexts/FavoritosContext";
import { useTema } from "./contexts/TemaContext";

import type {
  FiltroStatus,
  Personagem,
  RespostaAPI,
} from "./types/rickandmorty";

type AbaAtiva = "todos" | "favoritos";

export default function App() {
  const { favoritos } = useFavoritos();
  const { tema, alternarTema } = useTema();

  const [personagens, setPersonagens] =
    useState<Personagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busca, setBusca] = useState("");
  const [buscaDebounce, setBuscaDebounce] =
    useState("");
  const [status, setStatus] =
    useState<FiltroStatus>("all");
  const [abaAtiva, setAbaAtiva] =
    useState<AbaAtiva>("todos");

  const [
    personagemSelecionado,
    setPersonagemSelecionado,
  ] = useState<Personagem | null>(null);

  const [modalAberto, setModalAberto] =
    useState(false);

  async function buscarPersonagens(): Promise<void> {
    try {
      setLoading(true);
      setErro("");

      let url = "";

      if (
        abaAtiva === "favoritos" &&
        favoritos.length > 0
      ) {
        url = `https://rickandmortyapi.com/api/character/${favoritos.join(
          ","
        )}`;
      } else {
        url = `https://rickandmortyapi.com/api/character?page=${pagina}`;

        if (status !== "all") {
          url += `&status=${status}`;
        }
      }

      if (
        abaAtiva === "favoritos" &&
        favoritos.length === 0
      ) {
        setPersonagens([]);
        setTotalPaginas(1);
        return;
      }

      const resposta = await fetch(url);

      if (!resposta.ok) {
        throw new Error("Erro ao buscar personagens");
      }

      const dados = await resposta.json();

      if (Array.isArray(dados)) {
        setPersonagens(dados);
        setTotalPaginas(1);
      } else {
        const respostaApi: RespostaAPI = dados;
        setPersonagens(respostaApi.results);
        setTotalPaginas(respostaApi.info.pages);
      }
    } catch {
      setErro(
        "Não foi possível carregar os personagens."
      );
      setPersonagens([]);
    } finally {
      setLoading(false);
    }
  }

  async function abrirDetalhes(
    id: number
  ): Promise<void> {
    try {
      const resposta = await fetch(
        `https://rickandmortyapi.com/api/character/${id}`
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar detalhes");
      }

      const dados: Personagem =
        await resposta.json();

      setPersonagemSelecionado(dados);
      setModalAberto(true);
    } catch {
      setErro(
        "Não foi possível carregar os detalhes do personagem."
      );
    }
  }

  function fecharModal() {
    setModalAberto(false);
    setPersonagemSelecionado(null);
  }

  const handleFiltroChange = useCallback(
    (novoStatus: FiltroStatus) => {
      console.log("Filtro mudou:", novoStatus);

      setStatus(novoStatus);
      setPagina(1);
      setAbaAtiva("todos");
    },
    []
  );

  useEffect(() => {
    buscarPersonagens();
  }, [pagina, status, abaAtiva, favoritos]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBuscaDebounce(busca);
    }, 400);

    return () => clearTimeout(timeout);
  }, [busca]);

  const personagensFiltrados = useMemo(() => {
    return personagens.filter((personagem) =>
      personagem.name
        .toLowerCase()
        .includes(
          buscaDebounce.toLowerCase()
        )
    );
  }, [personagens, buscaDebounce]);

  return (
    <main className={`container tema-${tema}`}>
      <div className="topo">
        <div>
          <h1>🧬 Painel de Personagens</h1>

          <p className="subtitulo">
            Rick and Morty API · useFetch +
            useDebounce + Context
          </p>
        </div>

        <div className="acoes-topo">
          <button
            className="tema-btn"
            onClick={alternarTema}
          >
            {tema === "escuro" ? "☀️ Claro" : "🌙 Escuro"}
          </button>

          <div className="contador-favoritos">
            💗 {favoritos.length} favoritos
          </div>
        </div>
      </div>

      <div className="abas">
        <button
          className={
            abaAtiva === "todos" ? "ativo" : ""
          }
          onClick={() => setAbaAtiva("todos")}
        >
          Todos
        </button>

        <button
          className={
            abaAtiva === "favoritos" ? "ativo" : ""
          }
          onClick={() => {
            setAbaAtiva("favoritos");
            setPagina(1);
          }}
        >
          Meus Favoritos
        </button>
      </div>

      <div className="controles">
        <BarraBusca
          valor={busca}
          onChange={setBusca}
        />

        {abaAtiva === "todos" && (
          <BotoesStatus
            statusAtual={status}
            onChange={handleFiltroChange}
          />
        )}
      </div>

      {loading && (
        <p className="mensagem">
          Carregando...
        </p>
      )}

      {erro && <p className="erro">{erro}</p>}

      {!loading &&
        !erro &&
        personagensFiltrados.length === 0 && (
          <p className="mensagem">
            Nenhum personagem encontrado.
          </p>
        )}

      {!loading && !erro && (
        <section className="grid">
          {personagensFiltrados.map(
            (personagem) => (
              <CartaoPersonagem
                key={personagem.id}
                personagem={personagem}
                onClick={abrirDetalhes}
              />
            )
          )}
        </section>
      )}

      {!loading &&
        !erro &&
        abaAtiva === "todos" && (
          <Paginacao
            paginaAtual={pagina}
            totalPaginas={totalPaginas}
            onAnterior={() =>
              setPagina(pagina - 1)
            }
            onProxima={() =>
              setPagina(pagina + 1)
            }
          />
        )}

      {modalAberto &&
        personagemSelecionado && (
          <div
            className="modal-fundo"
            onClick={fecharModal}
          >
            <div
              className="modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <button
                className="fechar"
                onClick={fecharModal}
              >
                ×
              </button>

              <img
                src={
                  personagemSelecionado.image
                }
                alt={
                  personagemSelecionado.name
                }
              />

              <h2>
                {
                  personagemSelecionado.name
                }
              </h2>

              <p>
                <strong>Status:</strong>{" "}
                {
                  personagemSelecionado.status
                }
              </p>

              <p>
                <strong>Espécie:</strong>{" "}
                {
                  personagemSelecionado.species
                }
              </p>

              <p>
                <strong>Origem:</strong>{" "}
                {
                  personagemSelecionado.origin
                    .name
                }
              </p>

              <p>
                <strong>
                  Localização:
                </strong>{" "}
                {
                  personagemSelecionado
                    .location.name
                }
              </p>

              <p>
                <strong>
                  Episódios:
                </strong>{" "}
                {
                  personagemSelecionado
                    .episode.length
                }
              </p>
            </div>
          </div>
        )}
    </main>
  );
}