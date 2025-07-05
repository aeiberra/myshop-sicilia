# MyShop Sicilia

Una aplicación web moderna para vender productos de hogar en Ragusa, Sicilia. Sitio web mobile-first con soporte multiidioma y integración con WhatsApp.

## Características

- ✅ **Mobile-first**: Diseño optimizado para dispositivos móviles
- ✅ **Multiidioma**: Español, Italiano e Inglés
- ✅ **Notion como CMS**: Base de datos pública de Notion
- ✅ **Carrito de compras**: Con localStorage persistente
- ✅ **Integración WhatsApp**: Envío automático de pedidos
- ✅ **SEO optimizado**: Para búsquedas locales en Sicilia
- ✅ **Responsive**: Funciona en todos los dispositivos
- ✅ **Filtros avanzados**: Por categoría, precio y búsqueda

## Tecnologías

- **Frontend**: Next.js 14 con App Router
- **Estilos**: TailwindCSS
- **Idiomas**: next-intl
- **Base de datos**: Notion API
- **Despliegue**: Vercel/Netlify

## Configuración

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   Crear archivo `.env.local`:
   ```
   NOTION_DATABASE_ID=126051cd81d98062b3e3cb03c7590935
   NOTION_SECRET=tu_token_secreto_de_notion
   WHATSAPP_NUMBER=393481860784
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

4. **Compilar para producción**:
   ```bash
   npm run build
   ```

## Estructura de la Base de Datos Notion

La tabla de Notion debe tener las siguientes columnas:

- **Nombre** (Title): Nombre del producto
- **Precio** (Number): Precio en euros
- **Descripción** (Rich Text): Descripción del producto
- **Categoría** (Select): Categoría del producto
- **Foto** (Files): Imagen del producto
- **Disponible** (Checkbox): Si está disponible para venta

## Categorías Soportadas

- Tecnología
- Electrodomésticos
- Muebles
- Bazar
- Oficina
- Herramientas
- Varios

## Despliegue

El sitio está configurado para desplegarse fácilmente en:

- **Vercel**: Conectar el repositorio y desplegar automáticamente
- **Netlify**: Subir la carpeta `out` después de `npm run build`

## Contacto

WhatsApp: +39 348 186 0784
Ubicación: Ragusa, Sicilia

## Licencia

Este proyecto es de uso personal para la venta de productos de hogar. 