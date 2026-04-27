import React from 'react';
import { UserPlus, ShieldCheck, CreditCard, HeadphonesIcon } from 'lucide-react';
import { motion } from 'motion/react';

export function ProHowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Crea una cuenta",
      description: "En primer lugar, crea tu cuenta gratuita. En menos de 2 minutos puedes tener configurado tu perfil de ArtoCamello y empezar a conseguir trabajos y clientes."
    },
    {
      icon: ShieldCheck,
      title: "Consigue clientes verificados",
      description: "Recibe peticiones de presupuesto de clientes de tu zona. Una vez publicado un trabajo, validamos y verificamos mediante distintos métodos el teléfono del cliente."
    },
    {
      icon: CreditCard,
      title: "Paga por los que interesan",
      description: "Recarga créditos en tu billetera de ArtoCamello. Con los créditos podrás desbloquear el contacto del cliente y enviarle tu presupuesto directamente."
    },
    {
      icon: HeadphonesIcon,
      title: "Atención personalizada",
      description: "Dispondrás de un asesor que te ayudará de forma personalizada a optimizar la captación de tus clientes en la plataforma."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gray-50 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#101828]">
            Cómo funciona ArtoCamello
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col items-start text-left group"
            >
              <div className="mb-6 group-hover:-translate-y-1 transition-transform duration-300">
                <step.icon className="w-12 h-12 text-[#101828]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#101828] mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 text-base md:text-[17px] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}