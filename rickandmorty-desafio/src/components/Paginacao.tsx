interface Props {
  paginaAtual: number;
  totalPaginas: number;
  onAnterior: () => void;
  onProxima: () => void;
}

export default function Paginacao({
  paginaAtual,
  totalPaginas,
  onAnterior,
  onProxima,
}: Props) {
  return (
    <div className="paginacao">
      <span>
        Página {paginaAtual} de {totalPaginas}
      </span>

      <div>
        <button
          onClick={onAnterior}
          disabled={paginaAtual === 1}
        >
          ← Anterior
        </button>

        <button
          onClick={onProxima}
          disabled={
            paginaAtual === totalPaginas
          }
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}