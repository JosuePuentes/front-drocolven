// src/utils/filters.ts
export function filtrarPorMultiplesPalabrasAND<T>(data: T[], textoBusqueda: string, campos: (keyof T)[]): T[] {
  const palabrasBusqueda = textoBusqueda.toLowerCase().split(" ").filter(Boolean);
  return data.filter((item) =>
    palabrasBusqueda.every((palabra) =>
      campos.some((campo) =>
        String(item[campo]).toLowerCase().includes(palabra)
      )
    )
  );
}