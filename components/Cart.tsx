'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ShoppingCart, Trash2, Send, X } from 'lucide-react';
import { Cart as CartType, CartItem } from '@/types/product';
import { getCart, removeFromCart, clearCart, generateWhatsAppUrl } from '@/lib/cart';

const WHATSAPP_NUMBER = '393481860784';

export default function Cart() {
  const t = useTranslations();
  const [cart, setCart] = useState<CartType>({ items: [], total: 0, itemCount: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Cargar carrito inicial
    loadCart();

    // Escuchar cambios en el carrito
    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cart-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart-updated', handleStorageChange);
    };
  }, []);

  const loadCart = () => {
    const currentCart = getCart();
    setCart(currentCart);
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleClearCart = () => {
    const clearedCart = clearCart();
    setCart(clearedCart);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) return;

    setIsLoading(true);
    try {
      const whatsappUrl = generateWhatsAppUrl(
        cart, 
        WHATSAPP_NUMBER, 
        t('cart.whatsappMessage')
      );
      
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error generating WhatsApp URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CartItem = ({ item }: { item: CartItem }) => (
    <div className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0">
      {/* Imagen */}
      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <ShoppingCart className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* Información */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-secondary-900 truncate">
          {item.product.name}
        </h4>
        <p className="text-xs text-secondary-500 mt-1">
          {t(`categories.${item.product.category}`)}
        </p>
        <p className="text-sm font-semibold text-primary-600 mt-1">
          €{item.product.price.toFixed(2)}
        </p>
      </div>

      {/* Botón eliminar */}
      <div className="flex-shrink-0">
        <button
          onClick={() => handleRemoveItem(item.product.id)}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          title={t('cart.removeItem')}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const MobileCartModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header del carrito */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
          <h2 className="text-lg font-semibold text-secondary-900">
            {t('cart.title')}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            <div className="text-center py-8 px-4">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-secondary-600 font-medium">
                {t('cart.empty')}
              </p>
              <p className="text-sm text-secondary-500 mt-2">
                {t('cart.emptyDescription')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cart.items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="p-4 border-t border-gray-200 space-y-4 bg-white rounded-b-lg">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-secondary-900">
                {t('cart.total')}
              </span>
              <span className="text-xl font-bold text-primary-600">
                €{cart.total.toFixed(2)}
              </span>
            </div>

            {/* Resumen */}
            <div className="text-sm text-secondary-600">
              {cart.itemCount} {cart.itemCount === 1 ? t('cart.item') : t('cart.items')}
            </div>

            {/* Botones */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t('cart.checkout')}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleClearCart}
                className="w-full bg-gray-100 text-secondary-900 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                {t('cart.clear')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Botón flotante en móvil */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 lg:hidden bg-primary-600 text-white p-4 rounded-full shadow-lg z-40"
      >
        <ShoppingCart className="w-6 h-6" />
        {cart.itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {cart.itemCount}
          </span>
        )}
      </button>

      {/* Modal para móvil usando Portal */}
      {mounted && isOpen && createPortal(
        <MobileCartModal />,
        document.body
      )}

      {/* Carrito para desktop */}
      <div className="hidden lg:block">
        <div className="card h-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-secondary-900">
              {t('cart.title')}
            </h2>
          </div>

          {/* Contenido del carrito desktop */}
          <div className="flex-1 overflow-y-auto lg:max-h-none">
            {cart.items.length === 0 ? (
              <div className="text-center py-8 px-4">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-secondary-600 font-medium">
                  {t('cart.empty')}
                </p>
                <p className="text-sm text-secondary-500 mt-2">
                  {t('cart.emptyDescription')}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cart.items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer desktop */}
          {cart.items.length > 0 && (
            <div className="p-4 border-t border-gray-200 space-y-4 flex-shrink-0 bg-white">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-secondary-900">
                  {t('cart.total')}
                </span>
                <span className="text-xl font-bold text-primary-600">
                  €{cart.total.toFixed(2)}
                </span>
              </div>

              {/* Resumen */}
              <div className="text-sm text-secondary-600">
                {cart.itemCount} {cart.itemCount === 1 ? t('cart.item') : t('cart.items')}
              </div>

              {/* Botones */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t('cart.checkout')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleClearCart}
                  className="w-full bg-gray-100 text-secondary-900 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  {t('cart.clear')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 