// Define la estructura de los datos que se envían a la API.
export interface ProductoPayload {
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
 * (FUNCIÓN DE SERVICIO)
 * Envía los datos de la transacción al backend.
 * Esta función solo se encarga de la comunicación con la API.
 * @param payload - El cuerpo de la solicitud que se enviará.
 * @returns La respuesta JSON del servidor.
 * @throws Lanza un error si la respuesta no es exitosa.
 */
export const enviarTransaccionAPI = async (payload: TransaccionPayload) => {
  const apiUrl = `${import.meta.env.VITE_API_URL}/transaccion/transaccion`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || result.error || "Ocurrió un error en el servidor.");
    }
    
    return result;
  } catch (error) {
    // Relanza el error para que sea capturado por quien llame a esta función (el hook).
    throw error;
  }
};