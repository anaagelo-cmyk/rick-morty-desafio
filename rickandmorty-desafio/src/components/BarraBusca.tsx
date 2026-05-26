interface Props {
  valor: string;
  onChange: (valor: string) => void;
}

export default function BarraBusca({
  valor,
  onChange,
}: Props) {
  return (
    <input
      className="busca"
      type="text"
      placeholder="🔍 Buscar por nome..."
      value={valor}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}