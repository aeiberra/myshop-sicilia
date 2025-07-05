export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'category' | 'date';
  sortOrder?: 'asc' | 'desc';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface NotionProperty {
  id: string;
  type: string;
  [key: string]: any;
}

export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: Record<string, NotionProperty>;
  url: string;
}

export interface NotionResponse {
  results: NotionPage[];
  next_cursor?: string;
  has_more: boolean;
}

export interface WhatsAppMessage {
  items: CartItem[];
  total: number;
  customerInfo?: {
    name?: string;
    notes?: string;
  };
}

export const PRODUCT_CATEGORIES = [
  'Tecnología',
  'Electrodomésticos', 
  'Muebles',
  'Bazar',
  'Oficina',
  'Herramientas',
  'Varios'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]; 