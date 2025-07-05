# MyShop Sicilia 🛍️

Una tienda online moderna construida con Next.js y conectada a Notion como base de datos. Perfecto para vender productos de hogar en Sicilia con contacto directo por WhatsApp.

## 🚀 Características

- **🌐 Multiidioma**: Español, Italiano, Inglés
- **📱 Responsive**: Diseño adaptable a móviles y desktop
- **🛒 Carrito de compras**: Funcionalidad completa de e-commerce
- **💬 WhatsApp**: Contacto directo para ventas
- **📊 Notion Integration**: Base de datos en Notion para gestionar productos
- **🎨 UI Moderna**: Diseño limpio con Tailwind CSS
- **⚡ Performance**: Optimizado con Next.js 14

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 + React 18
- **Styling**: Tailwind CSS
- **Database**: Notion API
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/aeiberra/myshop-sicilia.git
cd myshop-sicilia
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env.local`:
```env
NOTION_SECRET=tu_notion_secret_key
NOTION_DATABASE_ID=tu_database_id
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

## 🗄️ Configuración de Notion

### Crear la base de datos en Notion

Tu base de datos debe tener las siguientes propiedades:

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **Nome** | Title | Nombre del producto |
| **Prezzo** | Number | Precio en euros |
| **Descrizione** | Rich Text | Descripción del producto |
| **Categorie** | Select | Categoría del producto |
| **Foto** | Files | Imagen del producto |
| **Status** | Select | Estado: "En venta", "Vendido" |

### Valores del campo Status

- **"En venta"**: Producto disponible
- **"Vendido"**: Producto no disponible

## 🎯 Funcionalidades

### Catálogo de Productos
- Visualización en grid y lista
- Filtros por categoría
- Búsqueda de productos
- Detalles completos de cada producto

### Carrito de Compras
- Agregar/eliminar productos
- Modificar cantidades
- Resumen de compra
- Contacto directo por WhatsApp

### Internacionalización
- Cambio de idioma dinámico
- Rutas localizadas
- Contenido traducido

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio** en [vercel.com](https://vercel.com)
2. **Configurar variables de entorno**:
   - `NOTION_SECRET`
   - `NOTION_DATABASE_ID`
3. **Deploy automático** con cada push

### Otros proveedores

El proyecto es compatible con cualquier proveedor que soporte Node.js:
- Netlify
- AWS
- Google Cloud Platform
- Railway

## 📁 Estructura del Proyecto

```
myshop-sicilia/
├── app/
│   ├── [locale]/          # Rutas internacionalizadas
│   │   ├── layout.tsx     # Layout principal
│   │   └── page.tsx       # Página principal
│   ├── api/
│   │   └── products/      # API de productos
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
├── lib/                  # Utilidades
│   ├── cart.ts           # Lógica del carrito
│   └── notion.ts         # API de Notion
├── messages/             # Traducciones
├── types/               # Tipos TypeScript
└── public/              # Archivos estáticos
```

## 🔧 Scripts Disponibles

```bash
npm run dev        # Desarrollo
npm run build      # Construcción
npm run start      # Producción
npm run lint       # Linting
```

## 🎨 Personalización

### Colores
Modifica `tailwind.config.ts` para cambiar la paleta de colores:

```typescript
colors: {
  primary: {
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
  },
  secondary: {
    300: '#d1d5db',
    800: '#1f2937',
    900: '#111827',
  }
}
```

### Traducciones
Agrega o modifica traducciones en `messages/`:
- `es.json` (Español)
- `it.json` (Italiano)
- `en.json` (Inglés)

## 📞 Contacto

Para consultas sobre productos, contáctanos por WhatsApp: [+39 348 186 0784](https://wa.me/393481860784)

## 📄 Licencia

Este proyecto está bajo la Licencia Apache 2.0. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 🏠 Ubicación

**Ragusa, Sicilia, Italia**

---

Desarrollado con ❤️ para la comunidad de Sicilia 