
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface LoteInfo {
  lote: string;
  existencia: number;
  fecha_vencimiento: string;
}

interface CheckLoteProps {
  lotes: LoteInfo[];
  onChange: (lotes: LoteInfo[]) => void;
  onClose: () => void;
}


const CheckLote: React.FC<CheckLoteProps> = ({ lotes, onChange, onClose }) => {
  const [lotesState, setLotesState] = useState<LoteInfo[]>(lotes);
  const [nuevoLote, setNuevoLote] = useState<{ lote: string; existencia: string; fecha_vencimiento: string }>({ lote: '', existencia: '', fecha_vencimiento: '' });
  const [error, setError] = useState<string | null>(null);

  const handleAddLote = () => {
    if (!nuevoLote.lote.trim()) {
      setError('El campo Lote es obligatorio.');
      return;
    }
    if (!nuevoLote.fecha_vencimiento) {
      setError('La fecha de vencimiento es obligatoria.');
      return;
    }
    const existenciaNum = Number(nuevoLote.existencia);
    if (!nuevoLote.existencia || isNaN(existenciaNum) || existenciaNum <= 0) {
      setError('La existencia debe ser mayor a 0.');
      return;
    }
    if (lotesState.some(l => l.lote.trim().toLowerCase() === nuevoLote.lote.trim().toLowerCase())) {
      setError('Ya existe un lote con ese nombre.');
      return;
    }
    setLotesState([...lotesState, { lote: nuevoLote.lote, existencia: existenciaNum, fecha_vencimiento: nuevoLote.fecha_vencimiento }]);
    setNuevoLote({ lote: '', existencia: '', fecha_vencimiento: '' });
    setError(null);
  };


  const handleRemoveLote = (idx: number) => {
    setLotesState(lotesState.filter((_, i) => i !== idx));
  };


  const handleSave = () => {
    // Permitir guardar aunque no haya lotes, para limpiar y desactivar el icono de calendario
    setError(null);
    onChange(lotesState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-200 flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Registrar Lotes</h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm font-medium" role="alert">{error}</div>
        )}
        <div className="space-y-2 mb-6 max-h-44 overflow-y-auto pr-1">
          {lotesState.length === 0 ? (
            <div className="text-gray-400 text-sm">No hay lotes registrados.</div>
          ) : (
            lotesState.map((l, idx) => (
              <div key={idx} className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="flex-1 text-sm text-gray-700">Lote: <b className="font-medium text-gray-900">{l.lote}</b></span>
                <span className="flex-1 text-sm text-gray-700">Existencia: <b className="font-medium text-gray-900">{l.existencia}</b></span>
                <span className="flex-1 text-sm text-gray-700">Vence: <b className="font-medium text-gray-900">{l.fecha_vencimiento}</b></span>
                <Button
                  variant="ghost"
                  className="text-red-500 text-xs px-2 py-1 hover:bg-red-50"
                  aria-label="Eliminar lote"
                  onClick={() => handleRemoveLote(idx)}
                >Eliminar</Button>
              </div>
            ))
          )}
        </div>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5"
          onSubmit={e => { e.preventDefault(); handleAddLote(); }}
          autoComplete="off"
        >
          <input
            type="text"
            placeholder="Lote"
            className="col-span-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-900"
            value={nuevoLote.lote}
            onChange={e => setNuevoLote({ ...nuevoLote, lote: e.target.value })}
            maxLength={20}
            aria-label="Lote"
            required
          />
          <input
            type="number"
            placeholder="Existencia"
            className="col-span-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-900"
            value={nuevoLote.existencia}
            onChange={e => setNuevoLote({ ...nuevoLote, existencia: e.target.value })}
            min={1}
            aria-label="Existencia"
            required
          />
          <input
            type="date"
            placeholder="Fecha de vencimiento"
            className="col-span-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-900"
            value={nuevoLote.fecha_vencimiento}
            onChange={e => setNuevoLote({ ...nuevoLote, fecha_vencimiento: e.target.value })}
            aria-label="Fecha de vencimiento"
            required
          />
          <div className="md:col-span-3 flex justify-end mt-2">
            <Button
              type="submit"
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1 rounded shadow"
            >Agregar lote</Button>
          </div>
        </form>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">Puedes agregar varios lotes para este producto.</span>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button
            variant="ghost"
            className="text-gray-600 px-4 py-1 rounded hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >Cancelar</Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded shadow"
            onClick={handleSave}
            type="button"
          >Guardar</Button>
        </div>
      </div>
    </div>
  );
};

export default CheckLote;
