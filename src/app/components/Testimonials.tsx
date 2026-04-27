import React from 'react';
import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'María García',
      service: 'Reforma Integral',
      image: 'https://images.unsplash.com/photo-1694299352873-0c29d862e87a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNtaWxpbmclMjBmYWNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczMDcxNTM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      text: 'Pedí presupuesto para reformar mi cocina y recibí respuestas en menos de 2 horas. El profesional que elegí hizo un trabajo impecable. ¡Totalmente recomendado!'
    },
    {
      name: 'Carlos Ruiz',
      service: 'Abogado Laboralista',
      image: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzMwMjM2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      text: 'Encontré exactamente el asesoramiento que necesitaba a un precio muy competitivo. Poder leer las opiniones de otros clientes me dio mucha seguridad.'
    },
    {
      name: 'Antonio López',
      service: 'Instalación Aire Acondicionado',
      image: 'https://images.unsplash.com/photo-1735063456221-91dcb101285b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBtYW4lMjBmYWNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczMDcxNTM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      text: 'Rápido, sencillo y transparente. Me ahorró mucho tiempo buscando por mi cuenta. El técnico fue muy profesional y puntual en todo momento.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Millones confían en nosotros
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Historias reales de clientes que encontraron al profesional perfecto para sus necesidades a través de nuestra plataforma.
          </p>
          <div className="inline-flex items-center space-x-3 bg-blue-50 px-6 py-3 rounded-full text-blue-800 font-semibold shadow-sm border border-blue-100">
            <span className="text-2xl">🎉</span>
            <span>+1.000.000 Profesionales registrados en toda España</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="flex text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed italic flex-grow">
                "{testimonial.text}"
              </p>
              <div className="flex items-center mt-auto border-t border-gray-50 pt-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm font-medium text-blue-600">{testimonial.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
