const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const { Client } = require('@notionhq/client');

// Configurar variables de entorno
require('dotenv').config({ path: '.env.local' });

// Inicializar cliente de Notion
const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '126051cd81d98062b3e3cb03c7590935';

// Función para obtener URL de imagen de una propiedad de Notion
function getImageFromProperty(property) {
  if (!property) return '';
  
  if (property.type === 'files' && property.files?.[0]) {
    const file = property.files[0];
    if (file.type === 'external') {
      return file.external.url;
    } else if (file.type === 'file') {
      return file.file.url;
    }
  }
  
  return '';
}

// Función para descargar un archivo
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    const request = client.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Manejar redirecciones
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, filePath).then(resolve).catch(reject);
        } else {
          reject(new Error(`Redirect sin URL: ${response.statusCode}`));
        }
      } else {
        reject(new Error(`Error al descargar: ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.abort();
      reject(new Error('Timeout al descargar'));
    });
  });
}

// Función para limpiar nombre de archivo
function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9\-_]/g, '_').toLowerCase();
}

// Función para obtener extensión de archivo de una URL
function getFileExtension(url) {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const extension = path.extname(pathname).toLowerCase();
    
    // Si no hay extensión, usar .jpg por defecto
    return extension || '.jpg';
  } catch (error) {
    return '.jpg';
  }
}

// Función principal para actualizar imágenes
async function updateImages() {
  try {
    console.log('🔄 Verificando imágenes desde Notion...');
    
    // Cargar mapeo existente
    const mappingPath = path.join(__dirname, '../lib/image-mapping.json');
    let existingMapping = {};
    
    if (fs.existsSync(mappingPath)) {
      const existingData = fs.readFileSync(mappingPath, 'utf8');
      existingMapping = JSON.parse(existingData);
    }

    // Obtener todos los productos actuales
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 100,
    });

    console.log(`📊 Verificando ${response.results.length} productos`);

    // Crear directorio si no existe
    const imagesDir = path.join(__dirname, '../public/images/products');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Mapeo actualizado
    const updatedMapping = {};
    let downloadedCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;

    for (const page of response.results) {
      const properties = page.properties;
      const productId = page.id;
      const lastEditedTime = page.last_edited_time;
      
      // Obtener nombre del producto
      const productName = properties.Nome?.title?.[0]?.plain_text || 
                         properties.Nombre?.title?.[0]?.plain_text || 
                         properties.Name?.title?.[0]?.plain_text || 
                         `product_${productId}`;
      
      // Obtener URL de imagen
      const imageUrl = getImageFromProperty(properties.Foto || properties.Image || properties.foto);
      
      if (!imageUrl) {
        console.log(`⚠️  Sin imagen para: ${productName}`);
        skippedCount++;
        continue;
      }

      // Generar nombre de archivo local
      const sanitizedName = sanitizeFileName(productName);
      const fileExtension = getFileExtension(imageUrl);
      const fileName = `${sanitizedName}_${productId.slice(-6)}${fileExtension}`;
      const filePath = path.join(imagesDir, fileName);

      // Verificar si necesita actualización
      const existingFile = existingMapping[productId];
      const needsUpdate = !existingFile || !fs.existsSync(filePath);

      if (!needsUpdate) {
        // Archivo existe y no necesita actualización
        updatedMapping[productId] = existingFile;
        skippedCount++;
        continue;
      }

      try {
        console.log(`⬇️  ${needsUpdate ? 'Actualizando' : 'Descargando'}: ${productName} -> ${fileName}`);
        await downloadFile(imageUrl, filePath);
        updatedMapping[productId] = `/images/products/${fileName}`;
        
        if (existingFile) {
          updatedCount++;
        } else {
          downloadedCount++;
        }
        
        console.log(`✅ Completado: ${fileName}`);
      } catch (error) {
        console.error(`❌ Error procesando ${productName}:`, error.message);
        // Mantener mapeo existente si hay error
        if (existingFile) {
          updatedMapping[productId] = existingFile;
        }
        skippedCount++;
      }
    }

    // Limpiar archivos huérfanos (productos eliminados)
    const orphanedFiles = [];
    const currentIds = new Set(response.results.map(page => page.id));
    
    for (const [id, imagePath] of Object.entries(existingMapping)) {
      if (!currentIds.has(id)) {
        const fullPath = path.join(__dirname, '../public', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          orphanedFiles.push(imagePath);
        }
      }
    }

    // Guardar mapeo actualizado
    fs.writeFileSync(mappingPath, JSON.stringify(updatedMapping, null, 2));

    console.log('\n📋 Resumen:');
    console.log(`✅ Nuevas: ${downloadedCount}`);
    console.log(`🔄 Actualizadas: ${updatedCount}`);
    console.log(`⚠️  Omitidas: ${skippedCount}`);
    console.log(`🗑️  Huérfanas eliminadas: ${orphanedFiles.length}`);
    console.log(`📄 Mapeo actualizado: ${mappingPath}`);
    console.log('\n🎉 ¡Actualización completada!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Ejecutar script
updateImages(); 