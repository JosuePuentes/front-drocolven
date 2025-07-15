import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePedido } from "../hooks/usePedido";
import { useAdminAuth } from "@/context/AuthAdminContext";

const FacturacionDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { admin } = useAdminAuth();
  const { pedido, setPedido, loading } = usePedido();

  useEffect(() => {
    if (id) {
      // Aquí deberías cargar el pedido por ID
      // fetchPedidoById();
    }
    return () => {
      setPedido(null);
    };
  }, [id, setPedido, admin]);

  if (loading && !pedido) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 text-gray-500 text-lg">
        <span className="loader" />
        <p>Cargando detalle de facturación...</p>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 text-gray-500 text-lg">
        <p>No se encontró el pedido.</p>
      </div>
    );
  }

  // Aquí puedes renderizar los detalles del pedido y las acciones de facturación
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Detalle de Facturación</h2>
      {/* Renderiza los datos del pedido aquí */}
      <div className="bg-white rounded-lg shadow p-6">
        <p>ID Pedido: {pedido._id}</p>
        <p>Cliente: {pedido.cliente || "-"}</p>
        <p>Estado: {pedido.estado}</p>
        {/* ...otros detalles relevantes... */}
      </div>
      {/* Acciones de facturación aquí */}
    </div>
  );
};

export default FacturacionDetalle;
