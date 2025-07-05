# Guía de Deployment - MyShop Sicilia

## Opción 1: Vercel (Recomendado)

### Paso 1: Preparar el repositorio
1. Crear un repositorio en GitHub
2. Subir todos los archivos del proyecto
3. Asegurarse de que el `.env.local` NO se suba (está en .gitignore)

### Paso 2: Configurar Notion
1. Ir a [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Crear una nueva integración
3. Copiar el "Internal Integration Token" (será tu NOTION_SECRET)
4. En tu tabla de Notion, ir a "Share" → "Invite" → buscar tu integración

### Paso 3: Desplegar en Vercel
1. Ir a [vercel.com](https://vercel.com)
2. Conectar con GitHub
3. Seleccionar el repositorio
4. Configurar variables de entorno:
   - `NOTION_DATABASE_ID`: `126051cd81d98062b3e3cb03c7590935`
   - `NOTION_SECRET`: tu token de Notion
   - `WHATSAPP_NUMBER`: `393481860784`

### Paso 4: Configurar dominio personalizado (opcional)
1. En el dashboard de Vercel, ir a "Domains"
2. Agregar tu dominio personalizado
3. Configurar DNS según las instrucciones

## Opción 2: Netlify

### Paso 1: Compilar el proyecto
```bash
npm run build
```

### Paso 2: Configurar variables de entorno
En Netlify Dashboard → Site Settings → Environment Variables:
- `NOTION_DATABASE_ID`: `126051cd81d98062b3e3cb03c7590935`
- `NOTION_SECRET`: tu token de Notion
- `WHATSAPP_NUMBER`: `393481860784`

### Paso 3: Desplegar
1. Arrastrar la carpeta `.next` al área de deployment de Netlify
2. O conectar el repositorio de GitHub para auto-deployment

## Configuración de Notion (Importante)

Tu tabla de Notion debe tener exactamente estas columnas:

| Nombre Columna | Tipo | Descripción |
|---|---|---|
| `Nombre` | Title | Nombre del producto |
| `Precio` | Number | Precio en euros |
| `Descripción` | Rich Text | Descripción del producto |
| `Categoría` | Select | Una de: Tecnología, Electrodomésticos, Muebles, Bazar, Oficina, Herramientas, Varios |
| `Foto` | Files | Imagen del producto |
| `Disponible` | Checkbox | ✅ si está disponible |

## Verificación Post-Deployment

1. **Verificar idiomas**: Ir a `/es`, `/it`, `/en`
2. **Verificar productos**: Deben cargar desde tu tabla de Notion
3. **Verificar carrito**: Agregar productos y probar
4. **Verificar WhatsApp**: Hacer un pedido de prueba
5. **Verificar SEO**: Comprobar que aparece en Google

## Troubleshooting

### Problema: "No se cargan los productos"
- Verificar que NOTION_SECRET esté configurado
- Verificar que la integración tenga acceso a la tabla
- Verificar que los nombres de las columnas sean exactos

### Problema: "Error de WhatsApp"
- Verificar que WHATSAPP_NUMBER esté configurado
- Verificar que el número sea correcto (+39 348 186 0784)

### Problema: "Error de idiomas"
- Verificar que los archivos de traducción estén en `/messages/`
- Verificar que el middleware esté configurado

## Monitoreo

- **Vercel**: Dashboard automático con analytics
- **Netlify**: Analytics integrado
- **Notion**: Puedes ver los cambios en tiempo real

## Actualizaciones

Para actualizar productos:
1. Editar la tabla de Notion
2. Los cambios se reflejan automáticamente en el sitio web
3. No necesitas redesplegar

## Contacto para Soporte

Si tienes problemas con el deployment, puedes:
1. Revisar los logs en Vercel/Netlify
2. Verificar la configuración de Notion
3. Comprobar las variables de entorno 