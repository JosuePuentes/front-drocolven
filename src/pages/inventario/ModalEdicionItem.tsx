import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateInventarioMaestro, ProductoMaestro, fetchProductoMaestro } from "./useInvMae";

interface ModalEdicionItemProps {
  open: boolean;
  onClose: () => void;
  productoId: string | null;
  onUpdated?: (updated: ProductoMaestro) => void;
}

const campos = [
  { name: "codigo", label: "Código", type: "text" },
  { name: "descripcion", label: "Descripción", type: "text" },
  { name: "existencia", label: "Existencia", type: "number" },
  { name: "precio", label: "Precio", type: "number" },
  { name: "dpto", label: "Departamento", type: "text" },
  { name: "nacional", label: "Nacional", type: "text" },
  { name: "laboratorio", label: "Laboratorio", type: "text" },
  { name: "fv", label: "Fecha Vencimiento", type: "text" },
  { name: "descuento1", label: "Descuento 1", type: "number" },
  { name: "descuento2", label: "Descuento 2", type: "number" },
  { name: "descuento3", label: "Descuento 3", type: "number" },
];

export const ModalEdicionItem: React.FC<ModalEdicionItemProps> = ({ open, onClose, productoId, onUpdated }) => {
  const [form, setForm] = useState<Partial<ProductoMaestro>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && productoId) {
      setLoading(true);
      fetchProductoMaestro(productoId)
        .then(producto => {
          setForm(producto);
        })
        .catch(() => toast.error("Error al cargar producto"))
        .finally(() => setLoading(false));
    } else {
      setForm({});
    }
  }, [open, productoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoId) return;
    setLoading(true);
    try {
      await updateInventarioMaestro(productoId, form);
      toast.success("Producto actualizado correctamente.");
      if (onUpdated) onUpdated({ ...(form as ProductoMaestro), _id: productoId });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-[95vh] w-full bg-white overflow-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {campos.map(campo => (
            <div key={campo.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={campo.name}>{campo.label}</label>
              <Input
                id={campo.name}
                name={campo.name}
                type={campo.type}
                value={form[campo.name as keyof ProductoMaestro] ?? ""}
                onChange={handleChange}
                disabled={loading}
                className="w-full"
              />
            </div>
          ))}
          <DialogFooter>
            <Button type="submit" className="w-full bg-black text-white" disabled={loading}>Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEdicionItem;
