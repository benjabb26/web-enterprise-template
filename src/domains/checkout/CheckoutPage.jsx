import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { procesarPedidoTest } from '../orders/services/orderService.js';

// Fallback de imagen para ítems en el resumen
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400';

/**
 * Formatea precio numérico a convención monetaria "S/ xx.xx"
 */
const formatPrice = (val) => {
  if (val === undefined || val === null) return 'S/ 0.00';
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^\d.]/g, '')) || 0;
  return `S/ ${num.toFixed(2)}`;
};

/**
 * Vista de Checkout y Finalización de Compra
 * Recibe ítems seleccionados vía location.state.items y procesa el pedido en la BD.
 */
export const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ítems transferidos desde la vista de detalle
  const items = location.state?.items || [];

  // Estados del formulario del cliente
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo_electronico: '',
    telefono: '',
    direccion_envio: '',
    referencia_direccion: '',
  });

  // Método de pago: 'Tarjetas de Débito/Crédito' | 'Yape/Plin'
  const [metodoPago, setMetodoPago] = useState('Tarjetas de Débito/Crédito');

  // Estados del proceso de compra
  const [procesando, setProcesando] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);
  const [pedidoExitosoId, setPedidoExitosoId] = useState(null);

  // Cálculo de subtotales y total
  const montoTotal = items.reduce((acc, item) => {
    const precio = Number(item.precio ?? item.precio_unitario ?? item.precio_actual ?? 0);
    const cant = Number(item.cantidad) || 1;
    return acc + precio * cant;
  }, 0);

  // Manejador de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (mensajeError) setMensajeError(null);
  };

  // Manejador de envío del pedido
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
    if (
      !formData.nombre_completo.trim() ||
      !formData.correo_electronico.trim() ||
      !formData.telefono.trim() ||
      !formData.direccion_envio.trim() ||
      !formData.referencia_direccion.trim()
    ) {
      setMensajeError('Por favor, completa todos los campos requeridos para el envío.');
      return;
    }

    if (!items || items.length === 0) {
      setMensajeError('No hay productos en el pedido para procesar.');
      return;
    }

    setProcesando(true);
    setMensajeError(null);

    try {
      const datosCliente = {
        nombre_completo: formData.nombre_completo.trim(),
        correo_electronico: formData.correo_electronico.trim(),
        telefono: formData.telefono.trim(),
        direccion_envio: formData.direccion_envio.trim(),
        referencia_direccion: formData.referencia_direccion.trim(),
        metodo_pago: metodoPago,
      };

      const resultado = await procesarPedidoTest(datosCliente, items, montoTotal);

      if (resultado && resultado.exito) {
        setPedidoExitosoId(resultado.id_pedido);
        alert(`¡Pedido registrado con éxito! ID del pedido: ${resultado.id_pedido}`);
      } else {
        const errorMsg = resultado?.error || 'No se pudo registrar el pedido. Intenta nuevamente.';
        setMensajeError(errorMsg);
        alert(`Error al registrar el pedido: ${errorMsg}`);
      }
    } catch (err) {
      console.error('Error inesperado en checkout:', err);
      const errorMsg = err?.message || 'Error de conexión al procesar el pedido.';
      setMensajeError(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setProcesando(false);
    }
  };

  // VISTA 1: Pantalla de Pedido Confirmado Exitosamente
  if (pedidoExitosoId) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:py-20 bg-gray-50/60">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner border border-emerald-100 animate-bounce">
            ✓
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              ¡Compra Completada!
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight pt-2">
              ¡Pedido Registrado con Éxito!
            </h1>
            <p className="text-sm text-gray-600">
              Tu pedido ha sido guardado correctamente en nuestra base de datos para su preparación y despacho.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200/80 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500 font-medium">ID de Pedido:</span>
              <span className="font-mono font-bold text-gray-900 bg-white px-2.5 py-1 rounded-md border border-gray-200 text-xs">
                {pedidoExitosoId}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500 font-medium">Cliente:</span>
              <span className="font-semibold text-gray-800">{formData.nombre_completo}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500 font-medium">Método de Pago:</span>
              <span className="font-semibold text-gray-800">{metodoPago}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-gray-200">
              <span className="text-gray-900 font-bold">Total Pagado:</span>
              <span className="font-extrabold text-emerald-600 text-base">{formatPrice(montoTotal)}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to="/productos"
              className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 text-center transition-all cursor-pointer"
            >
              Seguir Comprando
            </Link>
            <Link
              to="/"
              className="flex-1 py-3 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm text-center transition-all cursor-pointer"
            >
              Ir al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // VISTA 2: Estado Vacío (Sin productos en el pedido)
  if (!items || items.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 sm:py-24 bg-gray-50/50 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center text-4xl mb-6 shadow-sm border border-amber-100">
          🛍️
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          No hay productos seleccionados
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-md">
          Tu carrito de compra rápida no contiene productos para procesar. Explora nuestro catálogo y selecciona tus zapatillas favoritas.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/productos"
            className="min-h-[48px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Ver Catálogo de Productos</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            to="/"
            className="min-h-[48px] px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold text-sm transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Ir al Inicio</span>
          </Link>
        </div>
      </div>
    );
  }

  // VISTA 3: Flujo Principal de Checkout (2 Columnas)
  return (
    <div className="relative w-full py-8 sm:py-12 lg:py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Barra Superior con Navegación Contextual */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-emerald-700 bg-white hover:bg-emerald-50/60 border border-gray-200 hover:border-emerald-200 px-4 py-2.5 rounded-xl transition-all shadow-sm group cursor-pointer"
            aria-label="Volver atrás"
          >
            <svg className="w-4 h-4 text-gray-500 group-hover:text-emerald-700 group-hover:-translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver</span>
          </button>

          <nav className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-medium" aria-label="Migas de pan">
            <Link to="/" className="hover:text-gray-700 transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/productos" className="hover:text-gray-700 transition-colors">Productos</Link>
            <span>/</span>
            <span className="text-emerald-700 font-semibold">Checkout</span>
          </nav>
        </div>

        {/* Encabezado Principal */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Proceso de Compra Directa
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
            Finalizar Pedido
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Completa tus datos de envío y selecciona tu método de pago preferido para procesar la orden.
          </p>
        </div>

        {/* Banner de Error si ocurre algún problema */}
        {mensajeError && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 shadow-sm animate-shake">
            <span className="text-xl">⚠️</span>
            <div className="text-sm">
              <p className="font-bold">Hubo un problema al procesar el pedido:</p>
              <p className="mt-0.5">{mensajeError}</p>
            </div>
          </div>
        )}

        {/* Formulario e Interfaz Dividida en 2 Columnas */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* COLUMNA IZQUIERDA: Formulario de Datos de Envío y Método de Pago (7 cols) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Tarjeta 1: Datos Personales y de Entrega */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900">
                      Datos de Envío y Contacto
                    </h2>
                    <p className="text-xs text-gray-500">
                      Ingresa la información exacta para coordinar la entrega de tu calzado.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Nombre Completo */}
                  <div>
                    <label htmlFor="nombre_completo" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nombre_completo"
                      name="nombre_completo"
                      type="text"
                      required
                      value={formData.nombre_completo}
                      onChange={handleInputChange}
                      placeholder="Ej. Juan Pérez López"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-gray-50/30"
                    />
                  </div>

                  {/* Correo y Teléfono en 2 columnas en pantallas medianas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="correo_electronico" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Correo Electrónico <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="correo_electronico"
                        name="correo_electronico"
                        type="email"
                        required
                        value={formData.correo_electronico}
                        onChange={handleInputChange}
                        placeholder="ejemplo@correo.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-gray-50/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="telefono" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Teléfono / Celular <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="Ej. 987 654 321"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-gray-50/30"
                      />
                    </div>
                  </div>

                  {/* Dirección de Envío */}
                  <div>
                    <label htmlFor="direccion_envio" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Dirección de Envío <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="direccion_envio"
                      name="direccion_envio"
                      type="text"
                      required
                      value={formData.direccion_envio}
                      onChange={handleInputChange}
                      placeholder="Calle / Av., Número, Distrito o Ciudad"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-gray-50/30"
                    />
                  </div>

                  {/* Referencia de Dirección */}
                  <div>
                    <label htmlFor="referencia_direccion" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Referencia de Entrega <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="referencia_direccion"
                      name="referencia_direccion"
                      type="text"
                      required
                      value={formData.referencia_direccion}
                      onChange={handleInputChange}
                      placeholder="Ej. Frente al parque, casa blanca de 2 pisos, portón negro"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-gray-50/30"
                    />
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Selector de Método de Pago */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900">
                      Método de Pago
                    </h2>
                    <p className="text-xs text-gray-500">
                      Selecciona la opción de pago con la que deseas abonar tu compra.
                    </p>
                  </div>
                </div>

                {/* Opciones seleccionables con botones de tarjeta modernos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Opción 1: Tarjetas */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setMetodoPago('Tarjetas de Débito/Crédito')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setMetodoPago('Tarjetas de Débito/Crédito');
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                      metodoPago === 'Tarjetas de Débito/Crédito'
                        ? 'border-emerald-600 bg-emerald-50/30 shadow-sm ring-2 ring-emerald-600/10'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg">
                        💳
                      </div>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        metodoPago === 'Tarjetas de Débito/Crédito'
                          ? 'border-emerald-600 bg-emerald-600 text-white text-xs'
                          : 'border-gray-300'
                      }`}>
                        {metodoPago === 'Tarjetas de Débito/Crédito' && '✓'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-900">
                        Tarjetas de Débito / Crédito
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Visa, Mastercard, American Express
                      </p>
                    </div>
                  </div>

                  {/* Opción 2: Yape / Plin */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setMetodoPago('Yape/Plin')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setMetodoPago('Yape/Plin');
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                      metodoPago === 'Yape/Plin'
                        ? 'border-emerald-600 bg-emerald-50/30 shadow-sm ring-2 ring-emerald-600/10'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs">
                        QR
                      </div>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        metodoPago === 'Yape/Plin'
                          ? 'border-emerald-600 bg-emerald-600 text-white text-xs'
                          : 'border-gray-300'
                      }`}>
                        {metodoPago === 'Yape/Plin' && '✓'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-900">
                        Yape / Plin
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Transferencia móvil instantánea sin comisiones
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nota informativa según método */}
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-center gap-2.5">
                  <span className="text-base">🔒</span>
                  <span>
                    {metodoPago === 'Tarjetas de Débito/Crédito'
                      ? 'Transacción protegida con cifrado SSL de 256 bits.'
                      : 'Se asociará el comprobante de transferencia al ID de tu pedido.'}
                  </span>
                </div>
              </div>

            </div>

            {/* COLUMNA DERECHA: Resumen de Orden y Botón de Pago (5 cols) */}
            <div className="lg:col-span-5 space-y-6">

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6 sticky top-24">

                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-extrabold text-gray-900">
                    Resumen del Pedido
                  </h2>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {items.length} {items.length === 1 ? 'producto' : 'productos'}
                  </span>
                </div>

                {/* Listado de Productos */}
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {items.map((item, index) => {
                    const precioUnit = Number(item.precio ?? item.precio_unitario ?? item.precio_actual ?? 0);
                    const cant = Number(item.cantidad) || 1;
                    const subtotalItem = precioUnit * cant;
                    const imagenSrc = item.imagen_url || item.image || FALLBACK_IMAGE;

                    return (
                      <div
                        key={`${item.id_producto || item.id}-${item.talla}-${index}`}
                        className="flex gap-4 p-3 rounded-2xl bg-gray-50/60 border border-gray-100 items-center"
                      >
                        {/* Miniatura del Producto */}
                        <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0">
                          <img
                            src={imagenSrc}
                            alt={item.nombre || 'Producto'}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = FALLBACK_IMAGE;
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Datos del Producto */}
                        <div className="flex-1 min-w-0">
                          {item.marca && (
                            <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
                              {item.marca}
                            </span>
                          )}
                          <h3 className="text-sm font-extrabold text-gray-900 truncate">
                            {item.nombre || 'Zapatilla Urbana'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                            <span className="font-semibold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                              Talla: {item.talla || 'Única'}
                            </span>
                            <span>•</span>
                            <span>Cant: <strong className="text-gray-800">{cant}</strong></span>
                          </div>
                        </div>

                        {/* Subtotal del Producto */}
                        <div className="text-right shrink-0">
                          <p className="text-sm font-extrabold text-gray-900">
                            {formatPrice(subtotalItem)}
                          </p>
                          {cant > 1 && (
                            <p className="text-[11px] text-gray-400">
                              {formatPrice(precioUnit)} c/u
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desglose Financiero */}
                <div className="pt-4 border-t border-gray-100 space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal de productos:</span>
                    <span className="font-semibold text-gray-800">{formatPrice(montoTotal)}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <span>Costo de envío:</span>
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Cortesía
                      </span>
                    </span>
                    <span className="font-bold text-emerald-700">Gratis</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                    <span className="text-base font-extrabold text-gray-900">Total a pagar:</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                      {formatPrice(montoTotal)}
                    </span>
                  </div>
                </div>

                {/* Botón Principal: Comprar Test (Insertar BD) */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={procesando}
                    className={`w-full min-h-[52px] rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 ${
                      procesando
                        ? 'bg-gray-400 text-white cursor-not-allowed shadow-none'
                        : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-emerald-600/25'
                    }`}
                  >
                    {procesando ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Procesando pedido...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Comprar Test (Insertar BD)</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-gray-400">
                    Al confirmar, tu orden se insertará directamente en la base de datos de producción.
                  </p>
                </div>

                {/* Sellos de Confianza Adicionales */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span>🛡️</span> Garantía oficial
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span>⚡</span> Entrega rápida
                  </span>
                </div>

              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default CheckoutPage;
