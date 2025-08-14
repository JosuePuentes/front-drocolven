
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


// logica de transacciones
// Define la estructura de los datos que se envían a la API para mayor seguridad de tipos.
interface ProductoPayload {
  producto_codigo: string;
  cantidad: number;
}

export interface TransaccionPayload {
  tipo_movimiento: string;
  usuario: string;
  observaciones: string;
  documento_origen: string;
  productos: ProductoPayload[];
}

/**
 * Envía los datos de la transacción al backend.
 * @param payload - El cuerpo de la solicitud que se enviará a la API.
 * @returns La respuesta JSON del servidor si la solicitud es exitosa.
 * @throws Lanza un error con el mensaje del backend si la respuesta no es exitosa.
 */
export const useEnviarTransaccionAPI = async (payload: TransaccionPayload) => {
  // Construye la URL completa del endpoint.
  const apiUrl = `${import.meta.env.VITE_API_URL}/transaccion/transaccion`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // Si la respuesta del servidor no es 'ok' (ej: status 400, 404, 500),
    // lanzamos un error para que sea capturado en el componente.
    if (!response.ok) {
      throw new Error(result.detail || result.error || "Ocurrió un error en el servidor.");
    }

    // Si todo fue bien, devolvemos el resultado.
    return result;
  } catch (error) {
    // Si hay un error de red o al procesar la respuesta, lo relanzamos.
    // El 'error.message' será capturado en el 'catch' del componente.
    throw error;
  }
};
