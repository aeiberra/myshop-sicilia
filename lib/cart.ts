import { Product, CartItem, Cart } from '@/types/product';

const CART_STORAGE_KEY = 'myshop-cart';

// Obtener carrito desde localStorage
export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, itemCount: 0 };
  }

  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) {
      return { items: [], total: 0, itemCount: 0 };
    }

    const cart: Cart = JSON.parse(cartData);
    return cart;
  } catch (error) {
    console.error('Error loading cart:', error);
    return { items: [], total: 0, itemCount: 0 };
  }
}

// Guardar carrito en localStorage
export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

// Calcular totales del carrito (sin cantidad)
export function calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
  const total = items.reduce((sum, item) => sum + item.product.price, 0);
  const itemCount = items.length; // Cada producto cuenta como 1
  
  return { total, itemCount };
}

// Verificar si un producto ya está en el carrito
export function isProductInCart(productId: string): boolean {
  const cart = getCart();
  return cart.items.some(item => item.product.id === productId);
}

// Agregar producto al carrito (solo si no existe ya)
export function addToCart(product: Product): Cart | null {
  const cart = getCart();
  const existingItem = cart.items.find(item => item.product.id === product.id);

  // Si el producto ya existe, no hacer nada
  if (existingItem) {
    return null; // Producto ya está en el carrito
  }

  // Agregar el producto sin cantidad
  cart.items.push({ product });

  // Recalcular totales
  const { total, itemCount } = calculateCartTotals(cart.items);
  cart.total = total;
  cart.itemCount = itemCount;

  saveCart(cart);
  return cart;
}

// Remover producto del carrito
export function removeFromCart(productId: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.product.id !== productId);

  // Recalcular totales
  const { total, itemCount } = calculateCartTotals(cart.items);
  cart.total = total;
  cart.itemCount = itemCount;

  saveCart(cart);
  return cart;
}

// Vaciar carrito
export function clearCart(): Cart {
  const emptyCart: Cart = { items: [], total: 0, itemCount: 0 };
  saveCart(emptyCart);
  return emptyCart;
}

// Generar mensaje de WhatsApp (sin cantidad)
export function generateWhatsAppMessage(cart: Cart, whatsappMessage: string): string {
  const items = cart.items.map(item => 
    `• ${item.product.name} - €${item.product.price.toFixed(2)}`
  ).join('\n');

  const message = `${whatsappMessage}\n\n${items}\n\n*Total: €${cart.total.toFixed(2)}*`;
  
  return encodeURIComponent(message);
}

// Generar URL de WhatsApp
export function generateWhatsAppUrl(cart: Cart, phoneNumber: string, whatsappMessage: string): string {
  const message = generateWhatsAppMessage(cart, whatsappMessage);
  return `https://wa.me/${phoneNumber}?text=${message}`;
}

// Hook personalizado para usar en componentes React
export function useCart() {
  const cart = getCart();

  return {
    cart,
    addToCart: (product: Product) => addToCart(product),
    removeFromCart: (productId: string) => removeFromCart(productId),
    clearCart: () => clearCart(),
    isProductInCart: (productId: string) => isProductInCart(productId),
    generateWhatsAppUrl: (phoneNumber: string, message: string) => generateWhatsAppUrl(cart, phoneNumber, message),
  };
} 