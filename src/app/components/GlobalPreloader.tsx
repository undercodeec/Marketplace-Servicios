import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import logoArtocamello from '@/assets/logoartocamello.png';

export function GlobalPreloader() {
  const location = useLocation();
  const noPreloaderPaths = ['/login', '/register', '/signup', '/iniciar-sesion', '/registrarse', '/onboarding'];
  
  const [isLoading, setIsLoading] = useState(() => {
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');
    if (hasSeenPreloader) return false;
    return !noPreloaderPaths.includes(location.pathname);
  });

  useEffect(() => {
    // Scroll al inicio cada vez que cambia la ruta
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoading) return;

    // Simula el tiempo de carga
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasSeenPreloader', 'true');
    }, 1200); // 1.2 segundos para mostrar la marca antes de entrar

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="global-preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-white flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <img 
              src={logoArtocamello} 
              alt="ArtoCamello" 
              className="h-[120px] md:h-[180px] w-auto object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
