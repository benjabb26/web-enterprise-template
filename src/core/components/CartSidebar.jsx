import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

// Fallback de imagen de alta resolución para calzado
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400';

/**
 * Componente CartSidebar (Drawer / Slide-over del Carrito de Compras)
 * Permite visualizar, modificar cantidades, eliminar artículos y proceder al checkout.
 */
export const CartSidebar = () => {
  const {
    cartItems,
    eliminarDelCarrito,
    actualizarCantidad,
    totalItems,
    precioTotal,
    isCartOpen,
    cerrarCarrito,
  } = useCart();

  const navigate = useNavigate();

  // Control de tecla Escape y bloqueo de scroll al estar abierto
  useEffect(() => {
    if (!isCartOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        cerrarCarrito();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isCartOpen, cerrarCarrito]);

  if (!isCartOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
    >
      {/* Backdrop oscuro semitransparente con efecto blur */}
      <div
        onClick={cerrarCarrito}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Panel lateral derecho deslizante */}
      <aside className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Cabecera del Sidebar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
              Tu Carrito
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/60">
              {totalItems} {totalItems === 1 ? 'unidad' : 'unidades'}
            </span>
          </div>

          <button
            type="button"
            onClick={cerrarCarrito}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer select-none"
            aria-label="Cerrar carrito"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo del Sidebar (Lista de Productos o Estado Vacío) */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-200/80 flex items-center justify-center text-3xl mb-4 text-gray-400 shadow-inner">
              🛍️
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">
              Tu carrito está vacío
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">
              Aún no has agregado calzado a tu compra. Descubre los modelos disponibles en nuestro catálogo.
            </p>
            <button
              type="button"
              onClick={() => {
                cerrarCarrito();
                navigate('/productos');
              }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explorar Catálogo</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 divide-y divide-gray-100">
            {cartItems.map((item) => {
              const precioNum = Number(item.precio || 0);
              const cantidadNum = Number(item.cantidad || 1);
              const subtotalItem = (precioNum * cantidadNum).toFixed(2);
              const imagenSrc = item.imagen || FALLBACK_IMAGE;

              return (
                <div
                  key={`${item.id_producto}-${item.talla}`}
                  className="pt-4 first:pt-0 flex gap-3.5 items-center"
                >
                  {/* Imagen del Producto con Fallback seguro */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                    <img
                      src={imagenSrc}
                      alt={item.nombre}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Información y Acciones del Producto */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-extrabold text-gray-900 truncate" title={item.nombre}>
                      {item.nombre}
                    </h4>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Talla: <span className="font-bold text-gray-700">{item.talla}</span>
                    </p>

                    <div className="mt-1 flex items-baseline gap-1.5 text-xs">
                      <span className="font-extrabold text-emerald-700">
                        S/ {subtotalItem}
                      </span>
                      {cantidadNum > 1 && (
                        <span className="text-[11px] text-gray-400">
                          (S/ {precioNum.toFixed(2)} c/u)
                        </span>
                      )}
                    </div>

                    {/* Controles de Cantidad y Botón de Papelera */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          onClick={() =>
                            actualizarCantidad(item.id_producto, item.talla, cantidadNum - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 text-sm font-bold transition-colors cursor-pointer select-none"
                          aria-label={`Disminuir cantidad de ${item.nombre}`}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-extrabold text-gray-900 select-none">
                          {cantidadNum}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            actualizarCantidad(item.id_producto, item.talla, cantidadNum + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 text-sm font-bold transition-colors cursor-pointer select-none"
                          aria-label={`Aumentar cantidad de ${item.nombre}`}
                        >
                          +
                        </button>
                      </div>

                      {/* Botón de Basurero */}
                      <button
                        type="button"
                        onClick={() => eliminarDelCarrito(item.id_producto, item.talla)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        aria-label={`Eliminar ${item.nombre} talla ${item.talla} del carrito`}
                        title="Eliminar producto"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pie del Sidebar (Footer) con Precio Total y Botón Ir a Pagar */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/70 space-y-3.5">
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span className="font-semibold text-gray-600">Subtotal estimado:</span>
              <span className="font-extrabold text-xl sm:text-2xl text-gray-900 tracking-tight">
                S/ {precioTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                cerrarCarrito();
                navigate('/checkout');
              }}
              className="w-full min-h-[48px] py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Ir a Pagar</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <p className="text-[11px] text-center text-gray-400">
              El costo de envío y detalles finales se confirmarán en el Checkout.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartSidebar;
