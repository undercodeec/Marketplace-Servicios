import React from 'react';
import { Link } from 'react-router';

export function ExplorePills() {
  const categories = [
    'Reparaciones', 'Pintura', 'Albañilería', 'Limpieza a domicilio', 'Fontanería', 'Electricistas', 'Limpieza comercial',
    'Cuidado de niños', 'Reparación de electrodomésticos', 'Cuidado de mascotas', 'Servicios de mudanza', 'Asesoría fiscal', 'Cuidado de personas mayores',
    'Servicios legales', 'Jardinería', 'Remodelaciones', 'Mantenimiento preventivo', 'Carpintería', 'Paseador de perros',
    'Fumigación', 'Instalación de pisos', 'Diseño de interiores'
  ];

  return (
    <section className="py-16 bg-[#fafafa]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#404145] mb-8">Explora nuestras categorías más populares</h2>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/search?c=${encodeURIComponent(cat)}`}
              className="inline-block px-5 py-2.5 rounded-full border border-gray-300 bg-white text-[#62646A] font-semibold text-sm hover:border-[#FFCA0C] hover:bg-[#FFCA0C] hover:text-[#404145] transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
