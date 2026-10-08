import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig.js';

/**
 * Componente PrivacyPolicy (Política de Privacidad)
 * Conforme a estándares de protección de datos personales y transparencia para e-commerce.
 */
export const PrivacyPolicy = () => {
  const brandName = siteConfig?.businessName || 'Aura Store';
  const address = siteConfig?.storeLocation?.address || 'Lima, Perú';
  const phone = siteConfig?.storeLocation?.phone || '+51 999 888 777';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="py-10 sm:py-16 bg-gray-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb de Retorno */}
        <nav className="mb-8 flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium" aria-label="Migas de pan">
          <Link to="/" className="hover:text-gray-900 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Política de Privacidad</span>
        </nav>

        {/* Encabezado Principal */}
        <header className="mb-10 pb-6 border-b border-gray-200">
          <span className="text-emerald-600 text-xs sm:text-sm font-bold tracking-wider uppercase">
            Documento Legal Oficial
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Política de Privacidad y Protección de Datos
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Última actualización: {new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
          </p>
        </header>

        {/* Contenido Formal Legal */}
        <article className="prose prose-emerald max-w-none bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
          
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              1. Identificación del Responsable del Tratamiento
            </h2>
            <p>
              El presente documento establece los términos bajo los cuales <strong>{brandName}</strong> (en adelante, "la Tienda"), domiciliada para efectos legales en <em>{address}</em>, recopila, utiliza, resguarda y protege la información que es proporcionada por sus usuarios y clientes al navegar por nuestro portal web o interactuar mediante nuestros canales oficiales de mensajería (WhatsApp).
            </p>
            <p>
              Para cualquier consulta sobre la privacidad de sus datos personales, puede comunicarse con nosotros vía telefónica o WhatsApp al <strong>{phone}</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              2. Información que Recopilamos
            </h2>
            <p>
              En {brandName} recopilamos únicamente los datos necesarios para brindar una atención comercial transparente, personalizada y eficiente:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li><strong>Datos de contacto voluntario:</strong> Nombres, apellidos, número de teléfono (WhatsApp) y dirección de entrega facilitados directamente por usted al solicitar información de modelos, consultar stock o concretar un pedido.</li>
              <li><strong>Datos técnicos y de navegación:</strong> Dirección IP anonimizada, tipo de navegador, sistema operativo y páginas visitadas dentro del catálogo, recolectadas mediante cookies con fines estadísticos y de mejora de experiencia de usuario.</li>
              <li><strong>Historial de preferencias:</strong> Tallas de calzado de interés, modelos consultados y rango de precios preferidos.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              3. Finalidad del Tratamiento de los Datos
            </h2>
            <p>
              La información recopilada tiene como finalidades exclusivas las siguientes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Atención directa y personalizada de pedidos a través del canal de WhatsApp.</li>
              <li>Coordinación de envíos y logística de entrega de calzado a nivel nacional o retiro en tienda física.</li>
              <li>Resolución de dudas sobre autenticidad, equivalencias de tallas EU/US y cuidado del calzado.</li>
              <li>Optimización continua de la velocidad, diseño responsive y navegación de nuestro catálogo digital.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              4. Confidencialidad y No Transferencia a Terceros
            </h2>
            <p>
              {brandName} asume el compromiso ético y legal de no vender, ceder, alquilar ni transferir su información personal a terceras entidades comerciales. Sus datos únicamente serán compartidos con empresas de transporte y mensajería logística estrictamente para la entrega física de sus zapatillas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              5. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
            </h2>
            <p>
              Conforme a la normativa de Protección de Datos Personales (Ley N° 29733 y su Reglamento), usted cuenta con el derecho irrevocable de acceder a sus datos personales en posesión de {brandName}, solicitar la rectificación en caso de ser inexactos o pedir la cancelación total de los mismos de nuestros registros. Para ejercer estos derechos, puede escribirnos directamente a nuestro canal oficial de WhatsApp.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              6. Seguridad y Enlaces a Terceros
            </h2>
            <p>
              Implementamos protocolos técnicos modernos de encriptación y navegación segura HTTPS. Nuestro catálogo incluye enlaces directos a WhatsApp y Google Maps para la conveniencia del usuario; le recordamos que al ingresar a dichas plataformas externas, aplican los términos y políticas de privacidad de sus respectivos proveedores (Meta Platforms, Google LLC).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              7. Modificaciones a la Política
            </h2>
            <p>
              {brandName} se reserva el derecho de actualizar la presente política periódicamente a fin de reflejar mejoras técnicas, normativas o en los procesos operativos de la tienda. Cualquier cambio sustancial será publicado en esta misma sección.
            </p>
          </section>

        </article>

        {/* Botón de Retorno Inferior */}
        <div className="mt-8 text-center">
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all shadow-md active:scale-95"
          >
            <span>Explorar Catálogo de Zapatillas</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
