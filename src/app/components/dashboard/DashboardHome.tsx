import React, { useState, useEffect } from 'react';
import { Receipt, Trophy, Star, Bell, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import { getPaymentHistory } from '@/services/leadService';
import { getCurrentAuth } from '@/services/authService';

export function DashboardHome() {
  const auth = getCurrentAuth();
  const [totalPaid, setTotalPaid] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);

  useEffect(() => {
    getPaymentHistory().then((history) => {
      setPaymentCount(history.length);
      setTotalPaid(history.reduce((acc, p) => acc + p.costUSD, 0));
    });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-[#101828]">Resumen de tu negocio</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pagado en Contactos</p>
              <h2 className="text-3xl font-bold text-[#101828]">${totalPaid.toFixed(2)} <span className="text-lg text-gray-500 font-normal">USD</span></h2>
              <p className="text-sm text-gray-400 mt-1">{paymentCount} contacto{paymentCount !== 1 ? 's' : ''} desbloqueado{paymentCount !== 1 ? 's' : ''}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <Link to="/dashboard/wallet" className="mt-auto w-full py-2 bg-[#101828] hover:bg-gray-800 text-white font-semibold rounded-lg text-center transition-colors">
            Ver Facturación
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Trabajos Completados</p>
              <h2 className="text-3xl font-bold text-[#101828]">— <span className="text-sm text-green-600 font-medium ml-2 flex items-center inline-flex"><TrendingUp className="w-4 h-4 mr-1"/>este mes</span></h2>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Historial de trabajos completados</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Calificación Promedio</p>
              <h2 className="text-3xl font-bold text-[#101828] flex items-center gap-2">
                — <Star className="w-6 h-6 text-[#FFCA0C] fill-[#FFCA0C]" />
              </h2>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Basado en reseñas de clientes</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Acceso Rápido */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-[#101828] flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-500" />
              Acciones Rápidas
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            <Link to="/dashboard/jobs" className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#101828]">Explorar trabajos</p>
                <p className="text-sm text-gray-500">Encuentra nuevos clientes en tu zona</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link to="/dashboard/contacts" className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#101828]">Mis contactos</p>
                <p className="text-sm text-gray-500">Ver los clientes que ya desbloqueaste</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link to="/dashboard/wallet" className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#101828]">Facturación y pagos</p>
                <p className="text-sm text-gray-500">Revisa tus transacciones en USD</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-[#101828] rounded-xl border border-[#101828] shadow-sm text-white p-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10">
            <Trophy className="w-48 h-48 -mr-10 -mb-10" />
          </div>
          <h3 className="font-bold text-xl text-[#FFCA0C] mb-4 relative z-10">Consejos para ganar más</h3>
          <ul className="space-y-4 relative z-10">
            <li className="flex items-start gap-3">
              <div className="p-1 rounded bg-white/10 mt-0.5"><Star className="w-4 h-4 text-[#FFCA0C]" /></div>
              <p className="text-sm text-gray-300"><strong className="text-white">Responde rápido:</strong> Los profesionales que envían presupuesto en los primeros 30 minutos tienen un 60% más de probabilidad de ganar.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-1 rounded bg-white/10 mt-0.5"><Star className="w-4 h-4 text-[#FFCA0C]" /></div>
              <p className="text-sm text-gray-300"><strong className="text-white">Mejora tu perfil:</strong> Sube fotos de tus últimos trabajos. Los clientes confían más en lo que pueden ver.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-1 rounded bg-white/10 mt-0.5"><Star className="w-4 h-4 text-[#FFCA0C]" /></div>
              <p className="text-sm text-gray-300"><strong className="text-white">Pide valoraciones:</strong> Al terminar un trabajo, no olvides pedir a tu cliente que te deje una reseña en ArtoCamello.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}