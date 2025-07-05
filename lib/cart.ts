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

// Calcular totales del carrito
export function calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { total, itemCount };
}

// Agregar producto al carrito
export function addToCart(product: Product, quantity: number = 1): Cart {
  const cart = getCart();
  const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);

  if (existingItemIndex >= 0) {
    // Si el producto ya existe, actualizar cantidad
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Si el producto no existe, agregarlo
    cart.items.push({ product, quantity });
  }

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

// Actualizar cantidad de un producto
export function updateCartItemQuantity(productId: string, quantity: number): Cart {
  const cart = getCart();
  const itemIndex = cart.items.findIndex(item => item.product.id === productId);

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Si cantidad es 0 o negativa, remover el producto
      cart.items.splice(itemIndex, 1);
    } else {
      // Actualizar cantidad
      cart.items[itemIndex].quantity = quantity;
    }
  }

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

// Generar mensaje de WhatsApp
export function generateWhatsAppMessage(cart: Cart, whatsappMessage: string): string {
  const items = cart.items.map(item => 
    `• ${item.product.name} - €${item.product.price} x${item.quantity} = €${(item.product.price * item.quantity).toFixed(2)}`
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
    addToCart: (product: Product, quantity?: number) => addToCart(product, quantity),
    removeFromCart: (productId: string) => removeFromCart(productId),
    updateQuantity: (productId: string, quantity: number) => updateCartItemQuantity(productId, quantity),
    clearCart: () => clearCart(),
    generateWhatsAppUrl: (phoneNumber: string, message: string) => generateWhatsAppUrl(cart, phoneNumber, message),
  };
} 