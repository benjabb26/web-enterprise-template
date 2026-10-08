import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente CookieBanner (Banner Flotante de Consentimiento de Cookies)
 * Persiste la decisión en localStorage ('aura_cookie_consent').
 * Si ya fue respondido, no se renderiza.
 */
export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('aura_cookie_consent');
      if (!consent) {
        // Leve retraso para una aparición suave y no intrusiva al cargar la app
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Acceso a localStorage bloqueado o no disponible:', e);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('aura_cookie_consent', 'accepted');
    } catch (e) {
      console.warn('Error al guardar consentimiento:', e);
    }
    setIsVisible(false);
  };

  const handleRejectOrEssential = () => {
    try {
      localStorage.setItem('aura_cookie_consent', 'essential');
    } catch (e) {
      console.warn('Error al guardar consentimiento:', e);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Consentimiento de cookies"
      role="dialog"
      aria-modal="false"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-gray-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-gray-800 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 mt-0.5">🍪</span>
        <div className="space-y-2 flex-1">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Aviso de Privacidad y Cookies
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Utilizamos cookies propias y de terceros para garantizar la mejor experiencia en nuestra tienda, recordar tus modelos y tallas preferidas, y mostrar mapas de ubicación. Puedes consultar nuestra{' '}
            <Link
              to="/cookies"
              onClick={() => setIsVisible(false)}
              className="text-emerald-400 hover:text-emerald-300 underline font-medium focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded"
            >
              Política de Cookies
            </Link>.
          </p>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={handleRejectOrEssential}
          className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-800 border border-gray-700 active:scale-95 transition-all cursor-pointer touch-manipulation"
        >
          Solo esenciales
        </button>
        <button
          type="button"
          onClick={handleAcceptAll}
          className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer touch-manipulation"
        >
          Aceptar todas
        </button>
      </div>
    </aside>
  );
};

export default CookieBanner;
