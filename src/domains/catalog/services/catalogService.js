import { supabase } from '../../../config/supabase.js';

export const catalogService = {
  /**
   * Obtiene la lista completa de productos desde la base de datos Supabase.
   * @returns {Promise<Array>} Array de productos con propiedades: id, nombre, precio_actual, imagen_url, etc.
   */
  async getProducts() {
    const { data, error } = await supabase
      .from('productos')
      .select('*');

    if (error) {
      throw error;
    }

    return data || [];
  }
};

export default catalogService;
