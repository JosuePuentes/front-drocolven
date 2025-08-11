import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineUpload } from "react-icons/ai";


interface ItemExistencia {
  codigo: string;
  existencia: number;
}

const ProcesarExcelExistencia: React.FC = () => {
  const [items, setItems] = useState<ItemExistencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [tipoOperacion, setTipoOperacion] = useState<string>("seleccion");
  const [usuario, setUsuario] = useState<string>("");

  useEffect(() => {
    // Intenta obtener el usuario del localStorage (ajusta la clave si es diferente)
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser)._id || "");
    }
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Separar líneas y quitar vacías
        const lines = text.split(/\r?\n/).filter(Boolean);
        // Suponiendo encabezado: codigo,existencia
        const rows = lines.slice(1).map(line => line.split(";"));
        const parsed: ItemExistencia[] = rows
          .filter(row => row[0] && row[1])
          .map(row => ({
            codigo: row[0].trim(),
            existencia: Number(row[1]),
          }));
        setItems(parsed);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleExportJson = () => {
    if (items.length > 0) {
      const data = {
        usuario,
        tipoOperacion,
        items
      };
      const json = JSON.stringify(data, null, 2);
      console.log(json);
    }
  };

  // Enviar al endpoint /transaccion
  const [observaciones, setObservaciones] = useState<string>("");

  const handleEnviarTransaccion = async () => {
    if (!usuario || items.length === 0) return;
    // Mapear items a productos para el backend
    const productos = items.map(item => ({
      producto_codigo: item.codigo,
      cantidad: item.existencia
    }));
    const body = {
      tipo_movimiento: tipoOperacion,
      usuario,
      observaciones: observaciones || "",
      documento_origen: "",
      productos
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transaccion/transaccion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      console.log("Respuesta del backend:", result);
      // Aquí puedes mostrar un toast, modal, etc.
    } catch (error) {
      console.error("Error al enviar la transacción:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Procesar Excel de Existencias</h2>
      <div className="mb-6">
        <label htmlFor="tipoOperacion" className="block text-sm font-medium text-gray-700 mb-1">Tipo de operación</label>
        <select
          id="tipoOperacion"
          value={tipoOperacion}
          onChange={e => setTipoOperacion(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 mb-3"
        >
          <option value="seleccion">Selección</option>
          <option value="descargo">Descargo</option>
          <option value="carga">Carga</option>
          <option value="ajuste">Ajuste</option>
        </select>
        <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones (opcional)</label>
        <textarea
          id="observaciones"
          value={observaciones}
          onChange={e => setObservaciones(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          rows={2}
          placeholder="Observaciones de la transacción"
        />
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex gap-4 mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          <AiOutlineUpload className="w-5 h-5" />
          {loading ? "Procesando..." : "Seleccionar archivo CSV"}
        </Button>
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={handleExportJson}
          disabled={items.length === 0}
        >
          Exportar JSON
        </Button>
        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={handleEnviarTransaccion}
          disabled={!usuario || items.length === 0}
        >
          Enviar transacción
        </Button>
      </div>
      {items.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border-b">Código</th>
                <th className="p-2 border-b">Existencia</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.codigo + idx} className="border-b">
                  <td className="p-2 font-mono text-xs">{item.codigo}</td>
                  <td className="p-2">{item.existencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {items.length === 0 && !loading && (
        <div className="text-gray-500 text-center mt-8">No hay datos cargados.</div>
      )}
    </div>
  );
};

export default ProcesarExcelExistencia;