import { useState, useCallback } from 'react';
// Importamos la función de la API y los tipos que necesita.
import { enviarTransaccionAPI, TransaccionPayload } from '../api/transacciones'; 

// Opcional pero recomendado: Define la estructura de la respuesta para mayor seguridad.
// Reemplaza 'any' por la estructura real que devuelve tu API en caso de éxito.
type TransaccionResponse = any;

/**
 * (CUSTOM HOOK)
 * Hook para gestionar el estado y la lógica de envío de una transacción.
 * Proporciona estados de carga/error y una función para ejecutar la petición.
 */
export const useEnviarTransaccion = () => {
  // Estado para la respuesta de la API
  const [data, setData] = useState<TransaccionResponse | null>(null);
  
  // Estado para saber si la petición está en curso
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estado para almacenar cualquier error
  const [error, setError] = useState<string | null>(null);

  /**
   * Función que el componente llamará para iniciar la transacción.
   * Usa `useCallback` para optimizar el rendimiento.
   */
  const ejecutar = useCallback(async (payload: TransaccionPayload) => {
    // 1. Reinicia los estados y activa la carga
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // 2. Llama a la función de servicio para hacer la petición
      const result = await enviarTransaccionAPI(payload);
      // 3. Si todo va bien, guarda el resultado
      setData(result);
      return result;
    } catch (err: any) {
      // 4. Si hay un error, guárdalo en el estado
      setError(err.message || 'Ocurrió un error inesperado.');
      // Opcional: relanzar el error si el componente necesita reaccionar a él
      throw err;
    } finally {
      // 5. Desactiva la carga al terminar (éxito o error)
      setIsLoading(false);
    }
  }, []); // El array vacío asegura que la función no se recree en cada render

  // El hook devuelve los estados y la función para ejecutar la acción
  return { ejecutar, data, isLoading, error };
};