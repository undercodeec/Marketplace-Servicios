import image_e6aa9405774d6957f43b873b5534c79308047b9d from 'figma:asset/e6aa9405774d6957f43b873b5534c79308047b9d.png'
import React from 'react';
import exampleImage from 'figma:asset/ac607f282acc2cb39be6a7b6c0eaf5ab77eff6f3.png';

export function ProCTA() {
  return (
    <section className="w-full relative bg-white pt-24 pb-0">
      {/* Full width blue background */}
      <div className="w-full bg-gradient-to-r from-[#FFCA0C] via-[#FFD747] to-[#FFCA0C] relative min-h-[340px] flex items-center justify-center">
        
        {/* Container for content */}
        <div className="max-w-[1100px] w-full px-6 md:px-12 flex flex-col md:flex-row relative z-10 py-12 md:py-16 mx-auto">
          
          {/* Left Text Content */}
          <div className="w-full md:w-[65%] lg:w-[60%] flex flex-col items-start text-white relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-[#404145] mb-4 leading-tight">
              ¿Eres un <span className="text-white italic font-serif">profesional</span> y buscas nuevos clientes y trabajos?
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#404145]/90 mb-8 font-normal leading-relaxed max-w-[480px]">
              En ArtoCamello recibimos miles de solicitudes al mes de clientes que buscan profesionales en su zona, por todo el país.
            </p>
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { view: 'signup' } }));
              }}
              className="bg-[#404145] hover:bg-[#222325] text-white font-bold py-[14px] px-8 rounded-[4px] shadow-md hover:shadow-lg transition-all text-[15px] uppercase tracking-wide"
            >
              REGISTRARME GRATIS
            </button>
          </div>

          {/* Right Image Container - Absolute Positioning for Desktop overlap */}
          <div className="hidden md:block absolute right-0 bottom-0 h-[135%] w-[45%] lg:w-[50%] z-0 pointer-events-none origin-bottom flex items-end justify-end">
             <img 
               src={image_e6aa9405774d6957f43b873b5534c79308047b9d} 
               alt="Profesionales" 
               className="absolute max-w-none object-contain"
               style={{ 
                 height: '55%',  // Tamaño general de la imagen (prueba 120%, 130%...)
                 bottom: '0px', // Valores negativos la bajan, valores positivos la suben
                 right: '0px',    // Mueve la imagen de lado a lado. 
                 // left: '20px', // (Opcional) Puedes usar left en lugar de right si lo prefieres
               }}
             />
          </div>
          
          {/* Mobile Image */}
          <div className="md:hidden w-full flex justify-center mt-10 z-0 relative h-[280px]">
             <img 
               src={exampleImage} 
               alt="Profesionales" 
               className="h-full w-auto object-contain object-bottom"
             />
          </div>

        </div>
      </div>
    </section>
  );
}
