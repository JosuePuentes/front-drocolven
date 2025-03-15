import { useState } from "react";
import readExcelFile from "./readExcelFile";

// Definir el tipo para los productos
interface Product {
  Descripcion: string;
  Laboratorio: string;
  "F. V.": Date | string; // Puede ser una fecha o string si no se puede parsear correctamente
  Existencia: number;
  Precio: number;
}

const ExcelUploader = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readExcelFile(file);
      
      // Limpiar los datos: quitar espacios adicionales y convertir tipos
      const cleanedData = data.map((product: any) => {
        // Limpiar las claves eliminando espacios
        const cleanedProduct: any = {};
        for (const key in product) {
          const cleanedKey = key.trim(); // Eliminar espacios al principio y final
          let value = product[key];

          // Convertir la fecha
          if (cleanedKey === "F. V." && typeof value === "string") {
            const date = new Date(value);
            // Verificar si la fecha es válida
            value = isNaN(date.getTime()) ? value : date;
          }

          // Convertir Existencia y Precio a números
          if (cleanedKey === "Existencia" || cleanedKey === "Precio") {
            value = parseFloat(value) || 0; // Si no es un número válido, lo convierte a 0
          }

          cleanedProduct[cleanedKey] = value;
        }
        return cleanedProduct;
      });

      setProducts(cleanedData as Product[]); // Aquí especificamos que los datos son de tipo Product[]
    } catch (error) {
      console.error("Error leyendo el archivo:", error);
    }
  };

  console.log(products[0]);

  return (
    <div className="p-4">
      <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Laboratorio</th>
            <th className="border p-2">F. V.</th>
            <th className="border p-2">Existencia</th>
            <th className="border p-2">Precio</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{product["Descripcion"]}</td>
              <td className="border p-2">{product["Laboratorio"]}</td>
              <td className="border p-2">
                {product["F. V."] instanceof Date
                  ? product["F. V."].toLocaleDateString()
                  : product["F. V."]}
              </td>
              <td className="border p-2">{product["Existencia"]}</td>
              <td className="border p-2">$ {product["Precio"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelUploader;
