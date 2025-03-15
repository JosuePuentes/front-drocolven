import * as XLSX from "xlsx";

interface ExcelData {
  [key: string]: string | number | Date; // Ahora también acepta fechas
}

const readExcelFile = (file: File): Promise<ExcelData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Procesar las celdas para convertir fechas
          const jsonData: ExcelData[] = XLSX.utils.sheet_to_json(sheet, {
            raw: false, // Esto le permite a XLSX manejar las fechas y convertirlas en objetos Date
          });

          // Convertir cualquier campo que sea número y sea una fecha en formato JavaScript Date
          jsonData.forEach((row) => {
            for (const key in row) {
              if (row[key] instanceof Date) {
                // Si el valor es una fecha en formato Excel, lo dejamos como un objeto Date
                row[key] = new Date(row[key] as Date);
              }
            }
          });

          resolve(jsonData);
        } else {
          reject(new Error("No data found in the file."));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (err) => {
      reject(new Error(`File reading error: ${err}`));
    };
  });
};

export default readExcelFile;
