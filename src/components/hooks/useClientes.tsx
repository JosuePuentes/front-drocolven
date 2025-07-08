import { useState, useEffect } from "react";

export interface ClienteResumen {
  id: string;
  email: string;
  rif: string;
  encargado: string;
  descuento1?: number; // Opcional, puede no estar en el resumen
}

export interface ClienteDetalle extends ClienteResumen {
  direccion: string;
  telefono: string;
  activo: boolean;
  descuento1: number;
  descuento2: number;
  descuento3: number;
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<ClienteResumen[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteDetalle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch listado de clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/clientes`);
        const json = await res.json();
        const resumen = json.map((c: any) => ({
          id: c._id?.$oid || c._id, // Manejar tanto ObjectId como string
          email: c.email || '',
          rif: c.rif || '',
          encargado: c.encargado || '',
        }));

        setClientes(resumen);
      } catch (err) {
        console.error(err);
        setError("Error al obtener lista de clientes");
        setClientes([]); // Establecer array vacío en caso de error
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  // Fetch detalle del cliente seleccionado
  const seleccionarCliente = async (rif: string) => {
    if (!rif) {
      setClienteSeleccionado(null);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clientes/${rif}`);
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (!data || data.error) {
        throw new Error(data?.error || 'No se encontraron datos del cliente');
      }

      const detalle: ClienteDetalle = {
        id: data._id || '',
        email: data.email || '',
        rif: data.rif || '',
        encargado: data.encargado || '',
        direccion: data.direccion || '',
        telefono: data.telefono || '',
        activo: data.activo || false,
        descuento1: Number(data.descuento1?.$numberDouble ?? data.descuento1) || 0,
        descuento2: Number(data.descuento2?.$numberDouble ?? data.descuento2) || 0,
        descuento3: Number(data.descuento3?.$numberDouble ?? data.descuento3) || 0,
      };
      setClienteSeleccionado(detalle);
    } catch (err) {
      console.error('Error al obtener detalle de cliente:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener detalle de cliente');
      setClienteSeleccionado(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    clientes,
    clienteSeleccionado,
    seleccionarCliente,
    loading,
    error,
  };
};