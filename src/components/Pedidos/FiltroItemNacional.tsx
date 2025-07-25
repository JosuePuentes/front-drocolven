import React, { useState } from "react";

type FiltroNacional = "todos" | "nacional" | "no_nacional";

interface ChipFiltroNacionalProps {
  onChange: (filtro: FiltroNacional) => void;
  initialFiltro?: FiltroNacional;
}

export const ChipFiltroNacional: React.FC<ChipFiltroNacionalProps> = ({ onChange, initialFiltro = "todos" }) => {
  const [filtro, setFiltro] = useState<FiltroNacional>(initialFiltro);

  const nextFiltro = (actual: FiltroNacional): FiltroNacional => {
    if (actual === "todos") return "nacional";
    if (actual === "nacional") return "no_nacional";
    return "todos";
  };

  const getLabel = (actual: FiltroNacional) => {
    if (actual === "todos") return "Todos";
    if (actual === "nacional") return "Nacional";
    return "Importado";
  };

  const handleClick = () => {
    const nuevo = nextFiltro(filtro);
    setFiltro(nuevo);
    onChange(nuevo);
  };

  return (
    <button
      type="button"
      className={`px-4 py-1 rounded-full text-sm font-medium border transition-colors duration-200 focus:outline-none
        ${filtro === "todos" ? "bg-gray-100 text-gray-700 border-gray-300" : ""}
        ${filtro === "nacional" ? "bg-green-100 text-green-700 border-green-400" : ""}
        ${filtro === "no_nacional" ? "bg-red-100 text-red-700 border-red-400" : ""}
      `}
      onClick={handleClick}
      aria-label={`Filtrar por: ${getLabel(filtro)}`}
    >
      {getLabel(filtro)}
    </button>
  );
};
