import React from 'react';
import { useNavigate } from 'react-router';
import { XCircle } from 'lucide-react';

export function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#101828] mb-2">Pago cancelado</h2>
        <p className="text-gray-600 mb-8">
          No se realizó ningún cargo. Puedes intentarlo de nuevo cuando quieras.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard/jobs')}
            id="btn-retry-payment"
            className="flex-1 bg-[#101828] hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Volver al mercado
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            id="btn-go-dashboard"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#101828] font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
