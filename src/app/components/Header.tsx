import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { Link } from 'react-router';
import { SignUpModal } from './SignUpModal';
import { POPULAR_SERVICES } from '../constants/services';

export function Header() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [initialModalView, setInitialModalView] = useState<'login' | 'signup'>('signup');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  const checkAuth = () => {
    const authStatus = sessionStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setUserType(sessionStorage.getItem('userType'));
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('auth-status-changed', checkAuth);
    
    const handleOpenAuthModal = (e: CustomEvent<{ view: 'login' | 'signup' }>) => {
      openModal(e.detail.view);
    };

    window.addEventListener('open-auth-modal', handleOpenAuthModal as EventListener);
    return () => {
      window.removeEventListener('auth-status-changed', checkAuth);
      window.removeEventListener('open-auth-modal', handleOpenAuthModal as EventListener);
    };
  }, []);

  const openModal = (view: 'login' | 'signup') => {
    setInitialModalView(view);
    setIsSignUpModalOpen(true);
  };

  const serviceColumns = [
    POPULAR_SERVICES.slice(0, 6),
    POPULAR_SERVICES.slice(6, 12),
    POPULAR_SERVICES.slice(12, 18),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 h-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex-shrink-0 flex items-center gap-6">
            <Link to="/" className="text-3xl font-black tracking-tighter text-[#404145]">
              ArtoCamello<span className="text-[#FFCA0C]">.</span>
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-6 h-full">
            
            {/* Servicios Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center text-[#404145] font-semibold hover:text-[#FFCA0C] transition-colors gap-1 h-full cursor-pointer">
                Servicios <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              
              <div className="absolute top-full right-0 w-max min-w-[750px] bg-white shadow-xl border border-gray-100 p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 cursor-default">
                <div className="grid grid-cols-3 gap-x-8">
                  {serviceColumns.map((col, cIdx) => (
                    <ul key={cIdx} className="space-y-4 text-center">
                      {col.map((item, iIdx) => (
                        <li key={iIdx}>
                          <Link 
                            to={item.slug ? `/search?c=${item.slug}` : '/search'} 
                            className={`block font-medium ${item.active ? 'text-[#FFCA0C] hover:underline' : 'text-[#62646A] hover:text-[#FFCA0C]'} ${item.isLong ? 'leading-tight max-w-[200px] mx-auto' : ''}`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/pro" className="text-[#62646A] font-medium hover:text-[#FFCA0C] transition-colors">
              ¿Eres un profesional?
            </Link>
            
            {isAuthenticated && userType !== 'pro' && (
              <>
                <Link to="/mis-solicitudes" className="text-[#62646A] font-medium hover:text-[#FFCA0C] transition-colors">
                  Mis Solicitudes
                </Link>
                <Link to="/mi-perfil" className="text-[#62646A] font-medium hover:text-[#FFCA0C] transition-colors">
                  Mi Perfil
                </Link>
              </>
            )}

            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => openModal('login')}
                  className="text-[#62646A] font-medium hover:text-[#FFCA0C] transition-colors cursor-pointer"
                >
                  Iniciar sesión
                </button>
                <button 
                  onClick={() => openModal('signup')}
                  className="border border-[#FFCA0C] text-[#FFCA0C] hover:bg-[#FFCA0C] hover:text-black px-5 py-2 rounded-md font-semibold transition-colors cursor-pointer"
                >
                  Unete
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  sessionStorage.removeItem('isAuthenticated');
                  sessionStorage.removeItem('userType');
                  sessionStorage.removeItem('userEmail');
                  window.dispatchEvent(new Event('auth-status-changed'));
                  window.location.href = '/';
                }}
                className="text-[#62646A] font-medium hover:text-red-500 transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </div>
      
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)} 
        initialView={initialModalView}
      />
    </header>
  );
}