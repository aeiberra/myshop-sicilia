'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, ShoppingCart, Check, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { addToCart, isProductInCart } from '@/lib/cart';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const t = useTranslations();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  // Verificar si el producto está en el carrito
  useEffect(() => {
    if (!product) return;
    
    const checkCart = () => {
      setIsInCart(isProductInCart(product.id));
    };

    checkCart();

    const handleCartUpdate = () => {
      checkCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [product?.id]);

  // Reset estados cuando se abre el modal
  useEffect(() => {
    if (isOpen && product) {
      setIsImageLoading(true);
      setImageError(false);
    }
  }, [isOpen, product]);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAddToCart = async () => {
    if (!product || isInCart) return;

    setIsAddingToCart(true);
    try {
      const result = addToCart(product);
      
      if (result) {
        window.dispatchEvent(new Event('cart-updated'));
        setTimeout(() => {
          setIsAddingToCart(false);
        }, 500);
      } else {
        setIsAddingToCart(false);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  const getButtonState = () => {
    if (!product?.available) {
      return {
        text: t('products.outOfStock'),
        className: 'bg-gray-300 text-gray-500 cursor-not-allowed',
        disabled: true,
        icon: <ShoppingCart className="w-5 h-5" />
      };
    }

    if (isInCart) {
      return {
        text: t('products.inCart'),
        className: 'bg-green-600 text-white cursor-default',
        disabled: true,
        icon: <Check className="w-5 h-5" />
      };
    }

    if (isAddingToCart) {
      return {
        text: '...',
        className: 'bg-primary-600 text-white',
        disabled: true,
        icon: <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      };
    }

    return {
      text: t('products.addToCart'),
      className: 'bg-primary-600 text-white hover:bg-primary-700',
      disabled: false,
      icon: <ShoppingCart className="w-5 h-5" />
    };
  };

  if (!isOpen || !product) return null;

  const buttonState = getButtonState();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <h2 className="text-lg font-semibold text-secondary-900 pr-8">
              {product.name}
            </h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Imagen */}
              <div className="aspect-square w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden">
                {product.image && !imageError ? (
                  <div className="relative w-full h-full">
                    {isImageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Eye className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {t(`categories.${product.category}`)}
                  </span>
                  <span className="text-2xl font-bold text-secondary-900">
                    €{product.price.toFixed(2)}
                  </span>
                </div>

                {/* Descripción completa */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {t('products.description')}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-secondary-900">
                      {t('products.availability')}:
                    </span>
                    <span className={`ml-2 ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                      {product.available ? t('products.available') : t('products.outOfStock')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-secondary-900">
                      {t('products.category')}:
                    </span>
                    <span className="ml-2 text-secondary-600">
                      {t(`categories.${product.category}`)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="border-t p-4 bg-gray-50 flex-shrink-0">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-secondary-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                {t('common.close')}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={buttonState.disabled}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${buttonState.className}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {buttonState.icon}
                  <span>{buttonState.text}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 