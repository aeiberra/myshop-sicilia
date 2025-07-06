const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG: Verificando sistema de imágenes...');

// 1. Verificar archivo de mapeo
const mappingPath = path.join(__dirname, '../lib/image-mapping.json');
console.log(`\n1. Archivo de mapeo: ${mappingPath}`);
console.log(`   Existe: ${fs.existsSync(mappingPath)}`);

if (fs.existsSync(mappingPath)) {
  try {
    const mappingData = fs.readFileSync(mappingPath, 'utf8');
    const imageMapping = JSON.parse(mappingData);
    console.log(`   Entradas: ${Object.keys(imageMapping).length}`);
    
    // Mostrar primera entrada
    const firstEntry = Object.entries(imageMapping)[0];
    console.log(`   Primera entrada: ${firstEntry[0]} -> ${firstEntry[1]}`);
    
  } catch (error) {
    console.error(`   Error leyendo mapeo: ${error.message}`);
  }
}

// 2. Verificar directorio de imágenes
const imagesDir = path.join(__dirname, '../public/images/products');
console.log(`\n2. Directorio de imágenes: ${imagesDir}`);
console.log(`   Existe: ${fs.existsSync(imagesDir)}`);

if (fs.existsSync(imagesDir)) {
  const files = fs.readdirSync(imagesDir);
  console.log(`   Archivos: ${files.length}`);
  console.log(`   Primeros 3: ${files.slice(0, 3).join(', ')}`);
}

// 3. Verificar archivo específico
const testFile = path.join(__dirname, '../public/images/products/scrivania_gaming__135b4e.jpg');
console.log(`\n3. Archivo específico: ${testFile}`);
console.log(`   Existe: ${fs.existsSync(testFile)}`);

if (fs.existsSync(testFile)) {
  const stats = fs.statSync(testFile);
  console.log(`   Tamaño: ${stats.size} bytes`);
  console.log(`   Modificado: ${stats.mtime}`);
}

// 4. Simular carga de mapeo como en notion.ts
console.log('\n4. Simulando carga de mapeo...');
try {
  const mappingPath2 = path.join(process.cwd(), 'lib', 'image-mapping.json');
  console.log(`   Ruta usando process.cwd(): ${mappingPath2}`);
  console.log(`   Existe: ${fs.existsSync(mappingPath2)}`);
  
  if (fs.existsSync(mappingPath2)) {
    const mappingData = fs.readFileSync(mappingPath2, 'utf8');
    const imageMapping = JSON.parse(mappingData);
    console.log(`   Cargado exitosamente: ${Object.keys(imageMapping).length} entradas`);
    
    // Probar acceso a un ID específico
    const testId = '12f051cd-81d9-8021-b762-f5797d135b4e';
    console.log(`   Prueba ID ${testId}: ${imageMapping[testId] || 'NO ENCONTRADO'}`);
  }
  
} catch (error) {
  console.error(`   Error: ${error.message}`);
}

console.log('\n✅ DEBUG completado'); 