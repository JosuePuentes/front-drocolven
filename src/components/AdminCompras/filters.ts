// src/utils/filters.ts
export function filtrarPorMultiplesPalabrasAND<T>(data: T[], textoBusqueda: string, campos: string[]): T[] {
  const palabrasBusqueda = textoBusqueda.toLowerCase().split(" ").filter(Boolean);
  return data.filter((item) =>
    palabrasBusqueda.every((palabra) =>
      campos.some((campo) => {
        const valor = (item as any)?.[campo];
        return valor && String(valor).toLowerCase().includes(palabra);
      })
    )
  );
}