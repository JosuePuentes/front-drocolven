import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pedido } from '@/pages/client/componentsClient/PedidoTypes';
import { useAuth } from '@/context/AuthContext';

export const usePedidosCliente = () => {
  const { user, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!user || !isAuthenticated) {
        setError('Debes iniciar sesión para ver tus pedidos.');
        setLoading(false);
        return;
      }
      if (!user.rif || typeof user.rif !== 'string' || user.rif.trim() === '') {
        setError('No se encontró un RIF válido en tu perfil.');
        setLoading(false);
        return;
      }
      setError('');
      setLoading(true);
      try {
        const res = await axios.get<Pedido[]>(`${import.meta.env.VITE_API_URL}/pedidos/por_cliente/${user.rif}`);
        if (Array.isArray(res.data)) {
          setPedidos(res.data);
        } else {
          setError('Respuesta inesperada del servidor.');
        }
      } catch (err: any) {
        let errorMessage = 'No se pudieron cargar los pedidos. Intenta nuevamente.';
        if (axios.isAxiosError(err)) {
          if (err.response) {
            if (err.response.status === 404) {
              errorMessage = 'No se encontraron pedidos para tu RIF.';
            } else if (err.response.data && err.response.data.detail) {
              errorMessage = `Error: ${err.response.data.detail}`;
            } else {
              errorMessage = `Error del servidor: ${err.response.status}`;
            }
          } else if (err.request) {
            errorMessage = 'Error de red: No se pudo conectar al servidor.';
          } else {
            errorMessage = `Error: ${err.message}`;
          }
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [isAuthenticated, user]);

  return { pedidos, loading, error };
};
