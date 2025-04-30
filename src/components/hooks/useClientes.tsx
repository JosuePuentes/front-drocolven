import { useState, useEffect } from "react";

export interface ClienteResumen {
  id: string;
  email: string;
  rif: string;
  encargado: string;
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
        const res = await fetch("http://localhost:8000/api/clientes");
        const data = await res.json();

        const resumen = data.map((c: any) => ({
          id: c._id.$oid, // Convertir ObjectId a string
          email: c.email,
          rif: c.rif,
          encargado: c.encargado,
        }));

        setClientes(resumen);
      } catch (err) {
        console.error(err);
        setError("Error al obtener lista de clientes");
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
      const res = await fetch(`http://localhost:8000/api/clientes/${rif}`);
      const data = await res.json();

      const detalle: ClienteDetalle = {
        id: data._id.$oid, // Convertir ObjectId a string
        email: data.email,
        rif: data.rif,
        encargado: data.encargado,
        direccion: data.direccion,
        telefono: data.telefono,
        activo: data.activo,
        descuento1: data.descuento1,
        descuento2: data.descuento2,
        descuento3: data.descuento3,
      };
      setClienteSeleccionado(detalle);
    } catch (err) {
      console.error(err);
      setError("Error al obtener detalle de cliente");
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