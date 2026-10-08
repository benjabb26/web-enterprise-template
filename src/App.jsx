import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './core/components/Navbar.jsx';
import Footer from './core/components/Footer.jsx';
import HeroSection from './domains/storefront/components/HeroSection.jsx';
import AboutUs from './domains/storefront/components/AboutUs.jsx';
import ProductGrid from './domains/storefront/components/ProductGrid.jsx';
import ProductDetail from './domains/storefront/components/ProductDetail.jsx';
import StoreLocation from './domains/storefront/components/StoreLocation.jsx';
import PrivacyPolicy from './domains/storefront/pages/PrivacyPolicy.jsx';
import TermsAndConditions from './domains/storefront/pages/TermsAndConditions.jsx';
import CookiePolicy from './domains/storefront/pages/CookiePolicy.jsx';
import CookieBanner from './domains/storefront/pages/CookieBanner.jsx';

/**
 * Vista de Inicio (Home) con Portada, sección Nosotros y Ubicación oficial.
 */
const HomePage = () => (
  <>
    <HeroSection />
    <AboutUs />
    <StoreLocation />
  </>
);

/**
 * Componente principal ensamblador con arquitectura híbrida (React Router DOM + Scroll por Anclas).
 * Protegido contra desbordamiento horizontal en pantallas móviles compactas.
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col antialiased w-full overflow-x-hidden">
        {/* Navbar persistente en todas las rutas */}
        <Navbar />

        {/* Contenido enrutado dinámicamente */}
        <main className="flex-1 w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductGrid />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/ubicacion" element={<StoreLocation />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos" element={<TermsAndConditions />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            {/* Fallback para rutas inexistentes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer persistente en todas las rutas */}
        <Footer />

        {/* Banner Global de Consentimiento de Cookies */}
        <CookieBanner />
      </div>
    </Router>
  );
}

export default App;
