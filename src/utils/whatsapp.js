import { siteConfig } from '../data/siteConfig.js';

/**
 * Limpia y normaliza un número de teléfono eliminando cualquier carácter no numérico
 * (espacios, signos +, guiones, paréntesis, etc.).
 *
 * @param {string|number|null|undefined} phone - Número de teléfono a sanitizar.
 * @returns {string} Cadena que contiene únicamente los dígitos numéricos.
 */
export const sanitizePhoneNumber = (phone) => {
  if (phone === null || phone === undefined) {
    return '';
  }
  return String(phone).replace(/\D/g, '');
};

/**
 * Genera un enlace oficial de WhatsApp (https://wa.me/...) sanitizado y codificado de forma segura.
 *
 * Reglas de negocio:
 * 1. Si no se pasa un teléfono válido o viene vacío/nulo, se utiliza siteConfig.whatsappNumber como fallback.
 * 2. Si tras la sanitización el número no contiene dígitos, retorna una cadena vacía.
 * 3. Si se proporciona un mensaje (no vacío tras trim), se codifica con encodeURIComponent y se adjunta como query param ?text=...
 * 4. Si el mensaje está vacío o no se provee, retorna únicamente la URL base con el número.
 *
 * @param {string|number|null|undefined} [phone] - Número telefónico (opcional).
 * @param {string|null|undefined} [message] - Mensaje de texto a preconfigurar (opcional).
 * @returns {string} Enlace URL completo para WhatsApp o cadena vacía si no hay un teléfono válido.
 *
 * @example
 * // Uso básico con número y mensaje
 * generateWhatsAppLink("+51 999 888 777", "Hola, me interesa este producto");
 * // -> "https://wa.me/51999888777?text=Hola%2C%20me%20interesa%20este%20producto"
 *
 * @example
 * // Uso sin teléfono (toma siteConfig.whatsappNumber por defecto)
 * generateWhatsAppLink(null, "Consulta de stock");
 * // -> "https://wa.me/51999888777?text=Consulta%20de%20stock"
 *
 * @example
 * // Uso sin mensaje
 * generateWhatsAppLink("51999888777");
 * // -> "https://wa.me/51999888777"
 */
export const generateWhatsAppLink = (phone, message) => {
  const hasPhoneInput = phone !== null && phone !== undefined && String(phone).trim() !== '';
  const targetPhone = hasPhoneInput ? phone : siteConfig?.whatsappNumber;
  const cleanPhone = sanitizePhoneNumber(targetPhone);

  if (!cleanPhone) {
    return '';
  }

  const trimmedMessage = message !== null && message !== undefined ? String(message).trim() : '';

  if (!trimmedMessage) {
    return `https://wa.me/${cleanPhone}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(trimmedMessage)}`;
};

export default generateWhatsAppLink;
