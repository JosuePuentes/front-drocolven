import { useState } from 'react';

export interface NuevoPedido {
  cliente: string; // RIF o ID del cliente
  usuario: string;
  productos: ProductoPedido[];
  // Agrega más campos según sea necesario
}

export interface ProductoPedido {
  productoId: string;
  cantidad: number;
  // Puedes agregar más campos si lo requiere el backend
}

export interface PedidoResponse {
  _id?: string;
  cliente: string;
  usuario: string;
  productos: ProductoPedido[];
  // Agrega más campos según la respuesta del backend
}

export interface ProductoInventario {
  _id: string;
  nombre: string;
  stock: number;
  precio: number;
  // Agrega más campos según la estructura de tu inventario
}

export function useNuevoPedido() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<PedidoResponse | null>(null);
  const [pedido, setPedido] = useState<PedidoResponse | null>(null);
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [inventario, setInventario] = useState<ProductoInventario[]>([]);
  const [loadingInventario, setLoadingInventario] = useState(false);
  const [errorInventario, setErrorInventario] = useState<string | null>(null);

  // Crear un nuevo pedido
  const createPedido = async (nuevo: NuevoPedido) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setData(null);
    try {
      const res = await fetch('/api/pedidos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo),
      });
      if (!res.ok) {
        const err = await res.json();
        console.log('Error al crear pedido:', err);
        throw new Error(err.detail || 'Error al crear el pedido');
      }
      const result = await res.json();
      console.log('Pedido creado:', result);
      setData(result);
      setSuccess(true);
      return result;
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener un pedido por ID
  const getPedido = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pedidos/${id}`);
      if (!res.ok) {
        const err = await res.json();
        console.log('Error al obtener pedido:', err);
        throw new Error(err.detail || 'No se pudo obtener el pedido');
      }
      const result = await res.json();
      console.log('Pedido obtenido:', result);
      setPedido(result);
      return result;
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
      setPedido(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Listar pedidos recientes
  const getPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pedidos/');
      if (!res.ok) {
        const err = await res.json();
        console.log('Error al obtener lista de pedidos:', err);
        throw new Error(err.detail || 'No se pudo obtener la lista de pedidos');
      }
      const result = await res.json();
      console.log('Lista de pedidos:', result);
      setPedidos(result);
      return result;
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
      setPedidos([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Consultar inventario de productos
  const getInventario = async () => {
    setLoadingInventario(true);
    setErrorInventario(null);
    try {
      const res = await fetch('/api/inventario/');
      if (!res.ok) {
        const err = await res.json();
        console.log('Error al obtener inventario:', err);
        throw new Error(err.detail || 'No se pudo obtener el inventario');
      }
      const result = await res.json();
      console.log('Inventario:', result);
      setInventario(result);
      return result;
    } catch (e: any) {
      setErrorInventario(e.message || 'Error desconocido');
      setInventario([]);
      return null;
    } finally {
      setLoadingInventario(false);
    }
  };

  // Resetear estados internos
  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setData(null);
    setPedido(null);
    setPedidos([]);
    setInventario([]);
    setLoadingInventario(false);
    setErrorInventario(null);
  };

  return {
    createPedido,
    getPedido,
    getPedidos,
    getInventario,
    reset,
    loading,
    error,
    success,
    data,
    pedido,
    pedidos,
    inventario,
    loadingInventario,
    errorInventario,
  };
}
