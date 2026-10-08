import React from 'react';
import { siteConfig } from '../../../config/siteConfig.js';
import { generateWhatsAppLink } from '../../../core/utils/whatsapp.js';

/**
 * Componente StoreLocation (Sección Dónde Encontrarnos)
 * Muestra información detallada de la sede oficial y un iframe interactivo de Google Maps.
 */
export const StoreLocation = () => {
  const brandName = siteConfig?.businessName || 'Aura Store';
  const location = siteConfig?.storeLocation || {
    name: "Aura Store - Sede Principal",
    address: "Av. José Larco 1045, Miraflores, Lima 15074, Perú",
    reference: "A dos cuadras del Parque Kennedy",
    phone: "+51 999 888 777",
    schedule: "Lunes a Sábado: 9:00 AM - 8:00 PM | Domingos: 10:00 AM - 4:00 PM",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.7497746431713!2d-77.03154862415951!3d-12.122416043513374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c81926fb2ebf%3A0xb35a4d92419f85c1!2sAv.%20Jos%C3%A9%20Larco%201045%2C%20Miraflores%2015074!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe",
    googleMapsUrl: "https://maps.google.com/?q=Av.+Jos%C3%A9+Larco+1045,+Miraflores,+Lima,+Per%C3%BA"
  };

  const waVisitUrl = generateWhatsAppLink(
    siteConfig?.whatsappNumber,
    `Hola ${brandName}, deseo coordinar una visita a su sede de ${location.address}. ¿Tienen atención hoy?`
  );

  return (
    <section
      id="ubicacion"
      className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-emerald-50/20 to-white overflow-hidden scroll-mt-20"
      aria-label="Ubicación de la tienda y mapa interactivo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera de la Sección */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs sm:text-sm font-semibold tracking-wide uppercase">
            Visítanos en Tienda
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Dónde Encontrarnos
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
            Visita nuestra sede oficial y prueba tus zapatillas favoritas en persona con atención experta y stock inmediato.
          </p>
        </div>

        {/* Cuadrícula Principal: Información (Col 1) + Mapa Google (Col 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Columna 1: Datos de la Sede y Micro-Beneficios */}
          <div className="space-y-6">
            
            {/* Tarjeta de Datos de Contacto y Dirección */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {location.name}
                </h3>
                <p className="mt-1 text-sm text-emerald-700 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Atención presencial activa</span>
                </p>
              </div>

              <div className="space-y-3.5 pt-2 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-gray-900 font-semibold">Dirección:</strong>
                    <span>{location.address}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Ref: {location.reference}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-gray-900 font-semibold">Horario de Atención:</strong>
                    <span>{location.schedule}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-gray-900 font-semibold">Contacto Directo:</strong>
                    <span>{location.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Micro-Beneficios en Tienda Física */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-xl">👟</span>
                <p className="font-bold text-xs text-gray-900 mt-1">Prueba de Tallas</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Confirma tu ajuste perfecto sin dudar.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-xl">🤝</span>
                <p className="font-bold text-xs text-gray-900 mt-1">Atención Experta</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Asesoría de estilo y cuidado de zapatillas.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-xl">💳</span>
                <p className="font-bold text-xs text-gray-900 mt-1">Todos los Pagos</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Yape, Plin, tarjetas y transferencias.</p>
              </div>
            </div>

            {/* Botones de Acción: Google Maps & WhatsApp */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm shadow-md active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                aria-label="Abrir ruta hacia Aura Store en Google Maps"
              >
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Cómo Llegar en Google Maps</span>
              </a>

              <a
                href={waVisitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                aria-label="Coordinar visita a tienda por WhatsApp"
              >
                <span>💬</span>
                <span>Coordinar Visita</span>
              </a>
            </div>

          </div>

          {/* Columna 2: Iframe Embed Responsivo de Google Maps */}
          <div className="relative w-full overflow-hidden rounded-3xl shadow-xl border border-gray-200 bg-white">
            <iframe
              src={location.googleMapsEmbedUrl}
              title={`Mapa de localización de ${brandName}`}
              className="w-full h-[360px] sm:h-[450px] lg:h-[480px] border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>

      </div>
    </section>
  );
};

export default StoreLocation;
