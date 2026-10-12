import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Clave de persistencia para el carrito de invitados en localStorage.
 */
const STORAGE_KEY = 'aura_cart';

/**
 * Contexto de React para la gestión global del carrito de compras.
 */
export const CartContext = createContext(null);

/**
 * Normaliza cualquier objeto producto recibido a la estructura estricta de 6 propiedades
 * requerida por la capa de datos del carrito.
 *
 * @param {Object} producto - Objeto de producto en bruto.
 * @returns {{ id_producto: number, nombre: string, precio: number, talla: string, cantidad: number, imagen: string }}
 */
const normalizarItemCarrito = (producto) => {
  if (!producto || typeof producto !== 'object') {
    return {
      id_producto: 0,
      nombre: '',
      precio: 0,
      talla: 'Única',
      cantidad: 1,
      imagen: '',
    };
  }

  return {
    id_producto: Number(producto.id_producto ?? producto.id),
    nombre: String(producto.nombre || producto.name || ''),
    precio: Number(producto.precio ?? producto.precio_actual ?? producto.precio_unitario ?? 0),
    talla: String(producto.talla || 'Única'),
    cantidad: Number(producto.cantidad) || 1,
    imagen: String(producto.imagen || producto.imagen_url || producto.image || ''),
  };
};

/**
 * Lee y parsea de forma segura los ítems del carrito almacenados en localStorage.
 * Si ocurre un error de deserialización o no existe información previa, retorna un array vacío.
 *
 * @returns {Array<Object>} Lista inicial de ítems deserializados y normalizados.
 */
const obtenerCarritoInicial = () => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizarItemCarrito);
  } catch (error) {
    console.error('Error al inicializar el carrito desde localStorage:', error);
    return [];
  }
};

/**
 * Proveedor del Contexto Global del Carrito de Compras (Guest Cart).
 * Encapsula la lógica de negocio, validaciones, cálculos y persistencia en localStorage.
 */
export const CartProvider = ({ children }) => {
  // Estado de ítems en el carrito (inicializado perezosamente desde localStorage)
  const [cartItems, setCartItems] = useState(obtenerCarritoInicial);

  // Estado de visibilidad para el Sidebar del Carrito
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persistencia reactiva del carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error al sincronizar el carrito en localStorage:', error);
    }
  }, [cartItems]);

  /**
   * Abre el drawer / sidebar del carrito.
   */
  const abrirCarrito = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  /**
   * Cierra el drawer / sidebar del carrito.
   */
  const cerrarCarrito = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  /**
   * Alterna la visibilidad del drawer / sidebar del carrito.
   */
  const toggleCarrito = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  /**
   * Agrega un ítem al carrito de compras o incrementa su cantidad si ya existe
   * una coincidencia exacta de id_producto y talla.
   *
   * @param {Object} producto - Datos del producto a agregar.
   */
  const agregarAlCarrito = useCallback((producto) => {
    const nuevoItem = normalizarItemCarrito(producto);

    setCartItems((prevItems) => {
      const indexExistente = prevItems.findIndex(
        (item) =>
          String(item.id_producto) === String(nuevoItem.id_producto) &&
          String(item.talla) === String(nuevoItem.talla)
      );

      if (indexExistente >= 0) {
        const itemsActualizados = [...prevItems];
        const itemExistente = itemsActualizados[indexExistente];
        itemsActualizados[indexExistente] = {
          ...itemExistente,
          cantidad: Number(itemExistente.cantidad || 0) + Number(nuevoItem.cantidad || 1),
        };
        return itemsActualizados;
      }

      return [...prevItems, nuevoItem];
    });
  }, []);

  /**
   * Elimina un ítem específico del carrito según su id_producto y talla.
   *
   * @param {number|string} id_producto - Identificador numérico o ID del producto.
   * @param {string} talla - Talla del producto seleccionado.
   */
  const eliminarDelCarrito = useCallback((id_producto, talla) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            String(item.id_producto) === String(id_producto) &&
            String(item.talla) === String(talla)
          )
      )
    );
  }, []);

  /**
   * Actualiza la cantidad de un ítem existente en el carrito.
   * Si la cantidad es menor que 1, el ítem se remueve automáticamente.
   *
   * @param {number|string} id_producto - Identificador del producto.
   * @param {string} talla - Talla del producto.
   * @param {number|string} nuevaCantidad - Nueva cantidad deseada.
   */
  const actualizarCantidad = useCallback(
    (id_producto, talla, nuevaCantidad) => {
      const cant = Number(nuevaCantidad);

      if (cant < 1) {
        eliminarDelCarrito(id_producto, talla);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (
            String(item.id_producto) === String(id_producto) &&
            String(item.talla) === String(talla)
          ) {
            return {
              ...item,
              cantidad: cant,
            };
          }
          return item;
        })
      );
    },
    [eliminarDelCarrito]
  );

  /**
   * Vacía la lista completa de ítems del carrito y elimina la clave en localStorage.
   */
  const limpiarCarrito = useCallback(() => {
    setCartItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error al limpiar aura_cart en localStorage:', error);
    }
  }, []);

  /**
   * Total acumulado de unidades/artículos en el carrito.
   */
  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + Number(item.cantidad || 0), 0),
    [cartItems]
  );

  /**
   * Monto económico total acumulado de la compra (suma de subtotales).
   */
  const precioTotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + Number(item.precio || 0) * Number(item.cantidad || 0),
        0
      ),
    [cartItems]
  );

  // Valor expuesto por el Contexto
  const contextValue = useMemo(
    () => ({
      cartItems,
      agregarAlCarrito,
      eliminarDelCarrito,
      actualizarCantidad,
      limpiarCarrito,
      totalItems,
      precioTotal,
      isCartOpen,
      setIsCartOpen,
      abrirCarrito,
      cerrarCarrito,
      toggleCarrito,
    }),
    [
      cartItems,
      agregarAlCarrito,
      eliminarDelCarrito,
      actualizarCantidad,
      limpiarCarrito,
      totalItems,
      precioTotal,
      isCartOpen,
      abrirCarrito,
      cerrarCarrito,
      toggleCarrito,
    ]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

/**
 * Custom hook para acceder al contexto del carrito de compras.
 * Lanza un error explícito si se consume fuera del alcance de CartProvider.
 *
 * @returns {Object} Contexto con estado y métodos del carrito.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
};

export default CartProvider;
