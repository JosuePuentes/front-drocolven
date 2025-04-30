const SeleccionarFecha = ({ fechas, fechaSeleccionada, setFechaSeleccionada }: {
    fechas: string[];
    fechaSeleccionada: string | null;
    setFechaSeleccionada: (fecha: string) => void;
  }) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Selecciona un día:</h2>
      <div className="flex flex-wrap gap-4">
        {fechas.map((fecha) => (
          <button
            key={fecha}
            onClick={() => setFechaSeleccionada(fecha)}
            className={`px-4 py-2 rounded-lg ${
              fecha === fechaSeleccionada ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {fecha}
          </button>
        ))}
      </div>
    </div>
  );
  