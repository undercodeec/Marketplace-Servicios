import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { UserRole } from '@/domain/types';
import { forceAuth } from '@/services/authService';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { isClient } = useAuth(); // or maybe we need to store token manually? Actually, since verify gives JWT back, we can just save it or call a specific service

  useEffect(() => {
    let mounted = true;
    
    if (!token) {
      if (mounted) {
        setStatus('error');
        setErrorMessage('Enlace de verificación inválido o ausente.');
      }
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/auth/verify?token=${token}`);
        if (!response.ok) {
           const errData = await response.json();
           throw new Error(errData.error || 'Autenticación fallida al verificar');
        }

        const data = await response.json();
        
        // Simular que iniciamos sesión guardando el token (Igual que en AuthService login())
        // Como no exportamos setAuthState globalmente a los componentes sin pasar por AuthContext,
        // lo más limpio es forzar recarga (reload) a /onboarding guardando las credenciales en session 
        // Usar forceAuth inyecta correctamente ambos el objeto de usuario y el token de forma que
        // cuando redirija a onboarding, el contexto de Auth ya esté pre-configurado correctamente.
        forceAuth(data.user, data.token);

        // Wait 2 seconds so they can see the success checkmark
        if (mounted) {
          setStatus('success');
          setTimeout(() => {
             // Redirigir siempre a selección de rol (página de onboarding/roles)
             window.location.href = '/onboarding';
          }, 2000);
        }
      } catch (err: any) {
        if (mounted) {
          setStatus('error');
          setErrorMessage(err.message || 'El enlace caducó o ya fue usado.');
        }
      }
    };

    verifyToken();

    return () => { mounted = false; };
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md text-center animate-in zoom-in-95 duration-500">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[#101828] animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-[#101828] mb-2">Verificando...</h2>
            <p className="text-gray-500">Estamos validando tu correo electrónico mágico</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
               <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#101828] mb-2">¡Correo Verificado!</h2>
            <p className="text-gray-500 mb-6">Tu cuenta ha sido activada con éxito. Te estamos redirigiendo a la sala principal...</p>
          </div>
        )}

        {status === 'error' && (
           <div className="flex flex-col items-center">
             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
             </div>
             <h2 className="text-2xl font-bold text-[#101828] mb-2">Error de verificación</h2>
             <p className="text-gray-600 mb-8">{errorMessage}</p>
             <button 
                onClick={() => navigate('/')}
                className="w-full text-white bg-[#101828] hover:bg-gray-800 rounded-md py-3 px-4 font-semibold transition-colors"
              >
                Volver al inicio
             </button>
           </div>
        )}
      </div>
    </div>
  );
}
