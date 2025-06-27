import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export interface ReclamoCliente {
  _id?: string;
  pedido_id: string;
  rif: string;
  cliente: string;
  productos: Array<{
    id: string;
    descripcion: string;
    cantidad: number;
    motivo: string;
  }>;
  observacion: string;
  fecha?: string;
}

export const useReclamosCliente = () => {
  const { user } = useAuth();
  const [reclamos, setReclamos] = useState<ReclamoCliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchReclamos = async () => {
      if (!user?.rif) {
        setError("No se encontró un RIF válido para el usuario.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await axios.get<ReclamoCliente[]>(`${import.meta.env.VITE_API_URL}/reclamos/cliente/${user.rif}`);
        setReclamos(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || err.message || "Error al obtener reclamos");
      } finally {
        setLoading(false);
      }
    };
    fetchReclamos();
  }, [user]);

  return { reclamos, loading, error };
};
