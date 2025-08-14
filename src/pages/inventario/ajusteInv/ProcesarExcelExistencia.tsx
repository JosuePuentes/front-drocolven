import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineUpload } from "react-icons/ai";

// (Tu interfaz ItemExistencia no necesita cambios)
interface ItemExistencia {
  codigo: string;
  existencia: number;
}

const ProcesarExcelExistencia: React.FC = () => {
  const [items, setItems] = useState<ItemExistencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el envío
  const [tipoOperacion, setTipoOperacion] = useState<string>("seleccion");
  const [usuario, setUsuario] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser)._id || "");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(Boolean);
        // Suponiendo encabezado: codigo;existencia
        const rows = lines.slice(1).map(line => line.split(";"));
        const parsed: ItemExistencia[] = rows
          .filter(row => row[0] && row[1]) // Filtra filas que no tengan ambos valores
          .map(row => ({
            codigo: row[0].trim(),
            existencia: Number(row[1]),
          }));
        setItems(parsed);
      } catch (error) {
        alert("Hubo un error al procesar el archivo. Verifica el formato.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  // CORRECCIÓN: Lógica de envío mejorada
  const handleEnviarTransaccion = async () => {
    if (!usuario || items.length === 0 || tipoOperacion === "seleccion") {
      alert("Por favor, selecciona un tipo de operación y carga un archivo.");
      return;
    }

    setIsSubmitting(true);

    const body = {
      tipo_movimiento: tipoOperacion, // Se envía en mayúsculas como espera el backend
      usuario,
      observaciones: observaciones || "",
      documento_origen: "",
      productos: items.map(item => ({
        producto_codigo: item.codigo,
        cantidad: item.existencia
      }))
    };

    try {
      // CORRECCIÓN: URL del endpoint ajustada
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transaccion/transaccion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Transacción exitosa. ID de Movimiento: ${result.movimiento_id}`);
        // CORRECCIÓN: Limpieza del formulario tras éxito
        setItems([]);
        setObservaciones("");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      } else {
        // Muestra el error específico del backend
        alert(`Error: ${result.detail || result.error || "Ocurrió un error desconocido."}`);
      }
    } catch (error) {
      alert("Error de conexión. No se pudo comunicar con el servidor.");
      console.error("Error de fetch:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Procesar Excel de Existencias</h2>
      
      <div className="mb-6 space-y-4">
        <div>
          <label htmlFor="tipoOperacion" className="block text-sm font-medium text-gray-700 mb-1">Tipo de operación</label>
          <select
            id="tipoOperacion"
            value={tipoOperacion}
            onChange={e => setTipoOperacion(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="seleccion" disabled>-- Seleccione --</option>
            <option value="descargo">Descargo</option>
            <option value="cargo">Cargo</option>
            {/* Recuerda implementar la lógica para "AJUSTE" en tu backend */}
            <option value="ajuste">Ajuste de Inventario</option>
          </select>
        </div>
        <div>
          <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones (opcional)</label>
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Ej: Conteo físico de fin de mes"
          />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          variant="outline"
          className="flex-grow flex items-center gap-2"
          onClick={() => inputRef.current?.click()}
          disabled={loading || isSubmitting}
        >
          <AiOutlineUpload className="w-5 h-5" />
          {loading ? "Procesando..." : "Seleccionar archivo CSV"}
        </Button>
        <Button
          variant="default"
          className="flex-grow flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleEnviarTransaccion}
          disabled={!usuario || items.length === 0 || loading || isSubmitting || tipoOperacion === "seleccion"}
        >
          {isSubmitting ? "Enviando..." : "Enviar Transacción"}
        </Button>
      </div>

      {items.length > 0 && (
        <div className="overflow-y-auto mt-4 max-h-80 border rounded-md">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-gray-100">
              <tr >
                <th className="p-2 border-b text-left">Código</th>
                <th className="p-2 border-b text-left">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={`${item.codigo}-${idx}`} className="border-b">
                  <td className="p-2 font-mono text-xs">{item.codigo}</td>
                  <td className="p-2">{item.existencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {items.length === 0 && !loading && (
        <div className="text-gray-500 text-center p-4 border-2 border-dashed rounded-md mt-4">
            A la espera de un archivo CSV.
        </div>
      )}
    </div>
  );
};

export default ProcesarExcelExistencia;