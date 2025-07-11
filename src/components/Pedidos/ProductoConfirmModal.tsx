import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProductoConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onUnconfirm?: () => void;
    producto: {
        descripcion: string;
        cantidad_pedida: number;
        cantidad_encontrada: number | null | undefined;
    };
}

const ProductoConfirmModal: React.FC<ProductoConfirmModalProps> = ({ open, onClose, onConfirm, onUnconfirm, producto }) => {
    const [cantidadInput, setCantidadInput] = useState<string>('');

    useEffect(() => {
        setCantidadInput('');
    }, [producto]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Permitir solo números positivos o vacío
        if (/^\d*$/.test(value)) {
            setCantidadInput(value);
        }
    };

    const cantidadInputNumber = cantidadInput === '' ? null : parseInt(cantidadInput, 10);
    const isConfirmEnabled = cantidadInputNumber !== null && cantidadInputNumber === (producto.cantidad_encontrada ?? 0);

    return (
        <Dialog open={open} onOpenChange={open => !open ? onClose() : undefined}>
            <DialogContent className="fixed top-70 bg-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-gray-900">Confirmar producto</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 py-2">
                    <div className="text-base font-semibold text-gray-800">{producto.descripcion}</div>
                    <div className="flex flex-row justify-between items-center gap-4 w-full bg-gray-50 rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-sm text-gray-500">Pedido</span>
                            <span className="text-2xl font-bold text-blue-700">{producto.cantidad_pedida}</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 border-l border-gray-200">
                            <span className="text-sm text-gray-500">Picking</span>
                            <span className="text-2xl font-bold text-green-700">{producto.cantidad_encontrada ?? 0}</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 border-l border-gray-200">
                            <span className="text-sm text-gray-500 mb-1">Packing</span>
                            <input
                                type="number"
                                min={0}
                                max={producto.cantidad_pedida}
                                value={cantidadInput}
                                onChange={handleInputChange}
                                className="w-20 px-2 py-1 border border-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 text-right bg-white font-semibold text-gray-800 shadow"
                                aria-label="Cantidad a confirmar"
                                tabIndex={1}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex gap-2 justify-end">
                    <Button onClick={onConfirm} type="button" className="bg-green-600 hover:bg-green-700 text-white" disabled={!isConfirmEnabled} tabIndex={2}>Confirmar</Button>
                    {onUnconfirm && (
                        <Button onClick={onUnconfirm} type="button" className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300" tabIndex={3}>Desconfirmar</Button>
                    )}
                    <Button variant="outline" onClick={onClose} type="button" tabIndex={4}>Cancelar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProductoConfirmModal;
