import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig.js';

/**
 * Componente TermsAndConditions (Términos y Condiciones Generales de Venta)
 * Regula la contratación comercial, autenticidad, envíos, cambios y garantías de calzado.
 */
export const TermsAndConditions = () => {
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
          <span className="text-gray-900 font-semibold">Términos y Condiciones</span>
        </nav>

        {/* Encabezado Principal */}
        <header className="mb-10 pb-6 border-b border-gray-200">
          <span className="text-emerald-600 text-xs sm:text-sm font-bold tracking-wider uppercase">
            Marco Contractual y Operativo
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Términos y Condiciones de Compra y Servicio
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Vigente desde: {new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })} | {brandName}
          </p>
        </header>

        {/* Contenido Formal Legal */}
        <article className="prose prose-emerald max-w-none bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
          
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              1. Aceptación y Alcance del Servicio
            </h2>
            <p>
              El acceso, navegación y uso del catálogo virtual de <strong>{brandName}</strong>, así como la concreción de pedidos a través de nuestro canal verificado de WhatsApp o en nuestra tienda física ubicada en <em>{address}</em>, implica la aceptación plena e incondicional de los presentes Términos y Condiciones por parte del usuario o comprador.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              2. Autenticidad y Calidad de las Zapatillas
            </h2>
            <p>
              En {brandName} comercializamos calzado de las marcas más reconocidas a nivel global (incluyendo Nike, Adidas, Puma, New Balance, Jordan, Asics, Converse, Vans). Garantizamos que:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Todos los modelos comercializados son 100% auténticos, nuevos e inspeccionados rigurosamente antes de su despacho.</li>
              <li>El producto se entrega con su caja oficial, etiquetas de fábrica y accesorios correspondientes según el modelo y lote del fabricante.</li>
              <li>Las imágenes exhibidas en el catálogo buscan reflejar fielmente el diseño, textura y colores reales del calzado, pudiendo existir variaciones mínimas según el calibrado de pantalla del dispositivo del usuario.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              3. Precios, Moneda y Disponibilidad de Stock
            </h2>
            <p>
              Todos los precios consignados en nuestra plataforma web están expresados en Soles Peruanos (S/) e incluyen los impuestos de ley aplicables. Debido a la alta rotación de zapatillas exclusivas y ediciones limitadas, la confirmación final de stock en la talla solicitada se realiza de manera inmediata en el chat directo de WhatsApp con nuestro equipo asesor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              4. Flujo de Pedido y Compra Asistida por WhatsApp
            </h2>
            <p>
              Para brindar una experiencia sin fricción y con asesoría humana en tallas:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-gray-600">
              <li>El cliente selecciona el modelo y su talla exacta en la ficha del producto.</li>
              <li>Al pulsar "Comprar por WhatsApp", se genera un mensaje estructurado con el nombre del modelo, precio y talla hacia el número oficial ({phone}).</li>
              <li>Un asesor confirma la reserva de stock, valida la dirección de destino o coordina el retiro en tienda, y proporciona los datos de pago seguro.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              5. Medios de Pago Aceptados
            </h2>
            <p>
              {brandName} acepta los siguientes métodos de pago seguros y verificables:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Transferencias bancarias directas e interbancarias (BCP, BBVA, Interbank, Scotiabank).</li>
              <li>Billeteras digitales móviles (Yape y Plin).</li>
              <li>Tarjetas de débito y crédito (Visa, Mastercard, Amex) para compras presenciales en sede oficial.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              6. Políticas de Envío y Plazos de Entrega
            </h2>
            <p>
              Realizamos despachos en dos modalidades:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li><strong>Lima Metropolitana:</strong> Entregas rápidas en 24 a 48 horas hábiles mediante servicio motorizado de confianza con tracking en tiempo real.</li>
              <li><strong>Provincias a Nivel Nacional:</strong> Despachos vía agencias de encomienda y logística certificadas (Olva Courier, Shalom, Marvisur) con código de seguimiento provisto al cliente. Plazo habitual de 48 a 72 horas hábiles.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              7. Cambios de Talla, Devoluciones y Garantías
            </h2>
            <p>
              Entendemos la importancia de que tu calzado calce a la perfección. Contamos con una política clara de satisfacción:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li><strong>Plazo para cambio de talla:</strong> Hasta 7 días calendario posteriores a la recepción del pedido.</li>
              <li><strong>Condiciones del producto:</strong> El calzado debe encontrarse sin señales de uso en exteriores, suela intacta, en su caja original, con etiquetas y accesorios completos.</li>
              <li><strong>Garantía por defecto de fabricación:</strong> Cobertura de 30 días calendario para fallas estructurales comprobables (despegue prematuro de suela o costuras anómalas). No cubre desgaste natural por uso intensivo ni maltrato.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">
              8. Atención al Cliente y Libro de Reclamaciones
            </h2>
            <p>
              Para cualquier requerimiento, queja o sugerencia, nuestro equipo está a su disposición de Lunes a Sábado de 9:00 AM a 8:00 PM vía WhatsApp o en nuestra sede física.
            </p>
          </section>

        </article>

        {/* Botón de Retorno Inferior */}
        <div className="mt-8 text-center">
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all shadow-md active:scale-95"
          >
            <span>Ver Catálogo de Productos</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TermsAndConditions;
