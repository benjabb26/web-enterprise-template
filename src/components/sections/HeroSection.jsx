import React from 'react';
import { siteConfig } from '../../data/siteConfig.js';

/**
 * Componente HeroSection (Portada Principal).
 * Optimizado responsive: escala tipográfica fluida en 320px-375px y micro-beneficios apilables en móvil.
 *
 * @param {Object} props
 * @param {string} [props.businessName] - Nombre de la marca.
 * @param {string} [props.tagline] - Frase distintiva.
 * @returns {JSX.Element}
 */
export const HeroSection = ({ businessName, tagline }) => {
  const brandName = businessName || siteConfig?.businessName || 'Aura Store';
  const brandTagline = tagline || siteConfig?.tagline || 'Estilo urbano en tus pies';

  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 md:pt-16 md:pb-24 lg:py-28"
      aria-label="Portada y colección destacada"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
          
          {/* Columna Izquierda: Copywriting persuasivo y Llamada a la Acción (Patrón Z) */}
          <div className="flex flex-col items-start space-y-5 sm:space-y-6">
            
            {/* Badge de Novedad / Categoría */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
              <span>Nueva Colección 2026</span>
              <span className="text-emerald-400">•</span>
              <span className="font-normal text-emerald-700 truncate max-w-[140px] sm:max-w-none">{brandTagline}</span>
            </div>

            {/* Titular Principal Persuasivo (Escala tipográfica segura para 320px-375px) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Comodidad y estilo en cada paso con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                {brandName}
              </span>
            </h1>

            {/* Subtítulo enfocado en Confort y Amortiguación */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
              Descubre nuestra nueva línea de zapatillas diseñadas para acompañar tu ritmo diario con el mejor confort, amortiguación reactiva y materiales de alta durabilidad.
            </p>

            {/* Grupo de Acciones (Ancho completo en móvil con touch-manipulation) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto">
              <a
                href="#productos"
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm sm:text-base shadow-lg shadow-gray-900/15 hover:shadow-xl hover:shadow-gray-900/25 active:scale-95 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 touch-manipulation"
                aria-label="Ver colección completa de zapatillas"
              >
                <span>Ver Colección</span>
                <svg
                  className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>

              <a
                href="#nosotros"
                className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-base border border-gray-200 shadow-sm active:scale-95 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 touch-manipulation"
              >
                <span>Conócenos</span>
              </a>
            </div>

            {/* Garantías Rápidas / Micro-Beneficios (Apilado vertical en celulares para evitar compresión) */}
            <div className="pt-5 border-t border-gray-200/60 w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-xs sm:text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Envíos rápidos a todo el país</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>100% Calidad comprobada</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>WhatsApp directo sin bots</span>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Fotografía de Calzado de Alto Impacto */}
          <div className="relative group w-full max-w-lg mx-auto md:max-w-none">
            {/* Halo de luz ambiental difuminada */}
            <div
              className="absolute -inset-3 bg-gradient-to-tr from-emerald-500/25 via-teal-400/20 to-emerald-600/15 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"
              aria-hidden="true"
            ></div>

            {/* Contenedor de la Imagen */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl bg-white border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000"
                alt={`Calzado urbano y deportivo de la colección ${brandName}`}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />

              {/* Tag flotante estilo Glassmorphism adaptable a móviles */}
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-white/90 backdrop-blur-md border border-white/60 shadow-lg rounded-xl p-2.5 sm:p-3 flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">Edición Limitada</span>
                </div>
                <span className="text-[11px] sm:text-xs text-gray-500 font-medium">Stock disponible</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
