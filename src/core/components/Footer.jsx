import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';
import { generateWhatsAppLink } from '../utils/whatsapp.js';

/**
 * Ícono vectorial SVG oficial de WhatsApp optimizado para contraste en fondos oscuros.
 */
const WhatsAppIcon = () => (
  <svg
    className="w-4 h-4 shrink-0 text-emerald-400"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/**
 * Componente Footer (Pie de Página Principal).
 * 
 * Principios de Diseño y HCI aplicados:
 * - Contraste y Cierre Visual: Acabado oscuro refinado (`bg-gray-950 text-gray-300`) que ofrece
 *   una delimitación visual nítida y profesional al finalizar el recorrido del usuario.
 * - Grid Armónico Responsive: Se adapta orgánicamente de 1 a 4 columnas según el viewport.
 * - Navegación Cómoda con React Router: Enlaces fluidos a '/', '/#nosotros' y '/productos'.
 * - Cero Hardcoding: Lee `siteConfig` dinámicamente y calcula el año actual en tiempo de render.
 *
 * @param {Object} props
 * @param {string} [props.businessName] - Nombre del comercio (fallback a siteConfig.businessName).
 * @param {string} [props.tagline] - Frase distintiva (fallback a siteConfig.tagline).
 * @param {string} [props.whatsappNumber] - Número de WhatsApp.
 * @returns {JSX.Element}
 */
export const Footer = ({
  businessName,
  tagline,
  whatsappNumber
}) => {
  const brandName = businessName || siteConfig?.businessName || 'Aura Store';
  const brandTagline = tagline || siteConfig?.tagline || 'Estilo urbano en tus pies';
  const targetPhone = whatsappNumber || siteConfig?.whatsappNumber;
  const waUrl = generateWhatsAppLink(targetPhone, `Hola, me comunico desde el pie de página de ${brandName}`);

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Nosotros', to: '/#nosotros' },
    { label: 'Nuestra Sede', to: '/#ubicacion' },
    { label: 'Productos', to: '/productos' },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 pb-12 sm:pb-16">
        
        {/* Estructura Principal: Grid de 4 Columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Columna 1: Identidad y Propuesta de Valor */}
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="inline-block text-white font-extrabold text-2xl tracking-tight hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
              aria-label={`${brandName} - Inicio`}
            >
              {brandName}
            </Link>
            <p className="text-sm text-emerald-400 font-medium">
              {brandTagline}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Calzado urbano diseñado para ofrecer el máximo confort, amortiguación reactiva y autenticidad en cada paso.
            </p>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">
              Navegación
            </h3>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-1.5 py-1 text-gray-400 hover:text-white hover:translate-x-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded touch-manipulation"
                  >
                    <span className="text-emerald-500 text-xs">›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Atención y Contacto */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">
              Atención & Ventas
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-gray-900 border border-gray-800 text-emerald-400 hover:text-emerald-300 hover:bg-gray-850 hover:border-emerald-500/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 touch-manipulation"
                aria-label={`Escribir a WhatsApp de ${brandName}`}
              >
                <WhatsAppIcon />
                <span className="font-medium">Chatear por WhatsApp</span>
              </a>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Horario:</p>
                <p className="text-xs text-gray-400">Lun - Sáb: 9:00 AM - 8:00 PM</p>
                <p className="text-xs text-gray-400">Dom: 10:00 AM - 4:00 PM</p>
              </div>
              <p className="text-xs text-emerald-400/90 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
                <span>Asesoría personalizada y directa</span>
              </p>
            </div>
          </div>

          {/* Columna 4: Garantías & Confianza */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">
              Confianza & Seguridad
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Envíos seguros a nivel nacional con seguimiento.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Calidad garantizada en cada par de calzado.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Compra directa y transparente sin intermediarios.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Barra Inferior de Copyright y Enlaces Legales */}
        <div className="mt-12 pt-8 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center sm:text-left">
            © {currentYear} <span className="text-gray-300 font-medium">{brandName}</span>. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-gray-400">
            <Link to="/privacidad" className="hover:text-emerald-400 transition-colors">
              Política de Privacidad
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/terminos" className="hover:text-emerald-400 transition-colors">
              Términos y Condiciones
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/cookies" className="hover:text-emerald-400 transition-colors">
              Política de Cookies
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
