import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "sonner";
import { animate } from "animejs";

interface ProductoCargo {
  producto_codigo: string;
  cantidad: number;
}


const IngresoMercancia: React.FC = () => {
  const [productos, setProductos] = useState<ProductoCargo[]>([]);
  const [codigo, setCodigo] = useState<string>("");
  const [cantidad, setCantidad] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddProducto = () => {
    if (!codigo || !cantidad || isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      toast.warning("Código y cantidad válidos requeridos.");
      return;
    }
    setProductos([...productos, { producto_codigo: codigo, cantidad: Number(cantidad) }]);
    setCodigo("");
    setCantidad("");
    animate("#input-codigo", { scale: [1, 1.1, 1], duration: 350, ease: "outCubic" });
  };

  const handleSubmit = async () => {
    if (productos.length === 0) {
      toast.error("Agrega al menos un producto.");
      return;
    }
    setLoading(true);
    try {
      const body = {
        tipo_movimiento: "CARGO",
        usuario: "admin", // Reemplazar por usuario real si hay contexto
        observaciones,
        productos,
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/transaccion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error al ingresar mercancía");
      toast.success("Ingreso registrado correctamente.");
      setProductos([]);
      setObservaciones("");
    } catch (error: any) {
      toast.error(error.message || "Error al ingresar mercancía");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-sm mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Ingreso de Mercancía</h2>
      <div className="flex gap-2 mb-4">
        <Input
          id="input-codigo"
          placeholder="Código de producto"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          className="w-1/2"
        />
        <Input
          placeholder="Cantidad"
          type="number"
          min={1}
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
          className="w-1/3"
        />
        <Button variant="outline" onClick={handleAddProducto} disabled={loading}>
          <AiOutlinePlusCircle className="mr-1" /> Agregar
        </Button>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Observaciones (opcional)"
          value={observaciones}
          onChange={e => setObservaciones(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Productos a ingresar:</h3>
        <ul className="space-y-1">
          {productos.map((prod, idx) => (
            <li key={idx} className="flex justify-between items-center bg-gray-50 rounded px-2 py-1">
              <span className="font-mono text-gray-700">{prod.producto_codigo}</span>
              <span className="font-bold text-green-700">x{prod.cantidad}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button className="w-full bg-black text-white" onClick={handleSubmit} disabled={loading}>
        Registrar ingreso
      </Button>
    </div>
  );
};

export default IngresoMercancia;
