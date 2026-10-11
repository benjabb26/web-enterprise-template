import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';

// Fallback de alta resolución para calzado
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000';

/**
 * Formatea precio numérico o string a convención monetaria formal "S/ xx.xx".
 */
const formatPrice = (val) => {
  if (val === undefined || val === null) return 'S/ 0.00';
  if (typeof val === 'number') {
    return `S/ ${val.toFixed(2)}`;
  }
  const clean = String(val).trim();
  if (clean.startsWith('S/')) return clean;
  const num = parseFloat(clean.replace(/[^\d.]/g, ''));
  return !isNaN(num) ? `S/ ${num.toFixed(2)}` : clean;
};

/**
 * Componente ProductDetail (Vista de Detalle del Producto e Inventario Relacional de Tallas)
 */
export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados del ciclo de vida del producto
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [productosSimilares, setProductosSimilares] = useState([]);

  // Referencia y funciones de desplazamiento para el carrusel de productos similares
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -220, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 220, behavior: 'smooth' });
  };

  // Carga asíncrona de datos desde Supabase con prevención de fugas de memoria
  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setCargando(true);
    setError(null);
    setTallaSeleccionada(null);
    setCantidad(1);
    setProductosSimilares([]);

    catalogService.getProductById(id)
      .then((data) => {
        if (isMounted) {
          if (!data) {
            setError('Producto no encontrado');
          } else {
            setProducto(data);
            // Carga asíncrona de productos similares basados en marca y categoría
            catalogService.getSimilarProducts(data.id_producto || data.id, data.marca, data.categoria)
              .then((similares) => {
                if (isMounted) {
                  setProductosSimilares(similares || []);
                }
              })
              .catch((err) => {
                console.error('Error al cargar productos similares:', err);
                if (isMounted) {
                  setProductosSimilares([]);
                }
              });
          }
          setCargando(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Error al cargar el producto');
          setCargando(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Manejador de compra directa hacia la vista de Checkout
  const handleBuyNow = () => {
    if (!producto) return;

    const tieneTallas = Array.isArray(producto.inventario_tallas) && producto.inventario_tallas.length > 0;
    if (tieneTallas && !tallaSeleccionada) {
      alert('Por favor, selecciona una talla antes de continuar con la compra.');
      return;
    }

    const precioNumerico = typeof (producto.precio_actual ?? producto.price) === 'number'
      ? (producto.precio_actual ?? producto.price)
      : parseFloat(String(producto.precio_actual ?? producto.price ?? 0).replace(/[^\d.]/g, '')) || 0;

    const itemCompra = {
      id_producto: producto.id_producto ?? producto.id,
      talla: tallaSeleccionada ? String(tallaSeleccionada.talla) : 'Única',
      cantidad: Number(cantidad) || 1,
      precio: precioNumerico,
      precio_unitario: precioNumerico,
      nombre: producto.nombre || producto.name,
      imagen_url: producto.imagen_url || producto.image,
      marca: producto.marca,
    };

    navigate('/checkout', { state: { items: [itemCompra] } });
  };

  // Renderizado Condicional: Estado Cargando
  if (cargando) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 bg-gray-50/50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-base font-semibold text-gray-700 animate-pulse">Cargando producto...</p>
      </div>
    );
  }

  // Renderizado Condicional: Estado Error o No Encontrado
  if (error || !producto) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center bg-gray-50/50">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-3xl mb-4 shadow-sm border border-red-100">
          ⚠️
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          No se pudo cargar el producto
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-md">
          {error || 'El modelo que estás buscando no existe o ha sido retirado de nuestro catálogo activo.'}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setCargando(true);
              setError(null);
              setProductosSimilares([]);
              catalogService.getProductById(id)
                .then((data) => {
                  setProducto(data);
                  if (data) {
                    catalogService.getSimilarProducts(data.id_producto || data.id, data.marca, data.categoria)
                      .then((similares) => {
                        setProductosSimilares(similares || []);
                      })
                      .catch((err) => {
                        console.error('Error al cargar productos similares:', err);
                        setProductosSimilares([]);
                      });
                  }
                  setCargando(false);
                })
                .catch((err) => {
                  setError(err?.message || 'Error al cargar el producto');
                  setCargando(false);
                });
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            Reintentar
          </button>
          <Link
            to="/"
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-semibold text-sm transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver al Catálogo</span>
          </Link>
        </div>
      </div>
    );
  }

  // Extracción de datos del producto
  const nombre = producto.nombre || producto.name || 'Zapatilla Urbana';
  const marca = producto.marca;
  const categoria = producto.categoria || producto.category || 'Colección Oficial';
  const descripcion = producto.descripcion || producto.description || 'Calzado urbano con diseño premium y máxima amortiguación ergonómica.';
  const precioDisplay = formatPrice(producto.precio_actual || producto.price);
  const imagenUrl = producto.imagen_url || producto.image || FALLBACK_IMAGE;
  const tieneTallas = Array.isArray(producto.inventario_tallas) && producto.inventario_tallas.length > 0;

  return (
    <div className="relative z-10 w-full py-8 sm:py-12 lg:py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Barra Superior con Enlace de Retorno al Catálogo */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-emerald-700 bg-white hover:bg-emerald-50/60 border border-gray-200 hover:border-emerald-200 px-4 py-2.5 rounded-xl transition-all shadow-sm group touch-manipulation cursor-pointer"
            aria-label="Volver al catálogo"
          >
            <svg className="w-4 h-4 text-gray-500 group-hover:text-emerald-700 group-hover:-translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver al Catálogo</span>
          </Link>

          {/* Breadcrumb sutil para navegación contextual */}
          <nav className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-medium" aria-label="Migas de pan">
            <Link to="/" className="hover:text-gray-700 transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-[200px]">{nombre}</span>
          </nav>
        </div>

        {/* Layout Principal: 2 columnas en Desktop, 1 columna en Móvil */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Columna Izquierda: Imagen Grande del Producto */}
          <div className="w-full">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-md group">
              <img
                src={imagenUrl}
                alt={nombre}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Tag Flotante de Categoría */}
              <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm">
                {categoria}
              </div>

              {/* Badge Glassmorphism de Precio en la Imagen */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-white/60">
                <span className="text-sm font-extrabold text-gray-900">
                  {precioDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información del Producto e Inventario de Tallas */}
          <div className="w-full bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm space-y-6">

            {/* Cabecera / Marca y Nombre */}
            <div>
              {marca && (
                <div className="mb-2">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/60">
                    {marca}
                  </span>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {nombre}
              </h1>
            </div>

            {/* Precio Actual Destacado */}
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 bg-emerald-50/80 px-5 py-2.5 rounded-2xl inline-block shadow-sm">
                {precioDisplay}
              </div>
              <p className="mt-1.5 text-xs text-gray-400 font-medium">
                Precio final oficial. Pago seguro y despacho inmediato.
              </p>
            </div>

            {/* Descripción del Producto */}
            <div className="text-sm sm:text-base text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
              <p>{descripcion}</p>
            </div>

            {/* Inventario de Tallas Relacional */}
            {tieneTallas ? (
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Selecciona tu talla
                  </h2>
                  {tallaSeleccionada ? (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Talla elegida: <span className="font-extrabold">{tallaSeleccionada.talla}</span>
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                      Selecciona una talla para continuar
                    </span>
                  )}
                </div>

                {/* Botones de Talla con Stock Dinámico */}
                <div className="flex flex-wrap gap-2.5" role="group" aria-label="Selector de tallas">
                  {producto.inventario_tallas.map((item, idx) => {
                    const stock = Number(item.stock_talla ?? item.stock ?? 0);
                    const sinStock = stock <= 0;
                    const isSelected = tallaSeleccionada?.talla === item.talla;

                    return (
                      <button
                        key={item.id_inventario || item.id || `${item.talla}-${idx}`}
                        type="button"
                        disabled={sinStock}
                        onClick={() => {
                          if (!sinStock) {
                            setTallaSeleccionada(item);
                            setCantidad(1);
                          }
                        }}
                        className={`min-w-[48px] h-12 px-3.5 rounded-xl font-bold text-sm flex items-center justify-center transition-all touch-manipulation ${
                          sinStock
                            ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border border-dashed border-gray-300 line-through'
                            : isSelected
                              ? 'bg-gray-900 text-white border-2 border-gray-900 shadow-md scale-105'
                              : 'bg-white text-gray-800 border border-gray-200 hover:border-gray-900 hover:bg-gray-50 cursor-pointer'
                        }`}
                        aria-label={`Talla ${item.talla}${sinStock ? ' agotada' : ''}`}
                        aria-pressed={isSelected}
                      >
                        <span>{item.talla}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Indicador de Stock Disponible para la Talla Seleccionada */}
                {tallaSeleccionada && (
                  <div className="mt-3 p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 text-xs sm:text-sm text-emerald-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <p className="font-medium">
                      Stock disponible: <strong className="font-extrabold">{tallaSeleccionada.stock_talla ?? tallaSeleccionada.stock}</strong> unidades
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Mensaje cuando no tiene tallas registradas */
              <div className="pt-6 border-t border-gray-100">
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-base">ℹ️</span>
                  <p>Talla única o consultar disponibilidad directamente.</p>
                </div>
              </div>
            )}

            {/* Selector de Cantidad */}
            <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Cantidad
                </span>
                {tallaSeleccionada && (
                  <span className="text-xs text-gray-500">
                    Máx: {tallaSeleccionada.stock_talla ?? tallaSeleccionada.stock} unidades
                  </span>
                )}
              </div>

              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                  disabled={cantidad <= 1}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base font-bold cursor-pointer select-none"
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-gray-900 text-sm select-none">
                  {cantidad}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const stockDisponible = tallaSeleccionada
                      ? Number(tallaSeleccionada.stock_talla ?? tallaSeleccionada.stock ?? 99)
                      : 99;
                    setCantidad((prev) => Math.min(stockDisponible, prev + 1));
                  }}
                  disabled={
                    tallaSeleccionada
                      ? cantidad >= Number(tallaSeleccionada.stock_talla ?? tallaSeleccionada.stock ?? 1)
                      : false
                  }
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base font-bold cursor-pointer select-none"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botón de Compra Directa (Comprar ahora) */}
            <div className="pt-4 space-y-3">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full min-h-[52px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-base sm:text-lg shadow-lg shadow-emerald-600/25 inline-flex items-center justify-center gap-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 cursor-pointer touch-manipulation"
                aria-label={`Comprar ahora ${nombre}`}
              >
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Comprar ahora</span>
              </button>

              {/* Sellos de Confianza */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-gray-400 font-medium pt-2">
                <span className="flex items-center gap-1">
                  <span>🔒</span> Compra 100% segura
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span>📦</span> Envíos a todo el país
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span>⚡</span> Asesoría al instante
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Sección: También te podría interesar (Carrusel de Productos Similares) */}
        {productosSimilares.length > 0 && (
          <section className="mt-14 sm:mt-16 pt-10 border-t border-gray-200" aria-label="Productos similares">
            {/* Encabezado de la Sección */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                También te podría interesar
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Modelos similares recomendados para ti
              </p>
            </div>

            {/* Contenedor del Carrusel con Controles Flotantes Circulares */}
            <div className="relative group/carousel">
              {/* Botón flotante Izquierda */}
              <button
                type="button"
                onClick={scrollLeft}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:text-gray-950 hover:scale-105 active:scale-95 transition-all flex items-center justify-center absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="Desplazar productos similares a la izquierda"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Botón flotante Derecha */}
              <button
                type="button"
                onClick={scrollRight}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:text-gray-950 hover:scale-105 active:scale-95 transition-all flex items-center justify-center absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="Desplazar productos similares a la derecha"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Track interior de tarjetas compactas */}
              <div
                ref={carouselRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto snap-x scrollbar-hide py-2 px-1"
              >
                {productosSimilares.slice(0, 10).map((item, idx) => {
                  const itemId = item.id_producto || item.id || idx;
                  const itemNombre = item.nombre || item.name || 'Calzado Deportivo';
                  const itemMarca = item.marca;
                  const itemCategoria = item.categoria || item.category || 'Colección';
                  const itemImagen = item.imagen_url || item.image || FALLBACK_IMAGE;

                  // Cálculo de precio numérico, precio tachado y badge de descuento
                  const rawPrice = item.precio_actual ?? item.price;
                  const precioNumerico = typeof rawPrice === 'number'
                    ? rawPrice
                    : (parseFloat(String(rawPrice || '').replace(/[^\d.]/g, '')) || 0);

                  const precioOriginalNum = item.precio_original ?? item.original_price ?? (precioNumerico > 0 ? Math.round(precioNumerico * 1.3) : 0);
                  const porcentajeDescuento = (precioOriginalNum > precioNumerico && precioOriginalNum > 0)
                    ? Math.round(((precioOriginalNum - precioNumerico) / precioOriginalNum) * 100)
                    : 25;

                  const itemPrecio = formatPrice(precioNumerico > 0 ? precioNumerico : rawPrice);
                  const itemPrecioOriginal = precioOriginalNum > 0 ? formatPrice(precioOriginalNum) : null;

                  return (
                    <Link
                      key={itemId}
                      to={`/producto/${itemId}`}
                      className="w-[170px] sm:w-[190px] md:w-[205px] shrink-0 snap-start bg-white rounded-2xl p-3 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between group cursor-pointer"
                      aria-label={`Ver detalles de ${itemNombre}`}
                    >
                      <div>
                        {/* Imagen: Zapatilla centrada con fondo blanco y proporción compacta */}
                        <div className="w-full h-28 sm:h-32 flex items-center justify-center bg-gray-50/50 rounded-xl overflow-hidden mb-2.5">
                          <img
                            src={itemImagen}
                            alt={itemNombre}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = FALLBACK_IMAGE;
                            }}
                            className="w-full h-28 sm:h-32 object-contain p-1 transform group-hover:scale-105 transition-transform duration-300 ease-out"
                            loading="lazy"
                          />
                        </div>

                        {/* Marca: Texto pequeño en mayúsculas */}
                        <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider truncate">
                          {itemMarca || itemCategoria}
                        </p>

                        {/* Título / Modelo: Texto a 2 líneas con altura fija para alineación perfecta */}
                        <h3 className="text-xs sm:text-[13px] font-medium text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mt-1 h-8 sm:h-9">
                          {itemNombre}
                        </h3>

                        {/* Calificación por estrellas */}
                        <div className="flex items-center gap-1 mt-1.5 text-amber-400 text-xs">
                          <span className="tracking-tighter">★★★★★</span>
                          <span className="text-[10px] text-gray-400 font-medium">({item.rating_count || 5})</span>
                        </div>
                      </div>

                      {/* Bloque de Precios (muy fiel a la foto de referencia) */}
                      <div className="mt-2.5 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm sm:text-base font-extrabold text-gray-900">
                            {itemPrecio}
                          </span>
                          {porcentajeDescuento > 0 && (
                            <span className="bg-red-600 text-white font-bold text-[10px] px-1 py-0.5 rounded-sm">
                              -{porcentajeDescuento}%
                            </span>
                          )}
                        </div>
                        {itemPrecioOriginal && (
                          <p className="text-[11px] text-gray-400 line-through mt-0.5">
                            {itemPrecioOriginal}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
