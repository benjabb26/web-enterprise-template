import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import productsData from '../../data/products.json';

// Fallbacks de alta definición para calzado en caso de que assets no carguen
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=700'
];

/**
 * Parsea cadenas de precio monetario como "S/ 350.00" a valor numérico puro.
 */
const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const match = String(priceStr).replace(/[^\d.]/g, '');
  return parseFloat(match) || 0;
};

/**
 * Componente ProductGrid con Paginación Estricta (30 items por página) y Filtros Simultáneos Multi-Selección.
 * Permite seleccionar múltiples marcas a la vez (ej. Nike Y Adidas) y múltiples categorías simultáneamente.
 */
export const ProductGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados de filtros multi-selección (arreglos)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(700);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const itemsPerPage = 30;

  const categories = ['Running', 'Casual', 'Vestir', 'Urbano', 'Deportivo', 'Edición Limitada'];
  const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Jordan', 'Asics', 'Converse', 'Vans'];

  // Sincronización bidireccional con Query Params (?categoria=... & ?marca=...)
  useEffect(() => {
    const catParam = searchParams.get('categoria');
    const brandParam = searchParams.get('marca');

    if (catParam) {
      setSelectedCategories(prev => {
        const match = categories.find(c => c.toLowerCase() === catParam.toLowerCase()) || catParam;
        return prev.includes(match) ? prev : [...prev, match];
      });
    }

    if (brandParam) {
      setSelectedBrands(prev => {
        const match = brands.find(b => b.toLowerCase() === brandParam.toLowerCase()) || brandParam;
        return prev.includes(match) ? prev : [...prev, match];
      });
    }
  }, [searchParams]);

  // Contabilizar filtros activos
  const activeFiltersCount =
    selectedCategories.length +
    selectedBrands.length +
    (maxPrice < 700 ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  // Filtrado de productos simultáneo con soporte multi-selección
  const filteredProducts = productsData.filter((product) => {
    // Categoría: si no hay seleccionadas, pasan todas. Si hay seleccionadas, debe coincidir con alguna.
    const matchCategory =
      selectedCategories.length === 0 ||
      (product.category && selectedCategories.some(c => c.toLowerCase() === product.category.toLowerCase()));

    // Marca: si no hay seleccionadas, pasan todas. Si hay seleccionadas, debe coincidir con alguna (ej. Nike O Adidas).
    const matchBrand =
      selectedBrands.length === 0 ||
      (product.brand && selectedBrands.some(b => b.toLowerCase() === product.brand.toLowerCase()));

    // Precio: slider estricto
    const numericPrice = parsePrice(product.price);
    const matchPrice = numericPrice <= maxPrice;

    // Buscador de texto reactivo
    const matchSearch =
      !searchTerm.trim() ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase().trim()));

    return matchCategory && matchBrand && matchPrice && matchSearch;
  });

  // Cálculo estricto de paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    Math.min(indexOfLastProduct, filteredProducts.length)
  );

  // Manejadores interactivos de filtros múltiples
  const handleToggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const handleToggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleClearBrands = () => {
    setSelectedBrands([]);
    setCurrentPage(1);
  };

  const handlePriceChange = (price) => {
    setMaxPrice(price);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      const catalogEl = document.getElementById('productos');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPrice(700);
    setSearchTerm('');
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  const handleImageError = (event, index) => {
    event.currentTarget.onerror = null;
    const fallback = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    event.currentTarget.src = fallback;
  };

  return (
    <section
      id="productos"
      className="py-12 lg:py-16 bg-gray-50/50"
      aria-label="Catálogo de productos de calzado"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera del Catálogo */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-gray-200 gap-4">
          <div>
            <span className="text-emerald-600 text-xs sm:text-sm font-bold tracking-wider uppercase">
              Catálogo Oficial
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Colección de Calzado Urbano
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {filteredProducts.length > 0
                ? `Mostrando ${indexOfFirstProduct + 1} - ${Math.min(indexOfLastProduct, filteredProducts.length)} de ${filteredProducts.length} modelos`
                : 'No se encontraron modelos con los filtros seleccionados'}
            </p>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-bold underline cursor-pointer self-start sm:self-auto touch-manipulation"
              >
                Limpiar filtros ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>

        {/* Botón Móvil para Desplegar Filtros (lg:hidden) */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full min-h-[48px] px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center justify-between text-gray-900 font-semibold text-sm active:bg-gray-50 touch-manipulation transition-all cursor-pointer"
            aria-expanded={showMobileFilters}
            aria-controls="catalog-filters-sidebar"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>{showMobileFilters ? 'Ocultar Filtros' : 'Filtrar Catálogo'}</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
              <span>{showMobileFilters ? 'Cerrar' : 'Configurar'}</span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${showMobileFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
        </div>

        {/* Layout Asimétrico: Sidebar (1 Columna) + Catálogo (3 Columnas) con Flujo Natural */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-10 items-start">
          
          {/* Columna Izquierda / Acordeón Plegable en Móvil: Sidebar de Filtros UI */}
          <aside
            id="catalog-filters-sidebar"
            className={`${showMobileFilters ? 'block mb-6' : 'hidden'} lg:block lg:mb-0 lg:col-span-1 w-full relative z-10 lg:sticky lg:top-24 h-auto bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold focus-visible:outline-none focus-visible:underline cursor-pointer touch-manipulation"
              >
                Limpiar todo
              </button>
            </div>

            {/* Filtro 1: Buscador por texto */}
            <div className="space-y-2">
              <label htmlFor="catalog-search" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Buscar Modelo
              </label>
              <div className="relative">
                <input
                  id="catalog-search"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Ej. Air Force, Ultraboost..."
                  className="w-full px-3.5 py-2 pl-9 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs p-0.5 cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filtro 2: Marcas (Multi-selección simultánea) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Marcas</span>
                  {selectedBrands.length > 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                      {selectedBrands.length}
                    </span>
                  )}
                </h3>
                {selectedBrands.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearBrands}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {brands.map((brand) => {
                  const isSelected = selectedBrands.includes(brand);
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => handleToggleBrand(brand)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all inline-flex items-center gap-1.5 touch-manipulation cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                      aria-pressed={isSelected}
                    >
                      {isSelected && (
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span>{brand}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtro 3: Categorías (Multi-selección simultánea) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Categorías</span>
                  {selectedCategories.length > 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                      {selectedCategories.length}
                    </span>
                  )}
                </h3>
                {selectedCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCategories}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer select-none transition-colors border text-left ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-bold'
                          : 'text-gray-700 hover:bg-gray-50 border-transparent'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span>{cat}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtro 4: Rango de Precio con Slider Visual */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Precio Máximo
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Hasta S/ {maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="700"
                step="10"
                value={maxPrice}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 touch-manipulation"
              />
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>S/ 200</span>
                <span>S/ 700</span>
              </div>
            </div>

            {/* Micro Banner de Asesoría en Sidebar */}
            <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-100/70 text-xs text-emerald-800">
              <p className="font-semibold flex items-center gap-1.5">
                <span>💬</span> ¿Dudas con tu modelo o talla?
              </p>
              <p className="text-emerald-700 mt-1">
                Escríbenos directamente a WhatsApp y te asesoramos al instante.
              </p>
            </div>
          </aside>

          {/* Columna Derecha: Catálogo de Zapatillas con Botón 'Ver más' */}
          <main className="lg:col-span-3 w-full flex flex-col">
            {/* Chips de Filtros Activos Seleccionados */}
            {(selectedBrands.length > 0 || selectedCategories.length > 0 || searchTerm.trim() || maxPrice < 700) && (
              <div className="flex flex-wrap items-center gap-1.5 mb-6 p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-xs">
                <span className="text-gray-400 font-semibold mr-1">Filtros activos:</span>
                {selectedBrands.map(b => (
                  <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span>{b}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleBrand(b)}
                      className="text-emerald-600 hover:text-emerald-950 ml-0.5 cursor-pointer font-extrabold text-sm leading-none"
                      aria-label={`Quitar filtro ${b}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedCategories.map(c => (
                  <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleCategory(c)}
                      className="text-teal-600 hover:text-teal-950 ml-0.5 cursor-pointer font-extrabold text-sm leading-none"
                      aria-label={`Quitar filtro ${c}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {searchTerm.trim() && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold bg-gray-100 text-gray-800 border border-gray-200">
                    <span>"{searchTerm}"</span>
                    <button
                      type="button"
                      onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                      className="text-gray-600 hover:text-gray-950 ml-0.5 cursor-pointer font-extrabold text-sm leading-none"
                      aria-label="Quitar búsqueda"
                    >
                      ×
                    </button>
                  </span>
                )}
                {maxPrice < 700 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold bg-gray-100 text-gray-800 border border-gray-200">
                    <span>Hasta S/ {maxPrice}</span>
                    <button
                      type="button"
                      onClick={() => { setMaxPrice(700); setCurrentPage(1); }}
                      className="text-gray-600 hover:text-gray-950 ml-0.5 cursor-pointer font-extrabold text-sm leading-none"
                      aria-label="Restablecer precio máximo"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:text-red-700 font-bold ml-auto cursor-pointer underline py-1"
                >
                  Quitar todos
                </button>
              </div>
            )}

            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentProducts.map((product, index) => {
                  const globalIndex = indexOfFirstProduct + index;

                  return (
                    <article
                      key={product.id || globalIndex}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Enlace al Detalle del Producto (PDP) en la Imagen */}
                      <Link
                        to={`/producto/${product.id}`}
                        className="block overflow-hidden relative aspect-square bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 touch-manipulation"
                        aria-label={`Ver detalles de ${product.name}`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => handleImageError(e, globalIndex)}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />

                        {/* Badge de Precio Estilo Glassmorphism */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/60">
                          <span className="text-sm font-extrabold text-gray-900">
                            {product.price}
                          </span>
                        </div>

                        {/* Tag de Colección */}
                        <div className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-md text-[11px] font-medium tracking-wide">
                          {product.category || 'Original'}
                        </div>
                      </Link>

                      {/* Información y Acción Ver Más */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Enlace al Detalle del Producto (PDP) en el Título */}
                          <Link
                            to={`/producto/${product.id}`}
                            className="block group/title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded touch-manipulation"
                          >
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover/title:text-emerald-700 transition-colors leading-snug line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Botón Ver Más */}
                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <Link
                            to={`/producto/${product.id}`}
                            className="w-full min-h-[48px] px-4 py-3 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-semibold text-sm shadow-sm hover:shadow transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 touch-manipulation cursor-pointer"
                            aria-label={`Ver más detalles de ${product.name}`}
                          >
                            <span>Ver más</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Estado Vacío cuando no coinciden filtros */
              <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm">
                <span className="text-4xl">👟</span>
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  No se encontraron zapatillas
                </h3>
                <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                  Prueba cambiando los filtros seleccionados o restablece los valores predeterminados.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-all touch-manipulation cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            )}

            {/* Controles de Paginación UI Premium (Estilo iOS Píldora) */}
            {totalPages > 1 && (
              <nav
                className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200/80 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
                aria-label="Paginación del catálogo"
              >
                {/* Botón Anterior */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all touch-manipulation ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-white hover:bg-gray-100 text-gray-700 shadow-sm border border-gray-200 active:scale-95 cursor-pointer'
                  }`}
                  aria-label="Ir a página anterior"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Anterior</span>
                </button>

                {/* Botones Numéricos de Página */}
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      className={`min-h-[44px] min-w-[44px] px-3.5 rounded-xl text-sm font-bold transition-all touch-manipulation cursor-pointer ${
                        currentPage === pageNumber
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-105'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300 active:bg-gray-50'
                      }`}
                      aria-current={currentPage === pageNumber ? 'page' : undefined}
                      aria-label={`Página ${pageNumber}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                {/* Botón Siguiente */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all touch-manipulation ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-white hover:bg-gray-100 text-gray-700 shadow-sm border border-gray-200 active:scale-95 cursor-pointer'
                  }`}
                  aria-label="Ir a página siguiente"
                >
                  <span>Siguiente</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            )}

          </main>

        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
