import React from 'react';
import { Hammer, Sparkles, Dumbbell, Scale, GraduationCap, Paintbrush, Truck, Camera } from 'lucide-react';

const categories = [
  { name: 'Reformas', icon: Hammer, color: 'bg-orange-100 text-orange-600', hoverBorder: 'hover:border-orange-200' },
  { name: 'Limpieza', icon: Sparkles, color: 'bg-blue-100 text-blue-600', hoverBorder: 'hover:border-blue-200' },
  { name: 'Entrenadores', icon: Dumbbell, color: 'bg-green-100 text-green-600', hoverBorder: 'hover:border-green-200' },
  { name: 'Abogados', icon: Scale, color: 'bg-purple-100 text-purple-600', hoverBorder: 'hover:border-purple-200' },
  { name: 'Clases', icon: GraduationCap, color: 'bg-pink-100 text-pink-600', hoverBorder: 'hover:border-pink-200' },
  { name: 'Pintores', icon: Paintbrush, color: 'bg-yellow-100 text-yellow-600', hoverBorder: 'hover:border-yellow-200' },
  { name: 'Mudanzas', icon: Truck, color: 'bg-indigo-100 text-indigo-600', hoverBorder: 'hover:border-indigo-200' },
  { name: 'Fotógrafos', icon: Camera, color: 'bg-rose-100 text-rose-600', hoverBorder: 'hover:border-rose-200' },
];

export function Categories() {
  return (
    <section className="py-24 bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Servicios más populares
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre los profesionales más demandados y encuentra al experto perfecto para tu proyecto.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <a 
              key={index}
              href="#"
              className={`group flex flex-col items-center p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent ${category.hoverBorder}`}
            >
              <div className={`p-4 rounded-xl ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-8 h-8" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg text-center group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
            </a>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-full transition-colors">
            Ver todas las categorías
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
