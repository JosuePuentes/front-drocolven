import { useState, useEffect } from "react";
import { fetchInventarioMaestro, ProductoMaestro } from "./useInvMae";
import ModalEdicionItem from "./ModalEdicionItem";
import { Button } from "@/components/ui/button";
import { AiOutlineEdit } from "react-icons/ai";
import { toast } from "sonner";
import { animate } from "animejs";

const ModificarInventario: React.FC = () => {
  const [productos, setProductos] = useState<ProductoMaestro[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const data = await fetchInventarioMaestro();
        setProductos(data);
      } catch (error: any) {
        toast.error(error.message || "Error al cargar inventario");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const handleEdit = (prod: ProductoMaestro) => {
    setEditId(prod._id);
    setModalOpen(true);
    animate(`#row-${prod._id}`, { scale: [1, 1.05, 1], duration: 400, ease: "outCubic" });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const handleModalUpdated = (updated: ProductoMaestro) => {
    setProductos(prev => prev.map(p => p._id === updated._id ? updated : p));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Modificar Inventario Maestro</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Código</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Existencia</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod._id} id={`row-${prod._id}`} className="border-b">
                <td className="p-2 font-mono text-xs">{prod.codigo}</td>
                <td className="p-2 text-gray-700">{prod.descripcion}</td>
                <td className="p-2">
                  <span>{prod.existencia}</span>
                </td>
                <td className="p-2">
                  <span>{prod.precio}</span>
                </td>
                <td className="p-2">
                  <Button variant="ghost" onClick={() => handleEdit(prod)} disabled={loading}>
                    <AiOutlineEdit className="w-5 h-5 text-gray-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalEdicionItem
        open={modalOpen}
        onClose={handleModalClose}
        productoId={editId}
        onUpdated={handleModalUpdated}
      />
    </div>
  );
};

export default ModificarInventario;
