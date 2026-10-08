import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../../config/siteConfig.js';

/**
 * Componente CookiePolicy (Política de Cookies)
 * Explica la naturaleza, tipología y administración de cookies y almacenamiento local.
 */
export const CookiePolicy = () => {
  const brandName = siteConfig?.businessName || 'Aura Store';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleResetCookieConsent = () => {
    try {
      localStorage.removeItem('aura_cookie_consent');
      window.location.reload();
    } catch (e) {
      console.warn('Error al reiniciar cookies:', e);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-gray-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb de Retorno */}
        <nav className="mb-8 flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium" aria-label="Migas de pan">
          <Link to="/" className="hover:text-gray-900 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Política de Cookies</span>
        </nav>

        {/* Encabezado Principal */}
        <header className="mb-10 pb-6 border-b border-gray-200">
          <span className="text-emerald-600 text-xs sm:text-sm font-bold tracking-wider uppercase">
            Transparencia Digital
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Política de Cookies y Almacenamiento Web
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Última revisión: {new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })} | {brandName}
          </p>
        </header>

        {/* Contenido Formal Legal */}
        <article className="prose prose-emerald max-w-none bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
          
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              1. ¿Qué son las Cookies y el Almacenamiento Local?
            </h2>
            <p>
              Una cookie es un pequeño archivo de texto que los sitios web almacenan en su navegador o dispositivo al visitarlos. Las cookies y tecnologías similares (como <code>localStorage</code>) permiten que la plataforma reconozca su dispositivo en visitas posteriores, recuerde sus preferencias de navegación y garantice una experiencia ágil y sin interrupciones técnicas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              2. ¿Qué tipos de cookies utiliza {brandName}?
            </h2>
            <p>
              En {brandName} utilizamos cookies clasificadas en las siguientes categorías funcionales:
            </p>
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  a) Cookies Técnicas y Esenciales (Obligatorias)
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  Son indispensables para el funcionamiento correcto de la tienda web. Permiten la navegación fluida entre páginas, la carga del catálogo interactivo, el funcionamiento del carrito de consulta y el almacenamiento de su consentimiento sobre cookies (ej. <code>aura_cookie_consent</code>).
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  b) Cookies de Preferencias y Personalización
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  Permiten recordar sus configuraciones elegidas dentro del catálogo, tales como marcas seleccionadas, categorías de calzado consultadas previamente y el rango de precios filtrado.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  c) Cookies de Terceros y Servicios Integrados
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  En nuestra sección "Dónde Encontrarnos", incorporamos un mapa interactivo de <strong>Google Maps</strong> para facilitarle la ubicación y ruta hacia nuestra sede en Miraflores. Google puede instalar cookies propias para registrar preferencias de mapas y seguridad según sus políticas de privacidad.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              3. ¿Cómo configurar o revocar el consentimiento de cookies?
            </h2>
            <p>
              Usted tiene control absoluto sobre las cookies en todo momento:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li><strong>Desde este sitio web:</strong> Puede reiniciar su preferencia haciendo clic en el botón situado al pie de esta página, lo cual reabrirá el banner de cookies.</li>
              <li><strong>Desde su navegador:</strong> Puede bloquear, restringir o eliminar las cookies instaladas configurando las opciones de su navegador web (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge). Tenga en cuenta que al deshabilitar cookies técnicas, algunas funciones visuales del catálogo podrían verse afectadas.</li>
            </ul>
          </section>

          {/* Bloque de Reinicio de Preferencias */}
          <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm text-emerald-950">
                ¿Deseas cambiar tu preferencia de consentimiento?
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                Restablece tus preferencias guardadas y vuelve a configurar el banner de cookies.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetCookieConsent}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer touch-manipulation"
            >
              Reiniciar Preferencias
            </button>
          </div>

        </article>

        {/* Botón de Retorno Inferior */}
        <div className="mt-8 text-center">
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all shadow-md active:scale-95"
          >
            <span>Volver al Catálogo</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CookiePolicy;
