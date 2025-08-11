import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AiOutlinePlus } from "react-icons/ai";
import { animate } from 'animejs';
import type { ProductoMaestro } from "./useInvMae";

interface CrearItemProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (item: ProductoMaestro) => void;
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

export const CrearItem: React.FC<CrearItemProps> = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState<Partial<ProductoMaestro>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Animación de entrada del modal
  // Se ejecuta cada vez que el modal se abre
  // El ref se asigna al contenido del modal
  const handleAnimation = (node: HTMLDivElement | null) => {
    if (node) {
      animate(node, {
        opacity: [{ value: 0, duration: 0 }, { value: 1, duration: 400, ease: 'easeOutQuad' }],
        y: [{ value: 40, duration: 0 }, { value: 0, duration: 400, ease: 'easeOutQuad' }]
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Aquí deberías llamar a tu endpoint para crear el item en la base de datos.
      // Ejemplo:
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/inventario_maestro/`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      // if (!res.ok) throw new Error("Error al crear producto");
      // const data = await res.json();
      // if (onCreated) onCreated(data.producto);

      // Simulación de éxito local
      toast.success("Producto creado correctamente.");
      if (onCreated) onCreated({ ...(form as ProductoMaestro), _id: "nuevo" });
      setForm({});
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        ref={handleAnimation}
        className="h-[95vh] w-full max-w-xl bg-white overflow-auto rounded-xl shadow-lg"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <AiOutlinePlus className="w-6 h-6 text-black" />
            Agregar Producto
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-2">
          {campos.map(campo => (
            <div key={campo.name} className="flex flex-col">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor={campo.name}
              >
                {campo.label}
              </label>
              <Input
                id={campo.name}
                name={campo.name}
                type={campo.type}
                value={form[campo.name as keyof ProductoMaestro] ?? ""}
                onChange={handleChange}
                disabled={loading}
                className="w-full"
                autoComplete="off"
              />
            </div>
          ))}
          <div className="sm:col-span-2 mt-4">
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-900 transition-colors"
                disabled={loading}
              >
                Guardar producto
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CrearItem;