import { Client } from '@notionhq/client';
import { Product, NotionResponse, NotionPage } from '@/types/product';

// Inicializar cliente de Notion
const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '126051cd81d98062b3e3cb03c7590935';

// Función para obtener valor de texto de una propiedad de Notion
function getTextFromProperty(property: any): string {
  if (!property) return '';
  
  if (property.type === 'title' && property.title?.[0]?.plain_text) {
    return property.title[0].plain_text;
  }
  
  if (property.type === 'rich_text' && property.rich_text?.[0]?.plain_text) {
    return property.rich_text[0].plain_text;
  }
  
  if (property.type === 'select' && property.select?.name) {
    return property.select.name;
  }
  
  return '';
}

// Función para obtener número de una propiedad de Notion
function getNumberFromProperty(property: any): number {
  if (!property) return 0;
  
  if (property.type === 'number' && typeof property.number === 'number') {
    return property.number;
  }
  
  return 0;
}

// Función para obtener URL de imagen de una propiedad de Notion
function getImageFromProperty(property: any): string {
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

// Función para obtener valor booleano de una propiedad de Notion
function getBooleanFromProperty(property: any): boolean {
  if (!property) return true; // Por defecto disponible
  
  if (property.type === 'checkbox') {
    return property.checkbox;
  }
  
  return true;
}

// Función para obtener estado de disponibilidad desde una propiedad select
function getStatusFromProperty(property: any): boolean {
  if (!property) return true; // Por defecto disponible
  
  if (property.type === 'select' && property.select?.name) {
    const status = property.select.name.toLowerCase();
    
    // Considera disponible si el status indica que está en venta o disponible
    return status.includes('en venta') ||
           status.includes('disponible') || 
           status.includes('available') || 
           status.includes('activo') || 
           status.includes('active') ||
           status === 'si' ||
           status === 'sí' ||
           status === 'yes';
  }
  
  return true; // Por defecto disponible
}

// Convertir página de Notion a Product
function convertNotionPageToProduct(page: NotionPage): Product {
  const properties = page.properties;
  
  return {
    id: page.id,
    name: getTextFromProperty(properties.Nome || properties.Nombre || properties.Name),
    price: getNumberFromProperty(properties.Prezzo || properties.Precio || properties.Price),
    description: getTextFromProperty(properties.Descrizione || properties.Descripción || properties.Description),
    category: getTextFromProperty(properties.Categorie || properties.Categoría || properties.Category),
    image: getImageFromProperty(properties.Foto || properties.Image || properties.foto),
    available: getStatusFromProperty(properties.Status || properties.Disponible || properties.Available),
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
  };
}

// Obtener todos los productos de Notion
export async function getAllProducts(): Promise<Product[]> {
  try {
    // Obtenemos todos los productos sin filtros para mayor compatibilidad
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 100,
    });

    const products = response.results.map((page: any) => 
      convertNotionPageToProduct(page as NotionPage)
    );

    // Filtrar productos disponibles en el código
    return products.filter(product => product.available);
  } catch (error) {
    console.error('Error fetching products from Notion:', error);
    return [];
  }
}

// Obtener productos por categoría
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    // Obtenemos todos los productos y filtramos por categoría en el código
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 100,
    });

    const products = response.results.map((page: any) => 
      convertNotionPageToProduct(page as NotionPage)
    );

    // Filtrar por categoría y disponibilidad en el código
    return products.filter(product => 
      product.available && 
      product.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error('Error fetching products by category from Notion:', error);
    return [];
  }
}

// Obtener un producto específico por ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await notion.pages.retrieve({
      page_id: id,
    });

    return convertNotionPageToProduct(response as NotionPage);
  } catch (error) {
    console.error('Error fetching product by ID from Notion:', error);
    return null;
  }
}

// Función para testing con datos mock (cuando no hay NOTION_SECRET)
export async function getMockProducts(): Promise<Product[]> {
  return [
    {
      id: '1',
      name: 'Laptop Dell XPS 13',
      price: 800,
      description: 'Laptop Dell XPS 13 en excelente estado, ideal para trabajo y estudios.',
      category: 'Tecnología',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
      available: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'Refrigerador Samsung',
      price: 1200,
      description: 'Refrigerador Samsung de 2 puertas, muy eficiente y espacioso.',
      category: 'Electrodomésticos',
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500',
      available: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '3',
      name: 'Sofá de 3 plazas',
      price: 400,
      description: 'Sofá cómodo de 3 plazas, color gris, perfecto para sala de estar.',
      category: 'Muebles',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
      available: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ];
}

// Función para verificar la conexión y obtener información de la base de datos
export async function verifyNotionConnection(): Promise<{
  success: boolean;
  message: string;
  databaseInfo?: any;
  properties?: any;
}> {
  try {
    // Verificar si tenemos las variables de entorno
    if (!process.env.NOTION_SECRET) {
      return {
        success: false,
        message: 'NOTION_SECRET no está configurada en las variables de entorno'
      };
    }

    if (!DATABASE_ID) {
      return {
        success: false,
        message: 'NOTION_DATABASE_ID no está configurada en las variables de entorno'
      };
    }

    // Intentar obtener información de la base de datos
    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });

    // Obtener las propiedades de la base de datos
    const properties = Object.keys(database.properties).map(key => ({
      name: key,
      type: database.properties[key].type,
      id: database.properties[key].id
    }));

    return {
      success: true,
      message: 'Conexión exitosa con Notion',
      databaseInfo: {
        title: (database as any).title,
        id: database.id,
        created_time: (database as any).created_time,
        last_edited_time: (database as any).last_edited_time
      },
      properties
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error al conectar con Notion: ${error.message}`,
    };
  }
}

// Función para obtener los primeros registros sin filtros
export async function getFirstRecords(limit: number = 3): Promise<{
  success: boolean;
  message: string;
  records?: any[];
}> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: limit,
    });

    return {
      success: true,
      message: `Se encontraron ${response.results.length} registros`,
      records: response.results.map((page: any) => ({
        id: page.id,
        properties: Object.keys(page.properties).reduce((acc, key) => {
          acc[key] = {
            type: page.properties[key].type,
            value: page.properties[key]
          };
          return acc;
        }, {} as any)
      }))
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error al obtener registros: ${error.message}`,
    };
  }
} 