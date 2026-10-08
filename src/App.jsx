import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import HeroSection from './components/sections/HeroSection.jsx';
import AboutUs from './components/sections/AboutUs.jsx';
import ProductGrid from './components/sections/ProductGrid.jsx';
import ProductDetail from './components/sections/ProductDetail.jsx';
import StoreLocation from './components/sections/StoreLocation.jsx';
import PrivacyPolicy from './components/legal/PrivacyPolicy.jsx';
import TermsAndConditions from './components/legal/TermsAndConditions.jsx';
import CookiePolicy from './components/legal/CookiePolicy.jsx';
import CookieBanner from './components/legal/CookieBanner.jsx';

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
