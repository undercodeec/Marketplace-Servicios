import image_a1a6c298484b698d01b5df33fe8ec791f15588a7 from 'figma:asset/a1a6c298484b698d01b5df33fe8ec791f15588a7.png'
import React, { useState } from 'react';
import { Search, Brush, Wrench, Zap, Paintbrush, Hammer } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import rightHeroImage from 'figma:asset/f7b44a0634ba8011b1c73c3a0970017c98981256.png';

export function ProHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <section className="relative bg-[#FFCA0C] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[500px] lg:min-h-[600px] py-16">
          
          {/* Content Left */}
          <div className="w-full lg:w-1/2 z-20 mt-12 lg:mt-0 order-2 lg:order-1">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-[64px] font-extrabold text-[#101828] mb-6 leading-[1.15] tracking-tight"
            >
              Consigue nuevos trabajos y clientes ahora
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="text-lg md:text-xl text-[#0A331D]/90 mb-10 max-w-[550px] leading-relaxed"
            >
              Dínos a qué te dedicas. Tras el registro, te enviamos clientes de tu misma zona cada día. ¡Aumenta tus ingresos!
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="w-full max-w-[550px]"
            >
              <label className="block text-[#101828] font-bold text-lg mb-3">
                ¿Qué servicios ofreces?
              </label>
              <form onSubmit={handleSearch} className="bg-white rounded-full p-2 flex items-center shadow-lg mb-8">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej. Diseño gráfico, Desarrollo web..." 
                  className="flex-grow bg-transparent border-none focus:ring-0 px-6 text-gray-800 placeholder-gray-500 text-base md:text-lg outline-none"
                />
                <button type="submit" className="bg-[#101828] hover:bg-[#101828]/90 text-[#FFCA0C] w-14 h-14 rounded-full flex items-center justify-center transition-colors shrink-0 shadow-md">
                  <Search className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </form>

              <div className="mt-4">
                <p className="text-[#101828] font-medium mb-4 text-sm md:text-base">
                  o selecciona uno de los servicios presionando el icono:
                </p>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  {[
                    { icon: Brush, label: 'Limpieza' },
                    { icon: Wrench, label: 'Plomería' },
                    { icon: Zap, label: 'Electricidad' },
                    { icon: Paintbrush, label: 'Pintura' },
                    { icon: Hammer, label: 'Carpintería' },
                  ].map((service, index) => (
                    <motion.div 
                      key={index}
                      onClick={() => navigate(`/search?c=${service.label.toLowerCase()}`)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 + (index * 0.1), type: "spring", stiffness: 100 }}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1">
                        <service.icon className="w-5 h-5 text-[#101828]" />
                      </div>
                      <span className="text-[#101828] text-xs md:text-sm font-medium">{service.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>

          {/* Right side Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[600px] flex items-center justify-center lg:justify-end order-1 lg:order-2"
          >
            <img 
              src={image_a1a6c298484b698d01b5df33fe8ec791f15588a7} 
              alt="Freelancer y trabajos" 
              className="absolute max-w-none object-contain"
              style={{ 
                width: '100%', 
                maxWidth: '800px', 
                right: '0%', 
                top: '65%',
                transform: 'translateY(-50%)' 
              }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}