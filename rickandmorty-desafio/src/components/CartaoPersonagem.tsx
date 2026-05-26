import { memo } from "react";

import type { Personagem } from "../types/rickandmorty";

import { useFavoritos } from "../contexts/FavoritosContext";

interface Props {
  personagem: Personagem;
  onClick: (id: number) => void;
}

function CartaoPersonagem({
  personagem,
  onClick,
}: Props) {
  const {
    favoritoExiste,
    toggleFavorito,
  } = useFavoritos();

  const favorito = favoritoExiste(
    personagem.id
  );

  return (
    <div
      className={`card ${
        favorito ? "favorito" : ""
      }`}
      onClick={() => onClick(personagem.id)}
    >
      <button
        className="favorito-btn"
        onClick={(e) => {
          e.stopPropagation();

          toggleFavorito(personagem.id);
        }}
      >
        {favorito ? "❤️" : "🤍"}
      </button>

      <img
        src={personagem.image}
        alt={personagem.name}
      />

      <div className="card-info">
        <h3>{personagem.name}</h3>

        <p>{personagem.species}</p>

        <span
          className={`badge ${personagem.status.toLowerCase()}`}
        >
          {personagem.status}
        </span>
      </div>
    </div>
  );
}

export default memo(CartaoPersonagem);