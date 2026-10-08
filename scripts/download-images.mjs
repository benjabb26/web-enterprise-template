import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PRODUCTS_FILE = path.join(rootDir, 'src', 'data', 'products.json');
const OUTPUT_DIR = path.join(rootDir, 'public', 'images');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 15000;
const CONCURRENCY = 5;

/**
 * Determina la extensión correcta de la imagen a partir del Content-Type
 * o fallback de la URL.
 */
function getExtensionFromContentType(contentType, url = '') {
  if (contentType) {
    const ct = contentType.toLowerCase().split(';')[0].trim();
    if (ct === 'image/jpeg' || ct === 'image/jpg') return 'jpg';
    if (ct === 'image/webp') return 'webp';
    if (ct === 'image/png') return 'png';
  }
  const cleanUrl = url.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.webp')) return 'webp';
  if (cleanUrl.endsWith('.png')) return 'png';
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'jpg';
  return 'jpg';
}

/**
 * Descarga una imagen remota con reintentos y timeout de seguridad.
 */
async function downloadWithRetry(url, targetBaseName, retries = MAX_RETRIES) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'image/jpeg,image/png,image/webp,image/*;q=0.8'
        },
        signal: AbortSignal.timeout(TIMEOUT_MS)
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      const extension = getExtensionFromContentType(contentType, url);
      const fileName = `${targetBaseName}.${extension}`;
      const filePath = path.join(OUTPUT_DIR, fileName);

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length === 0) {
        throw new Error('El archivo descargado está vacío (0 bytes)');
      }

      await fs.writeFile(filePath, buffer);
      return {
        fileName,
        filePath,
        bytes: buffer.length,
        contentType,
        extension
      };
    } catch (err) {
      lastError = err;
      console.warn(`[Intento ${attempt}/${retries}] Falló descarga de ${url}: ${err.message}`);
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
  }
  throw new Error(`Error definitivo tras ${retries} intentos: ${lastError?.message}`);
}

async function run() {
  console.log('=== INICIO DE MIGRACIÓN DE ASSETS Y DATOS ===');
  console.log(`Leyendo datos de productos desde: ${PRODUCTS_FILE}`);

  const rawData = await fs.readFile(PRODUCTS_FILE, 'utf-8');
  const products = JSON.parse(rawData);
  console.log(`Total de productos cargados: ${products.length}`);

  if (products.length !== 60) {
    console.warn(`Advertencia: Se esperaban 60 productos, se encontraron ${products.length}.`);
  }

  // Asegurar que exista la carpeta de destino
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`Directorio destino preparado: ${OUTPUT_DIR}`);

  const results = new Array(products.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < products.length) {
      const idx = currentIndex++;
      const product = products[idx];
      const baseName = `zapatilla-${idx + 1}`;
      console.log(`[${idx + 1}/${products.length}] Descargando ${product.name} (${product.id}) -> ${baseName}...`);

      try {
        const downloadRes = await downloadWithRetry(product.image, baseName);
        results[idx] = {
          success: true,
          product,
          ...downloadRes
        };
        console.log(` -> OK: ${downloadRes.fileName} (${(downloadRes.bytes / 1024).toFixed(1)} KB, Content-Type: ${downloadRes.contentType})`);
      } catch (err) {
        console.error(` -> ERROR al descargar ${product.id}:`, err);
        results[idx] = {
          success: false,
          product,
          error: err.message
        };
      }
    }
  }

  // Ejecutar descargas concurrentes
  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.error(`\n¡ATENCIÓN! Fallaron ${failures.length} descargas:`);
    for (const f of failures) {
      console.error(` - ${f.product.id} (${f.product.name}): ${f.error}`);
    }
    throw new Error('Migración abortada por fallos en descargas.');
  }

  console.log('\nTodas las 60 imágenes fueron descargadas con éxito.');
  console.log('Actualizando referencias locales en products.json...');

  for (let i = 0; i < products.length; i++) {
    const res = results[i];
    products[i].image = `/images/${res.fileName}`;
  }

  // Guardar archivo formateado a 2 espacios
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2) + '\n', 'utf-8');
  console.log(`Archivo ${PRODUCTS_FILE} actualizado exitosamente con indentación de 2 espacios.`);

  console.log('\n=== VERIFICACIÓN DE INTEGRIDAD ===');
  let totalBytes = 0;
  for (let i = 0; i < products.length; i++) {
    const expectedPath = path.join(OUTPUT_DIR, results[i].fileName);
    const stat = await fs.stat(expectedPath);
    if (stat.size === 0) {
      throw new Error(`Archivo vacío detectado: ${expectedPath}`);
    }
    totalBytes += stat.size;
    if (products[i].image !== `/images/${results[i].fileName}`) {
      throw new Error(`Inconsistencia en product[${i}].image: ${products[i].image}`);
    }
  }

  console.log(`✓ Verificación exitosa: 60/60 archivos físicos existen en public/images/ con tamaño > 0 bytes.`);
  console.log(`✓ Tamaño total de assets locales: ${(totalBytes / 1024 / 1024).toFixed(2)} MB.`);
  console.log(`✓ Todas las 60 rutas en products.json apuntan correctamente a /images/zapatilla-X...`);
  console.log('=== MIGRACIÓN FINALIZADA EXITOSAMENTE ===');
}

run().catch(err => {
  console.error('Error fatal durante la migración:', err);
  process.exit(1);
});
