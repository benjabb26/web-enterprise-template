import { supabase } from '../../../config/supabase.js';

/**
 * Obtiene la lista de productos desde la base de datos Supabase con soporte para filtros dinámicos.
 * 
 * @param {Object} [filtros={}] - Opciones de filtrado.
 * @param {string} [filtros.busqueda] - Texto a buscar en el nombre del producto (insensible a mayúsculas/minúsculas).
 * @param {string[]} [filtros.marcas] - Array de nombres de marcas a filtrar.
 * @param {string[]} [filtros.categorias] - Array de nombres de categorías a filtrar.
 * @param {number|string} [filtros.precioMax] - Precio máximo tope para el filtro de precio actual.
 * @returns {Promise<Array<Object>>} Lista de productos coincidentes.
 */
export async function getProducts(filtros = {}) {
  let query = supabase.from('productos').select('*');

  // Filtro por término de búsqueda en el nombre
  if (filtros.busqueda && typeof filtros.busqueda === 'string' && filtros.busqueda.trim() !== '') {
    query = query.ilike('nombre', `%${filtros.busqueda.trim()}%`);
  }

  // Filtro por marcas seleccionadas
  if (Array.isArray(filtros.marcas) && filtros.marcas.length > 0) {
    query = query.in('marca', filtros.marcas);
  }

  // Filtro por categorías seleccionadas
  if (Array.isArray(filtros.categorias) && filtros.categorias.length > 0) {
    query = query.in('categoria', filtros.categorias);
  }

  // Filtro por precio máximo
  if (
    filtros.precioMax !== undefined &&
    filtros.precioMax !== null &&
    filtros.precioMax !== '' &&
    !Number.isNaN(Number(filtros.precioMax))
  ) {
    query = query.lte('precio_actual', Number(filtros.precioMax));
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Obtiene las opciones de filtro disponibles (marcas y categorías únicas) a partir de los productos registrados.
 * 
 * @returns {Promise<{ marcas: string[], categorias: string[] }>} Listas ordenadas alfabéticamente de marcas y categorías únicas.
 */
export async function getFilterOptions() {
  const { data, error } = await supabase
    .from('productos')
    .select('marca, categoria');

  if (error) {
    throw error;
  }

  const marcasSet = new Set();
  const categoriasSet = new Set();

  (data || []).forEach((item) => {
    if (item.marca && typeof item.marca === 'string' && item.marca.trim() !== '') {
      marcasSet.add(item.marca.trim());
    }
    if (item.categoria && typeof item.categoria === 'string' && item.categoria.trim() !== '') {
      categoriasSet.add(item.categoria.trim());
    }
  });

  const marcas = Array.from(marcasSet).sort((a, b) => a.localeCompare(b));
  const categorias = Array.from(categoriasSet).sort((a, b) => a.localeCompare(b));

  return {
    marcas,
    categorias,
  };
}

/**
 * Obtiene el detalle de un producto por su identificador junto con su inventario de tallas.
 * 
 * @param {string|number} id - Identificador único del producto (id_producto).
 * @returns {Promise<Object>} Detalle del producto con su relación de inventario_tallas.
 * @throws {Error} Error retornado por Supabase en caso de falla o registro no encontrado.
 */
export async function getProductById(id) {
  const { data, error } = await supabase
    .from('productos')
    .select('*, inventario_tallas(*)')
    .eq('id_producto', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Mezcla aleatoriamente los elementos de un arreglo usando el algoritmo Fisher-Yates.
 * 
 * @template T
 * @param {T[]} array - Arreglo a mezclar.
 * @returns {T[]} Nuevo arreglo con los elementos en orden aleatorio.
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Obtiene productos similares con una regla estricta de 10 productos (o el máximo disponible).
 * Composición prioritaria:
 * - Hasta 4 productos de la misma marca (.eq('marca', marca).neq('id_producto', idActual)).
 * - Hasta 4 productos de la misma categoría (.eq('categoria', categoria).neq('id_producto', idActual)).
 * - 2 productos al azar de cualquier tipo (más los cupos faltantes si marca o categoría tienen menos de 4).
 * Excluye el producto actual (idActual) y garantiza cero duplicados con Set.
 *
 * @param {string|number} idActual - Identificador único del producto actual a excluir.
 * @param {string} [marca] - Marca del producto para buscar coincidencias.
 * @param {string} [categoria] - Categoría del producto para buscar coincidencias.
 * @returns {Promise<Array<Object>>} Lista de hasta 10 productos similares sin duplicados.
 */
export async function getSimilarProducts(idActual, marca, categoria) {
  try {
    const hasMarca = Boolean(marca && typeof marca === 'string' && marca.trim() !== '');
    const hasCategoria = Boolean(categoria && typeof categoria === 'string' && categoria.trim() !== '');

    let marcaBuilder = hasMarca ? supabase.from('productos').select('*').eq('marca', marca.trim()) : null;
    if (marcaBuilder && idActual !== undefined && idActual !== null && idActual !== '') {
      marcaBuilder = marcaBuilder.neq('id_producto', idActual);
    }
    const queryMarca = marcaBuilder
      ? marcaBuilder
          .limit(4)
          .then(({ data, error }) => {
            if (error) {
              console.error('Error al obtener productos similares por marca:', error);
              return [];
            }
            return data || [];
          })
      : Promise.resolve([]);

    let categoriaBuilder = hasCategoria ? supabase.from('productos').select('*').eq('categoria', categoria.trim()) : null;
    if (categoriaBuilder && idActual !== undefined && idActual !== null && idActual !== '') {
      categoriaBuilder = categoriaBuilder.neq('id_producto', idActual);
    }
    const queryCategoria = categoriaBuilder
      ? categoriaBuilder
          .limit(4)
          .then(({ data, error }) => {
            if (error) {
              console.error('Error al obtener productos similares por categoría:', error);
              return [];
            }
            return data || [];
          })
      : Promise.resolve([]);

    let generalBuilder = supabase.from('productos').select('*');
    if (idActual !== undefined && idActual !== null && idActual !== '') {
      generalBuilder = generalBuilder.neq('id_producto', idActual);
    }
    const queryGeneral = generalBuilder
      .limit(30)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al obtener productos generales de relleno:', error);
          return [];
        }
        return data || [];
      });

    const [productosMarca, productosCategoria, productosGeneral] = await Promise.all([
      queryMarca,
      queryCategoria,
      queryGeneral,
    ]);

    const idsVistos = new Set();
    if (idActual !== undefined && idActual !== null && idActual !== '') {
      idsVistos.add(String(idActual));
    }

    const unique = [];

    const agregarProducto = (item) => {
      if (!item) return false;
      const id = item.id_producto ?? item.id;
      if (id !== undefined && id !== null && id !== '') {
        const idKey = String(id);
        if (!idsVistos.has(idKey)) {
          idsVistos.add(idKey);
          unique.push(item);
          return true;
        }
      }
      return false;
    };

    // 1. Hasta 4 productos de la misma marca
    let countMarca = 0;
    for (const item of productosMarca) {
      if (countMarca >= 4 || unique.length >= 10) break;
      if (agregarProducto(item)) {
        countMarca++;
      }
    }

    // 2. Hasta 4 productos de la misma categoría
    let countCategoria = 0;
    for (const item of productosCategoria) {
      if (countCategoria >= 4 || unique.length >= 10) break;
      if (agregarProducto(item)) {
        countCategoria++;
      }
    }

    // 3. Cupos restantes completados con productos generales variados/al azar hasta alcanzar 10
    const productosGeneralesMezclados = shuffleArray(productosGeneral);
    for (const item of productosGeneralesMezclados) {
      if (unique.length >= 10) break;
      agregarProducto(item);
    }

    return unique.slice(0, 10);
  } catch (error) {
    console.error('Error inesperado en getSimilarProducts:', error);
    return [];
  }
}

export const catalogService = {
  getProducts,
  getFilterOptions,
  getProductById,
  getSimilarProducts,
};

export default catalogService;


