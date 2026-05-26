import type { FiltroStatus } from "../types/rickandmorty";

interface Props {
  statusAtual: FiltroStatus;
  onChange: (status: FiltroStatus) => void;
}

const status = [
  { label: "Todos", value: "all" },
  { label: "Alive", value: "alive" },
  { label: "Dead", value: "dead" },
  { label: "Unknown", value: "unknown" },
] as const;

export default function BotoesStatus({
  statusAtual,
  onChange,
}: Props) {
  return (
    <div className="botoes-status">
      {status.map((item) => (
        <button
          key={item.value}
          className={
            statusAtual === item.value
              ? "ativo"
              : ""
          }
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}