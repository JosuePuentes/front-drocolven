import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { ReclamoCliente } from "@/components/hooks/useReclamosCliente";

interface ReclamosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reclamos: ReclamoCliente[];
  loading: boolean;
  error: string;
}

export const ReclamosModal: React.FC<ReclamosModalProps> = ({ open, onOpenChange, reclamos, loading, error }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl bg-white">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
          <AiOutlineUnorderedList className="w-6 h-6 text-blue-700" />
          Mis Reclamos
        </DialogTitle>
      </DialogHeader>
      {loading ? (
        <div className="py-8 text-center text-blue-600 animate-pulse">Cargando reclamos...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-600">{error}</div>
      ) : reclamos.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No tienes reclamos registrados.</div>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {reclamos.map((rec) => (
            <div key={rec._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <span className="font-semibold text-gray-800">Pedido: <span className="text-blue-700">{rec.pedido_id?.slice(-6)}</span></span>
                <span className="text-xs text-gray-500">{rec.fecha ? new Date(rec.fecha).toLocaleString() : ""}</span>
              </div>
              <div className="text-sm text-gray-700 mb-2">Observación: {rec.observacion || <span className='italic text-gray-400'>Sin observación</span>}</div>
              <div>
                <span className="font-semibold text-gray-700">Productos reclamados:</span>
                <ul className="mt-1 space-y-1">
                  {rec.productos.map((prod, idx) => (
                    <li key={prod.id + idx} className="flex flex-wrap gap-2 items-center text-xs border-b last:border-b-0 py-1">
                      <span className="font-medium text-gray-900">{prod.descripcion}</span>
                      <span className="bg-blue-50 text-blue-700 rounded px-2 py-0.5">Motivo: {prod.motivo}</span>
                      <span className="text-gray-600">Cantidad: {prod.cantidad}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </DialogContent>
  </Dialog>
);
