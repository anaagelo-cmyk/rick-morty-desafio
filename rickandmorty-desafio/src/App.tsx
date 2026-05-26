import { useEffect, useState } from "react";
import "./App.css";

import CartaoPersonagem from "./components/CartaoPersonagem";
import BarraBusca from "./components/BarraBusca";
import BotoesStatus from "./components/BotoesStatus";
import Paginacao from "./components/Paginacao";

import { useFavoritos } from "./contexts/FavoritosContext";

import type {
  FiltroStatus,
  Personagem,
  RespostaAPI,
} from "./types/rickandmorty";

export default function App() {
  const { favoritos } = useFavoritos();

  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busca, setBusca] = useState("");
  const [buscaDebounce, setBuscaDebounce] = useState("");
  const [status, setStatus] = useState<FiltroStatus>("all");

  const [personagemSelecionado, setPersonagemSelecionado] =
    useState<Personagem | null>(null);

  const [modalAberto, setModalAberto] = useState(false);

  async function buscarPersonagens(): Promise<void> {
    try {
      setLoading(true);
      setErro("");

      let url = `https://rickandmortyapi.com/api/character?page=${pagina}`;

      if (status !== "all") {
        url += `&status=${status}`;
      }

      const resposta = await fetch(url);

      if (!resposta.ok) {
        throw new Error("Erro ao buscar personagens");
      }

      const dados: RespostaAPI = await resposta.json();

      setPersonagens(dados.results);
      setTotalPaginas(dados.info.pages);
    } catch {
      setErro("Não foi possível carregar os personagens.");
      setPersonagens([]);
    } finally {
      setLoading(false);
    }
  }

  async function abrirDetalhes(id: number): Promise<void> {
    try {
      const resposta = await fetch(
        `https://rickandmortyapi.com/api/character/${id}`
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar detalhes");
      }

      const dados: Personagem = await resposta.json();

      setPersonagemSelecionado(dados);
      setModalAberto(true);
    } catch {
      setErro("Não foi possível carregar os detalhes do personagem.");
    }
  }

  function fecharModal() {
    setModalAberto(false);
    setPersonagemSelecionado(null);
  }

  function mudarStatus(novoStatus: FiltroStatus) {
    setStatus(novoStatus);
    setPagina(1);
  }

  useEffect(() => {
    buscarPersonagens();
  }, [pagina, status]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBuscaDebounce(busca);
    }, 400);

    return () => clearTimeout(timeout);
  }, [busca]);

  const personagensFiltrados = personagens.filter((personagem) =>
    personagem.name.toLowerCase().includes(buscaDebounce.toLowerCase())
  );

  return (
    <main className="container">
      <div className="topo">
        <div>
          <h1>🧬 Painel de Personagens</h1>

          <p className="subtitulo">
            Dados consumidos da Rick and Morty API
          </p>
        </div>

        <div className="contador-favoritos">
          💗 {favoritos.length} favoritos
        </div>
      </div>

      <div className="controles">
        <BarraBusca valor={busca} onChange={setBusca} />

        <BotoesStatus statusAtual={status} onChange={mudarStatus} />
      </div>

      {loading && <p className="mensagem">Carregando...</p>}

      {erro && <p className="erro">{erro}</p>}

      {!loading && !erro && (
        <section className="grid">
          {personagensFiltrados.map((personagem) => (
            <CartaoPersonagem
              key={personagem.id}
              personagem={personagem}
              onClick={abrirDetalhes}
            />
          ))}
        </section>
      )}

      {!loading && !erro && (
        <Paginacao
          paginaAtual={pagina}
          totalPaginas={totalPaginas}
          onAnterior={() => setPagina(pagina - 1)}
          onProxima={() => setPagina(pagina + 1)}
        />
      )}

      {modalAberto && personagemSelecionado && (
        <div className="modal-fundo" onClick={fecharModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="fechar" onClick={fecharModal}>
              ×
            </button>

            <img
              src={personagemSelecionado.image}
              alt={personagemSelecionado.name}
            />

            <h2>{personagemSelecionado.name}</h2>

            <p>
              <strong>Status:</strong> {personagemSelecionado.status}
            </p>

            <p>
              <strong>Espécie:</strong> {personagemSelecionado.species}
            </p>

            <p>
              <strong>Origem:</strong> {personagemSelecionado.origin.name}
            </p>

            <p>
              <strong>Localização:</strong>{" "}
              {personagemSelecionado.location.name}
            </p>

            <p>
              <strong>Episódios:</strong>{" "}
              {personagemSelecionado.episode.length}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}