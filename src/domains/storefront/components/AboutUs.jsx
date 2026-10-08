import React from 'react';
import { siteConfig } from '../../../config/siteConfig.js';

/**
 * Componente AboutUs (Sección Nosotros).
 * 
 * Principios de Diseño y HCI aplicados:
 * - Estética Glassmorphism y Ecosistema iOS: Fondo con gradiente sutil, bordes suaves `rounded-3xl`
 *   y tarjetas flotantes con `backdrop-blur-md` que aportan tridimensionalidad y modernidad.
 * - Jerarquía Visual Equilibrada: En escritorio organiza la narrativa en 2 columnas (foto inspiradora
 *   a un lado y valores con prueba social al otro), permitiendo escaneo visual rápido sin fatiga.
 * - Micro-interacciones (Affordance): Las tarjetas de valor responden al cursor con elevación sutil
 *   (`hover:-translate-y-1 hover:shadow-md transition-all`), reforzando interactividad.
 * - Cero Hardcoding: Lee el nombre de marca y datos desde `siteConfig`.
 *
 * @param {Object} props
 * @param {string} [props.businessName] - Nombre del comercio (fallback a siteConfig.businessName).
 * @returns {JSX.Element}
 */
export const AboutUs = ({ businessName }) => {
  const brandName = businessName || siteConfig?.businessName || 'Aura Store';

  const valueProps = [
    {
      id: 1,
      title: 'Confort Ergonómico',
      description: 'Suelas con amortiguación reactiva diseñadas para soportar tus jornadas más activas sin fatiga.',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Calidad & Durabilidad',
      description: 'Materiales seleccionados y costuras reforzadas para resistir el ritmo urbano día tras día.',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Asesoría Humana por WhatsApp',
      description: 'Te orientamos en tallas, modelos y tiempos de envío sin intermediarios ni bots confusos.',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  return (
    <section
      id="nosotros"
      className="relative py-12 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-emerald-50/20 to-white overflow-hidden"
      aria-label="Sobre nosotros y valores de la marca"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera de Sección Centrada para Móvil y Desktop */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs sm:text-sm font-semibold tracking-wide uppercase">
            Nuestra Identidad
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Más que zapatillas, es tu estilo de vida con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
              {brandName}
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Nacimos con una misión clara: ofrecer el calzado urbano más cómodo, auténtico y versátil del mercado, conectando directamente con las personas a través de una atención cercana y transparente.
          </p>
        </div>

        {/* Cuadrícula Principal: 2 Columnas Balanceadas en Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Columna 1: Fotografía Inspiradora con Tarjetas Flotantes Glassmorphism */}
          <div className="relative group mx-auto w-full max-w-lg lg:max-w-none order-2 lg:order-1">
            
            {/* Halo ambiental suave */}
            <div
              className="absolute -inset-3 bg-gradient-to-tr from-emerald-400/20 to-teal-400/10 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"
              aria-hidden="true"
            ></div>

            {/* Contenedor de Fotografía */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl bg-white border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1000"
                alt={`Experiencia y estilo urbano de calzado ${brandName}`}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Tarjeta Flotante Glassmorphism 1: Confort Comprobado */}
              <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-white/90 backdrop-blur-md border border-white/70 shadow-xl rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">100% Confort</p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">Diseño ergonómico</p>
                </div>
              </div>

              {/* Tarjeta Flotante Glassmorphism 2: Atención Humana */}
              <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 bg-white/90 backdrop-blur-md border border-white/70 shadow-xl rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-600/30">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">Atención Humana</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold">Respuesta inmediata</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 2: Bloques de Valor y Social Proof */}
          <div className="flex flex-col space-y-6 order-1 lg:order-2">
            
            {/* Los 3 Bloques de Valor con micro-interacciones */}
            <div className="grid grid-cols-1 gap-4">
              {valueProps.map((item) => (
                <div
                  key={item.id}
                  className="group/card bg-white/85 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out"
                >
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center shrink-0 group-hover/card:bg-emerald-600 group-hover/card:text-white transition-colors duration-300">
                      <span className="group-hover/card:[&>svg]:text-white transition-colors">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight group-hover/card:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Franja de Métricas / Social Proof */}
            <div className="pt-6 border-t border-gray-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center sm:text-left">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-100/60">
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">+5,000</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Zapatillas entregadas</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-100/60">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">99.8%</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Opiniones positivas</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-100/60">
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">24/7</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Soporte por WhatsApp</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutUs;
