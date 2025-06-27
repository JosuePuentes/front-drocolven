import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, DollarSign, Info } from 'lucide-react'; // Assuming lucide-react for icons
import PedidoStepper from './PedidoStepper';
import ProductosPedidoList from './ProductosPedidoList';
import { Pedido } from './PedidoTypes'; // Ensure this path is correct

interface PedidoCardProps {
  pedido: Pedido;
  steps: { key: string; label: string; icon: React.ReactElement }[];
  currentStep: number;
}

const PedidoCard: React.FC<PedidoCardProps> = ({ pedido, steps, currentStep }) => {
  return (
    <Card
      // Base styling for the card, responsive width, shadows, and subtle hover effects
      className="border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 md:p-8 bg-white
                 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                 w-full max-w-full mx-auto" // mx-auto to center if used in a flex container
    >
      <CardHeader className="p-0 pb-3 sm:pb-4 border-b border-gray-100 mb-3 sm:mb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            {/* Added a subtle background for the ID to make it pop slightly */}
            Pedido #<span className="font-extrabold text-blue-700 bg-blue-50/50 px-2 py-0.5 rounded-md tracking-wide">
                        {pedido._id.substring(0, 8)}
                    </span>
          </CardTitle>
        </div>
        <CardDescription className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between
                                    text-xs sm:text-sm text-gray-600 mt-2">
          {/* Date Information */}
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="whitespace-nowrap">
              {new Date(pedido.fecha).toLocaleString('es-VE', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </span>
          {/* Total Amount */}
          <span className="flex items-center gap-1.5 font-bold text-gray-900 text-sm sm:text-base">
            <DollarSign className="h-4 w-4 text-green-600" />
            Total: <span className="text-green-700">${pedido.total?.toFixed(2) || 'N/A'}</span>
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {pedido.observacion && (
          <div className="mb-4 text-gray-700 text-sm sm:text-base flex items-start gap-2 bg-blue-50 rounded-md p-3 border border-blue-100">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p><span className="font-semibold">Observación:</span> {pedido.observacion}</p>
          </div>
        )}

        {/* Products Section with Details/Summary */}
        <details className="mt-4 sm:mt-5 group bg-gray-50 rounded-lg p-1 sm:p-4 border border-gray-100">
          <summary className="cursor-pointer text-blue-700 font-semibold flex items-center justify-between
                              transition-all duration-200 group-open:text-blue-800 group-open:font-bold
                              text-sm sm:text-base hover:text-blue-600">
            <span>Ver productos ({pedido.productos?.length || 0})</span>
            <svg
              className="h-5 w-5 text-gray-500 transform transition-transform duration-200 group-open:rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </summary>
          {/* Pass the products to the list component */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <ProductosPedidoList productos={pedido.productos ?? []} />
          </div>
        </details>

        {/* Pedido Stepper */}
        <div className="mt-5 sm:mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Estado del Pedido</h3>
          <PedidoStepper steps={steps} currentStep={currentStep} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PedidoCard;