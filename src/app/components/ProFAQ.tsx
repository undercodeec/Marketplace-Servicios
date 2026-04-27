import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ProFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "¿Cuánto cuesta registrarse en ArtoCamello?",
      answer: "El registro en ArtoCamello es totalmente gratuito para los profesionales. Puedes crear tu perfil, seleccionar los servicios que ofreces y las zonas en las que trabajas sin ningún coste."
    },
    {
      question: "¿Qué son los créditos y para qué sirven?",
      answer: "Los créditos son nuestra moneda virtual. Los utilizarás para desbloquear los datos de contacto de los clientes que solicitan presupuestos. Solo pagas por los contactos que realmente te interesan, tú decides cuándo y en qué invertir."
    },
    {
      question: "¿Cómo recibo los avisos de nuevos trabajos?",
      answer: "Te enviaremos notificaciones por correo electrónico y/o WhatsApp cada vez que un cliente de tu zona solicite un servicio que coincida con tu perfil profesional. Así podrás ser el primero en contactarle."
    },
    {
      question: "¿Cuántos profesionales pueden contactar a un mismo cliente?",
      answer: "Para garantizar que los clientes no se saturen y que tú tengas oportunidades reales de conseguir el trabajo, un máximo de 4 profesionales pueden contactar con cada solicitud de presupuesto."
    },
    {
      question: "¿Cómo cobro por mis servicios?",
      answer: "El trato y el pago se realizan directamente entre tú y el cliente. ArtoCamello no interviene en el cobro del servicio final ni se lleva comisiones por los trabajos que consigas. El 100% de lo que acuerdes con el cliente es para ti."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#101828] mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-gray-600 text-lg md:text-xl">
            Resolvemos las dudas más comunes sobre cómo trabajar con nosotros.
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={index} 
              className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-300"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-white"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg md:text-xl font-bold text-[#101828] pr-8">
                  {faq.question}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${openIndex === index ? 'bg-[#FFCA0C] text-[#101828]' : 'bg-gray-100 text-gray-500'}`}>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 text-base md:text-lg leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}