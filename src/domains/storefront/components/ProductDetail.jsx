import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import productsData from '../../catalog/data/products.json';
import { siteConfig } from '../../../config/siteConfig.js';

/**
 * Ícono vectorial SVG de WhatsApp
 */
const WhatsAppIcon = ({ className = "w-5 h-5 shrink-0" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/**
 * Componente ProductDetail (Página de Detalle del Producto - PDP)
 * Flujo de compra optimizado: Selección obligatoria de talla antes de generar el pedido a WhatsApp.
 */
export const ProductDetail = () => {
  const { id } = useParams();
  const carouselRef = useRef(null);

  // Búsqueda del producto
  const product = productsData.find((p) => String(p.id) === String(id));

  // Estados interactivos
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(product?.image || '');

  // Arreglo de tallas de calzado
  const sizes = [38, 39, 40, 41, 42];

  // Reset y scroll suave al cargar o cambiar de producto
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedSize(null);
    if (product) {
      setActiveImage(product.image);
    }
  }, [id, product]);

  // Si el producto no existe en el catálogo
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <span className="text-6xl">👟</span>
        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900">
          Producto no encontrado
        </h1>
        <p className="mt-2 text-base text-gray-600 max-w-md">
          El modelo que estás buscando no existe o ha sido retirado de nuestra colección activa.
        </p>
        <Link
          to="/productos"
          className="mt-6 min-h-[44px] px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <span>Volver al Catálogo</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    );
  }

  // Galería de 3 ángulos simulados
  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80'
  ];

  // Productos para venta cruzada (10 productos distintos al actual)
  const relatedProducts = productsData
    .filter((p) => String(p.id) !== String(id))
    .slice(0, 10);

  // Manejador del click a WhatsApp con validación estricta de talla
  const handleWhatsAppClick = () => {
    if (!selectedSize) {
      alert("Por favor, selecciona una talla antes de continuar.");
      return;
    }
    const message = `Hola, me interesa el modelo ${product.name} por ${product.price}. ¿Aún tienen stock disponible en talla ${selectedSize}?`;
    const phone = siteConfig?.whatsappNumber || '51999999999';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Controles de desplazamiento para el carrusel de venta cruzada
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 w-full py-8 sm:py-12 lg:py-16 bg-gray-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb de Navegación */}
        <nav className="mb-6 sm:mb-8 flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium" aria-label="Migas de pan">
          <Link to="/" className="hover:text-gray-900 transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/productos" className="hover:text-gray-900 transition-colors">Productos</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Ficha Principal de Producto (Flujo Natural Móvil: flex-col, Desktop: md:grid md:grid-cols-2) */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
          
          {/* Columna 1: Galería de Imágenes (Arriba en móvil) */}
          <div className="w-full space-y-3 sm:space-y-4">
            {/* Imagen Principal en Gran Formato */}
            <div className="relative aspect-square overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-xl group">
              <img
                src={activeImage || product.image}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000';
                }}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                {product.category || 'Edición Oficial'}
              </div>
            </div>

            {/* Fila de 3 Miniaturas Interactivas */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {galleryImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgSrc)}
                  className={`relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white border transition-all touch-manipulation cursor-pointer ${
                    activeImage === imgSrc
                      ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-md scale-102'
                      : 'border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`Ver ángulo ${idx + 1} de ${product.name}`}
                >
                  <img
                    src={imgSrc || product.image}
                    alt={`Vista ${idx + 1}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600';
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Columna 2: Información y Compra (Abajo en móvil con flujo natural) */}
          <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-gray-100 shadow-sm space-y-6 sm:space-y-7">
            
            {/* Header del Producto */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {siteConfig.businessName}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-semibold text-gray-500">
                  {product.category || 'Colección Urbana'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Precio Destacado */}
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-600 bg-emerald-50/80 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl inline-block shadow-sm">
                {product.price}
              </div>
              <p className="mt-1.5 text-xs text-gray-400 font-medium">
                Precio final con entrega coordinada por WhatsApp
              </p>
            </div>

            {/* Descripción */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Viñetas de Detalles de Valor Técnicos */}
            <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-600">
              <div className="flex items-start gap-2.5">
                <span className="text-base">👟</span>
                <div>
                  <strong className="text-gray-900">Material:</strong> Cuero sintético reforzado y tejido transpirable de alta resistencia.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-base">☁️</span>
                <div>
                  <strong className="text-gray-900">Comodidad:</strong> Suela ergonómica con tecnología de amortiguación reactiva antifatiga.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-base">🎯</span>
                <div>
                  <strong className="text-gray-900">Ajuste:</strong> Calce anatómico urbano con sistema de cordones de sujeción firme.
                </div>
              </div>
            </div>

            {/* Selector de Tallas Interactivo (Ubicado inmediatamente encima del botón de compra) */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">
                  Selecciona tu talla
                </h3>
                {selectedSize ? (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    Talla seleccionada: {selectedSize}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-amber-600">
                    Requerido para comprar
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] rounded-xl font-bold text-sm flex items-center justify-center transition-all touch-manipulation cursor-pointer ${
                      selectedSize === size
                        ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/30 scale-105 border-2 border-emerald-800'
                        : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 border border-gray-200'
                    }`}
                    aria-label={`Seleccionar talla ${size}`}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Call to Action Principal de WhatsApp */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-full min-h-[52px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-base sm:text-lg shadow-lg shadow-emerald-600/25 inline-flex items-center justify-center gap-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 cursor-pointer touch-manipulation"
                aria-label={`Comprar ${product.name} por WhatsApp`}
              >
                <WhatsAppIcon className="w-6 h-6 shrink-0" />
                <span>Comprar por WhatsApp</span>
              </button>

              {/* Micro-Garantías de Confianza */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <span>🔒</span> Compra segura
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span>📦</span> Envíos a todo el país
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span>⚡</span> Respuesta rápida
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Sección Cross-selling (Venta Cruzada) con Botones 'Ver más' */}
        <section className="mt-12 sm:mt-20 pt-8 sm:pt-12 border-t border-gray-200" aria-label="Productos recomendados">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Recomendados
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                También te podría interesar
              </h2>
            </div>

            {/* Flechas de Navegación del Carrusel */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95 shadow-sm transition-all cursor-pointer touch-manipulation"
                aria-label="Ver productos anteriores"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95 shadow-sm transition-all cursor-pointer touch-manipulation"
                aria-label="Ver productos siguientes"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carrusel Desplazable Horizontal con Botones 'Ver más' */}
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {relatedProducts.map((relProduct) => (
              <article
                key={relProduct.id}
                className="w-[260px] sm:w-[280px] shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <Link
                  to={`/producto/${relProduct.id}`}
                  className="block relative aspect-square overflow-hidden bg-gray-100 group/img touch-manipulation"
                  aria-label={`Ver detalles de ${relProduct.name}`}
                >
                  <img
                    src={relProduct.image}
                    alt={relProduct.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=700';
                    }}
                    className="w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/60">
                    <span className="text-xs font-extrabold text-gray-900">{relProduct.price}</span>
                  </div>
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/producto/${relProduct.id}`} className="block group/title touch-manipulation">
                      <h3 className="text-base font-bold text-gray-900 group-hover/title:text-emerald-700 transition-colors truncate">
                        {relProduct.name}
                      </h3>
                    </Link>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">{relProduct.category || 'Urbana'}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link
                      to={`/producto/${relProduct.id}`}
                      className="w-full min-h-[44px] px-3 py-2.5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-semibold text-xs shadow-sm hover:shadow transition-all touch-manipulation cursor-pointer"
                    >
                      <span>Ver más</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ProductDetail;
