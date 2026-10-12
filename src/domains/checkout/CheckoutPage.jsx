import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { crearPedidoSupabase, generarPreferenciaPago } from '../orders/services/orderService.js';
import { useCart } from '../../core/context/CartContext.jsx';

// Inicialización global de Mercado Pago con la clave pública de entorno
const mpPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
if (mpPublicKey) {
  initMercadoPago(mpPublicKey, { locale: 'es-PE' });
}

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
 * Consume los productos del carrito global (CartContext) y genera la preferencia de pago con Mercado Pago.
 */
export const CheckoutPage = () => {
  const navigate = useNavigate();

  // Consumo del Contexto Global del Carrito
  const { cartItems, precioTotal, limpiarCarrito } = useCart();

  // Estados del formulario del cliente
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo_electronico: '',
    telefono: '',
    direccion_envio: '',
    referencia_direccion: '',
  });

  // Estado para el ID de preferencia de Mercado Pago
  const [preferenceId, setPreferenceId] = useState(null);

  // Estado para el ID del pedido registrado en Supabase
  const [pedidoId, setPedidoId] = useState(null);

  // Estados del proceso de compra
  const [procesando, setProcesando] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);
  const [pedidoExitosoId, setPedidoExitosoId] = useState(null);
  const [totalPagadoSnapshot, setTotalPagadoSnapshot] = useState(0);

  // Manejador de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (mensajeError) setMensajeError(null);
  };

  // Manejador de envío con orden transaccional estricto
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Validación de campos obligatorios requeridos
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

    if (!cartItems || cartItems.length === 0) {
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
      };

      // Paso 1 - Guardar Pedido en Supabase
      const nuevoPedidoId = await crearPedidoSupabase(cartItems, datosCliente);
      if (!nuevoPedidoId) {
        throw new Error('No se pudo registrar el pedido en la base de datos.');
      }
      setPedidoId(nuevoPedidoId);

      // Paso 2 - Generar Preferencia en Mercado Pago pasando nuevoPedidoId
      const idPreferencia = await generarPreferenciaPago(cartItems, datosCliente, nuevoPedidoId);
      if (!idPreferencia) {
        throw new Error('No se pudo obtener la preferencia de pago de Mercado Pago.');
      }

      // Paso 3 - Mostrar <Wallet /> y ocultar botón/formulario
      setPreferenceId(idPreferencia);
    } catch (err) {
      console.error('Error al procesar el pedido:', err);
      setMensajeError(err?.message || 'Error al procesar el pedido.');
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
              <span className="font-semibold text-gray-800">Mercado Pago</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-gray-200">
              <span className="text-gray-900 font-bold">Total Pagado:</span>
              <span className="font-extrabold text-emerald-600 text-base">{formatPrice(totalPagadoSnapshot)}</span>
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
  if (!cartItems || cartItems.length === 0) {
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

            {/* COLUMNA IZQUIERDA: Formulario de Datos o Wallet de Mercado Pago (7 cols) */}
            <div className="lg:col-span-7 space-y-6">

              {preferenceId ? (
                /* VISTA CONDICIONAL: PAGO SEGURO CON MERCADO PAGO (Formulario Oculto) */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6 transition-all">
                  {/* Encabezado de Pago Seguro */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xl border border-sky-100 shadow-sm">
                        💳
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                            Pago Seguro con Mercado Pago
                          </h2>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            Preferencia Lista
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Tus datos de entrega fueron validados. Procede al pago seguro oficial.
                        </p>
                      </div>
                    </div>

                    {/* Botón para editar datos si el usuario desea volver atrás */}
                    <button
                      type="button"
                      onClick={() => {
                        setPreferenceId(null);
                        setPedidoId(null);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-700 bg-gray-50 hover:bg-emerald-50/60 border border-gray-200 hover:border-emerald-200 px-3.5 py-2 rounded-xl transition-all self-start sm:self-center cursor-pointer"
                      title="Modificar los datos de envío y contacto"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Editar mis datos</span>
                    </button>
                  </div>

                  {/* Resumen de los datos del cliente confirmados */}
                  <div className="bg-gray-50/70 rounded-2xl p-4 sm:p-5 border border-gray-200/80 space-y-2 text-xs sm:text-sm">
                    {pedidoId && (
                      <div className="flex justify-between items-center text-gray-500 pb-2 border-b border-gray-200/80">
                        <span className="font-medium">Nº de Pedido:</span>
                        <span className="font-mono font-bold text-gray-900 bg-white px-2.5 py-0.5 rounded border border-gray-200 text-xs shadow-xs">
                          #{pedidoId}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-gray-500">
                      <span className="font-medium">Destinatario:</span>
                      <span className="font-bold text-gray-900">{formData.nombre_completo}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500">
                      <span className="font-medium">Correo Electrónico:</span>
                      <span className="font-semibold text-gray-800">{formData.correo_electronico}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500">
                      <span className="font-medium">Teléfono:</span>
                      <span className="font-semibold text-gray-800">{formData.telefono}</span>
                    </div>
                    <div className="flex justify-between items-start text-gray-500 pt-2 border-t border-gray-200">
                      <span className="font-medium shrink-0">Dirección de Entrega:</span>
                      <span className="font-semibold text-gray-800 text-right ml-4">
                        {formData.direccion_envio} {formData.referencia_direccion ? `(${formData.referencia_direccion})` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Aviso informativo de seguridad */}
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-3">
                    <span className="text-xl">🛡️</span>
                    <div className="text-xs text-sky-950">
                      <p className="font-bold">Pasarela Oficial y Cifrada</p>
                      <p className="mt-0.5 text-sky-800">
                        Haz clic en el botón oficial de Mercado Pago a continuación para procesar tu orden con tarjetas de débito/crédito o dinero en cuenta con total protección.
                      </p>
                    </div>
                  </div>

                  {/* Componente Oficial Wallet de Mercado Pago */}
                  <div className="pt-2 flex flex-col items-center justify-center">
                    <div className="w-full max-w-md min-h-[56px] flex items-center justify-center">
                      <Wallet initialization={{ preferenceId }} />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2 text-center">
                      Procesamiento oficial con respaldo y cifrado de Mercado Pago.
                    </p>
                  </div>
                </div>
              ) : (
                /* VISTA: FORMULARIO DE DATOS DE ENVÍO (Cuando aún no hay preferenceId) */
                <>
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

                  {/* Tarjeta 2: Pasarela de Pago Oficial Mercado Pago */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg">
                        2
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold text-gray-900">
                          Método de Pago Oficial
                        </h2>
                        <p className="text-xs text-gray-500">
                          Procesado de forma segura e instantánea a través de Mercado Pago.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center text-xl shadow-sm">
                          💳
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-gray-900">
                            Mercado Pago
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Tarjetas de débito, crédito y billeteras digitales
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                        Cifrado SSL 256 bits
                      </span>
                    </div>

                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-center gap-2.5">
                      <span className="text-base">🔒</span>
                      <span>
                        Al pulsar el botón de pago, se generará tu preferencia oficial de Mercado Pago para procesar tu orden.
                      </span>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* COLUMNA DERECHA: Resumen de Orden y Botón de Pago (5 cols) */}
            <div className="lg:col-span-5 space-y-6">

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6 sticky top-24">

                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-extrabold text-gray-900">
                    Resumen del Pedido
                  </h2>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                  </span>
                </div>

                {/* Listado de Productos */}
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {cartItems.map((item, index) => {
                    const precioUnit = Number(item.precio || 0);
                    const cant = Number(item.cantidad || 1);
                    const subtotalItem = precioUnit * cant;
                    const imagenSrc = item.imagen || FALLBACK_IMAGE;

                    return (
                      <div
                        key={`${item.id_producto}-${item.talla}-${index}`}
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
                    <span className="font-semibold text-gray-800">{formatPrice(precioTotal)}</span>
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
                      {formatPrice(precioTotal)}
                    </span>
                  </div>
                </div>

                {/* Botón Principal: Pagar con Mercado Pago o Indicador cuando preferenceId existe */}
                <div className="pt-2 space-y-3">
                  {preferenceId ? (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200/80 text-sky-950 text-center space-y-1 shadow-sm">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-500 text-white text-sm font-black mb-1 shadow-sm">
                          💳
                        </div>
                        <p className="text-xs font-extrabold uppercase tracking-wider text-sky-800">
                          Preferencia Lista
                        </p>
                        <p className="text-xs text-sky-900 font-medium">
                          Procede con el botón oficial de Mercado Pago en la sección de pago.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPreferenceId(null);
                          setPedidoId(null);
                        }}
                        className="w-full py-3 px-4 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Modificar los datos de envío"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>Editar datos de envío</span>
                      </button>
                    </div>
                  ) : (
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
                          <span>Generando preferencia de pago...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>Pagar con Mercado Pago</span>
                        </>
                      )}
                    </button>
                  )}

                  <p className="text-[11px] text-center text-gray-400">
                    {preferenceId
                      ? 'Transacción protegida con el respaldo oficial de Mercado Pago.'
                      : 'Al continuar, se generará tu preferencia de pago de forma 100% segura.'}
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
