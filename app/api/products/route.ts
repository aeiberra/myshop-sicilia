import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getMockProducts, verifyNotionConnection, getFirstRecords } from '@/lib/notion';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');
  
  // Ruta de diagnóstico
  if (mode === 'diagnose') {
    const connectionResult = await verifyNotionConnection();
    
    if (!connectionResult.success) {
      return NextResponse.json({
        status: 'error',
        message: connectionResult.message,
        suggestion: 'Revisa las variables de entorno NOTION_SECRET y NOTION_DATABASE_ID'
      }, { status: 500 });
    }
    
    const recordsResult = await getFirstRecords(3);
    
    return NextResponse.json({
      status: 'success',
      connection: connectionResult,
      records: recordsResult,
      suggestion: 'Revisa que las propiedades coincidan con tu base de datos'
    });
  }
  
     try {
     const search = searchParams.get('search');
     const category = searchParams.get('category');
     const useMock = searchParams.get('mock') === 'true';
    
         // Obtener productos
     let products;
     if (useMock || !process.env.NOTION_SECRET) {
       products = await getMockProducts();
     } else {
       products = await getAllProducts();
     }

    // Filtrar por categoría si se especifica
    if (category && category !== 'all') {
      products = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtrar por búsqueda si se especifica
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar solo productos disponibles
    products = products.filter(product => product.available);

    return NextResponse.json({
      products,
      count: products.length,
      success: true
    });
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 