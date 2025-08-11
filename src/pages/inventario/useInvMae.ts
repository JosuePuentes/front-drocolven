
export interface ProductoMaestro {
  _id: string;
  codigo: string;
  descripcion: string;
  existencia: number;
  precio?: number;
  dpto?: string;
  nacional?: string;
  laboratorio?: string;
  fv?: string;
  descuento1?: number;
  descuento2?: number;
  descuento3?: number;
}

export async function fetchInventarioMaestro(): Promise<ProductoMaestro[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/inventario_maestro/`);
  if (!res.ok) throw new Error("Error al consultar inventario maestro");
  const data = await res.json();
  return data.inventario_maestro;
}

export async function updateInventarioMaestro(id: string, update: Partial<ProductoMaestro>): Promise<{ message: string; id: string; updated_fields: Partial<ProductoMaestro> }> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/inventario_maestro/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return await res.json();
}

export async function fetchProductoMaestro(id: string): Promise<ProductoMaestro> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/inventario_maestro/${id}`);
  if (!res.ok) throw new Error("Error al consultar producto maestro");
  const data = await res.json();
  return data.producto;
}

export async function subirInventarioMaestro(file: File): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/subir_inventario/`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al subir inventario maestro");
  return await res.json();
}
