import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const faqs = [
    {
      q: '¿Qué es el diseño y cómo funciona el uso de un freelancer?',
      a: 'ArtoCamello es el mercado de servicios freelance más grande del mundo para empresas más ágiles. Los compradores que necesitan servicios profesionales pueden encontrar rápidamente profesionales freelance ofreciendo sus habilidades a precios accesibles.'
    },
    {
      q: '¿Cómo puedo pagar por los servicios?',
      a: 'Ofrecemos métodos de pago seguros, incluyendo tarjetas de crédito, PayPal y otros métodos locales según tu país.'
    },
    {
      q: '¿Cómo garantizan que obtenga el servicio?',
      a: 'Tu pago está retenido en depósito de garantía hasta que estés 100% satisfecho con el trabajo completado.'
    },
    {
      q: '¿En qué moneda es el pago?',
      a: 'Puedes elegir pagar en tu moneda local o en las principales monedas internacionales soportadas por la plataforma.'
    },
    {
      q: '¿Qué incluye la opción de revisión?',
      a: 'Las revisiones dependen del paquete del vendedor y aseguran que el resultado final cumpla con tus expectativas.'
    },
    {
      q: '¿Qué sucede si necesito comunicarme con un profesional?',
      a: 'Puedes usar nuestro sistema de mensajería integrado para comunicarte de forma segura y directa con los vendedores antes y durante el pedido.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#404145] mb-10">Preguntas frecuentes</h2>

        <Accordion.Root type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <Accordion.Item key={i} value={`item-${i}`} className="border-b border-gray-200">
              <Accordion.Header>
                <Accordion.Trigger className="flex justify-between items-center w-full py-5 text-left text-[#404145] font-semibold hover:text-[#FFCA0C] transition-colors group">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#FFCA0C] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-[#62646A] text-base pb-5 leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                {faq.a}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>


      </div>
    </section>
  );
}
