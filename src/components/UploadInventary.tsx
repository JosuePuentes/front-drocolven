import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

interface Producto {
  codigo: string;
  descripcion: string;
  dpto: string;
  nacional: string;
  laboratorio: string;
  "f.v.": string;
  existencia: number;
  precio: number;
  cantidad_encontrada: number; // Ensure this property is included
  [key: string]: any; // para permitir columnas adicionales
}

const columnasRequeridas = [
  "codigo",
  "descripcion",
  "dpto",
  "nacional",
  "laboratorio",
  "f.v.",
  "existencia",
  "precio",
];

const UploadInventory = () => {
  const [file, setFile] = useState<File | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setStatus("");
    setProductos([]);
    setValid(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json: Producto[] = XLSX.utils.sheet_to_json(sheet);

      const normalizar = (s: string) =>
        s.trim().toLowerCase().replace(/\s+/g, "");

      const columnasExcel = Object.keys(json[0] || {}).map(normalizar);
      const requeridasNormalizadas = columnasRequeridas.map(normalizar);

      const faltantes = requeridasNormalizadas.filter(
        (col) => !columnasExcel.includes(col)
      );

      if (faltantes.length > 0) {
        setStatus(`Faltan columnas requeridas: ${faltantes.join(", ")}`);
        return;
      }

      setProductos(json);
      setFile(selectedFile);
      setValid(true);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !valid) return;
    setLoading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/subir_inventario/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setStatus(response.data.message);
      setProductos([]);
      setFile(null);
      setValid(false);
    } catch (error: any) {
      setStatus(
        "Error al subir archivo: " +
          (error?.response?.data?.detail || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg shadow-lg bg-white max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Subir Inventario (.xlsx)</h2>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="mb-4 w-full"
      />

      {productos.length > 0 && (
        <div className="overflow-auto max-h-64 border rounded mb-4">
          <table className="min-w-full table-auto text-sm text-left text-gray-700">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {Object.keys(productos[0]).map((key) => (
                  <th key={key} className="px-3 py-2 font-semibold">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.slice(0, 10).map((prod, idx) => (
                <tr key={idx} className="border-t">
                  {Object.keys(prod).map((key) => (
                    <td key={key} className="px-3 py-1">
                      {prod[key]}
                    </td>
                  ))}
                </tr>
              ))}
              {productos.length > 10 && (
                <tr>
                  <td
                    colSpan={Object.keys(productos[0]).length}
                    className="text-center py-2 italic text-gray-500"
                  >
                    Mostrando primeros 10 productos de {productos.length}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!valid || loading}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full ${
          loading || !valid ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Subiendo..." : "Subir Inventario"}
      </button>

      {status && (
        <p className="mt-4 text-sm text-gray-700 font-medium">{status}</p>
      )}
    </div>
  );
};

export default UploadInventory;