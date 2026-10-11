import { supabase } from '../../../config/supabase.js';

/**
 * Servicio del dominio de pedidos (Orders).
 * Maneja la lógica transaccional de creación de pedidos y sus respectivos detalles en Supabase.
 */

/**
 * Procesa y registra un nuevo pedido de prueba en la base de datos (pedidos y detalles_pedido).
 *
 * @param {Object} datosCliente - Datos personales y de contacto del cliente.
 * @param {string} datosCliente.nombre_completo - Nombre completo del cliente.
 * @param {string} datosCliente.correo_electronico - Correo electrónico del cliente.
 * @param {string} datosCliente.telefono - Teléfono de contacto.
 * @param {string} datosCliente.direccion_envio - Dirección de entrega.
 * @param {string} [datosCliente.referencia_direccion] - Referencia adicional para la entrega.
 * @param {Array<Object>} itemsCarrito - Lista de productos en el carrito.
 * @param {number|string} [itemsCarrito[].id] - Identificador del producto (fallback).
 * @param {number|string} [itemsCarrito[].id_producto] - Identificador del producto.
 * @param {string} [itemsCarrito[].talla] - Talla seleccionada (ej. 'S', 'M', 'L', 'Única').
 * @param {number} [itemsCarrito[].cantidad] - Cantidad de unidades a adquirir.
 * @param {number} [itemsCarrito[].precio] - Precio unitario del producto (fallback).
 * @param {number} [itemsCarrito[].precio_unitario] - Precio unitario del producto (fallback).
 * @param {number} [itemsCarrito[].precio_actual] - Precio unitario del producto (fallback).
 * @param {number|string} montoTotal - Monto total acumulado del pedido.
 * @returns {Promise<{ exito: boolean, id_pedido?: string, error?: string }>} Resultado de la transacción.
 */
export async function procesarPedidoTest(datosCliente, itemsCarrito, montoTotal) {
  try {
    // Paso 1: Validaciones básicas de entrada
    if (!datosCliente || typeof datosCliente !== 'object') {
      throw new Error('Los datos del cliente son requeridos para procesar el pedido.');
    }

    if (!Array.isArray(itemsCarrito) || itemsCarrito.length === 0) {
      throw new Error('El carrito debe contener al menos un producto.');
    }

    // Paso 2: Inserción de cabecera en la tabla 'pedidos'
    const cabeceraPedido = {
      nombre_completo: datosCliente.nombre_completo?.trim(),
      correo_electronico: datosCliente.correo_electronico?.trim(),
      telefono: datosCliente.telefono?.trim(),
      direccion_envio: datosCliente.direccion_envio?.trim(),
      referencia_direccion: datosCliente.referencia_direccion?.trim() || '',
      monto_total: Number(montoTotal),
      estado_pago: 'pendiente',
    };

    const { data: pedidoData, error: errorPedido } = await supabase
      .from('pedidos')
      .insert([cabeceraPedido])
      .select('id_pedido')
      .single();

    if (errorPedido || !pedidoData?.id_pedido) {
      throw new Error(errorPedido?.message || 'No se pudo generar el pedido.');
    }

    const idPedido = pedidoData.id_pedido;

    // Paso 3: Preparación e Inserción en Bloque (Bulk Insert) en 'detalles_pedido'
    const detallesParaInsertar = itemsCarrito.map((item) => ({
      id_pedido: idPedido,
      id_producto: Number(item.id_producto ?? item.id),
      talla: String(item.talla || 'Única'),
      cantidad: Number(item.cantidad || 1),
      precio_unitario: Number(item.precio ?? item.precio_unitario ?? item.precio_actual ?? 0),
    }));

    const { error: errorDetalles } = await supabase
      .from('detalles_pedido')
      .insert(detallesParaInsertar);

    if (errorDetalles) {
      throw errorDetalles;
    }

    // Paso 4: Retorno de resultado exitoso
    return {
      exito: true,
      id_pedido: idPedido,
    };
  } catch (error) {
    // Manejo y registro de errores
    console.error('Error al procesar el pedido:', error);
    return {
      exito: false,
      error: error.message || 'Error al procesar el pedido en la base de datos',
    };
  }
}

export const orderService = {
  procesarPedidoTest,
};

export default orderService;
