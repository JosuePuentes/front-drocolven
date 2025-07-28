
import { useEffect, useState } from 'react';

export interface Pedido {
  _id: string;
  cliente?: string;
  rif?: string;
  fecha?: string;
  total?: number;
  estado?: string;
  [key: string]: any;
}

export function useCheckPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/checkpicking/`);
        if (!res.ok) throw new Error('Error al obtener pedidos');
        const data = await res.json();
        setPedidos(data);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  // Actualiza productos y estado del pedido (checkpicking -> packing)
  async function actualizarPedidoCheckPicking(pedidoId: string, productos: any[]) {
    // Actualizar productos
    const resProd = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar/${pedidoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productos }),
    });
    if (!resProd.ok) {
      const err = await resProd.json();
      throw new Error(err.detail || 'Error al actualizar productos');
    }
    // Cambiar estado a packing
    const resEstado = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar_estado/${pedidoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevo_estado: 'packing' }),
    });
    if (!resEstado.ok) {
      const err = await resEstado.json();
      throw new Error(err.detail || 'Error al actualizar estado');
    }
    return true;
  }

  return { pedidos, loading, error, actualizarPedidoCheckPicking };
}
