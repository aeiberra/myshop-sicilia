'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { addToCart, isProductInCart } from '@/lib/cart';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const t = useTranslations();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  // Verificar si el producto está en el carrito
  useEffect(() => {
    const checkCart = () => {
      setIsInCart(isProductInCart(product.id));
    };

    // Verificar al cargar
    checkCart();

    // Escuchar cambios en el carrito
    const handleCartUpdate = () => {
      checkCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [product.id]);

  const handleAddToCart = async () => {
    if (isInCart) return; // No hacer nada si ya está en el carrito

    setIsAddingToCart(true);
    try {
      const result = addToCart(product);
      
      if (result) {
        // Disparar evento personalizado para actualizar el carrito
        window.dispatchEvent(new Event('cart-updated'));
        
        // Feedback visual
        setTimeout(() => {
          setIsAddingToCart(false);
        }, 500);
      } else {
        // El producto ya estaba en el carrito
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

  // Determinar el estado del botón
  const getButtonState = () => {
    if (!product.available) {
      return {
        text: t('products.outOfStock'),
        className: 'bg-gray-300 text-gray-500 cursor-not-allowed',
        disabled: true,
        icon: <ShoppingCart className="w-4 h-4" />,
        iconMobile: <ShoppingCart className="w-3 h-3" />
      };
    }

    if (isInCart) {
      return {
        text: t('products.inCart'),
        className: 'bg-green-600 text-white cursor-default',
        disabled: true,
        icon: <Check className="w-4 h-4" />,
        iconMobile: <Check className="w-3 h-3" />
      };
    }

    if (isAddingToCart) {
      return {
        text: '...',
        className: 'bg-primary-600 text-white',
        disabled: true,
        icon: <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>,
        iconMobile: <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      };
    }

    return {
      text: t('products.addToCart'),
      className: 'bg-primary-600 text-white hover:bg-primary-700',
      disabled: false,
      icon: <ShoppingCart className="w-4 h-4" />,
      iconMobile: <ShoppingCart className="w-3 h-3" />
    };
  };

  const buttonState = getButtonState();

  if (viewMode === 'list') {
    return (
      <div className="card p-3 sm:p-4 hover:shadow-lg transition-shadow duration-300">
        <div className="flex space-x-3 sm:space-x-4">
          {/* Imagen - más pequeña en mobile para dar más espacio */}
          <div className="flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
            {product.image && !imageError ? (
              <Image
                src={product.image}
                alt={product.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Eye className="w-4 h-4 sm:w-8 sm:h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Información - layout optimizado para mobile */}
          <div className="flex-1 min-w-0">
            {/* Layout móvil: Más compacto */}
            <div className="sm:hidden">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-sm font-semibold text-secondary-900 line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-primary-600 font-medium">
                    {t(`categories.${product.category}`)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <p className="text-base font-bold text-secondary-900">
                    €{product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              
              {/* Descripción más corta */}
              <p className="text-secondary-600 text-xs mb-2 line-clamp-1">
                {product.description}
              </p>
              
              {/* Botón más prominente */}
              <button
                onClick={handleAddToCart}
                disabled={buttonState.disabled}
                className={`w-full py-2 px-2 rounded-md text-xs font-medium transition-colors ${buttonState.className}`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-3 h-3 flex-shrink-0">
                    {buttonState.iconMobile}
                  </div>
                  <span className="truncate">{buttonState.text}</span>
                </div>
              </button>
            </div>

            {/* Layout desktop: Horizontal */}
            <div className="hidden sm:block">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-primary-600 font-medium mt-1">
                    {t(`categories.${product.category}`)}
                  </p>
                  <p className="text-secondary-600 text-sm mt-2 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4 text-right">
                  <p className="text-2xl font-bold text-secondary-900">
                    €{product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={handleAddToCart}
                    disabled={buttonState.disabled}
                    className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${buttonState.className}`}
                  >
                    <div className="flex items-center space-x-2">
                      {buttonState.icon}
                      <span>{buttonState.text}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card group cursor-pointer hover:shadow-product-hover transition-all duration-300">
      {/* Imagen */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.image && !imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Eye className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Overlay con estado */}
        {!product.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {t('products.outOfStock')}
            </span>
          </div>
        )}
      </div>

      {/* Información */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-secondary-900 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xl font-bold text-secondary-900 ml-2">
            €{product.price.toFixed(2)}
          </p>
        </div>
        
        <p className="text-sm text-primary-600 font-medium mb-2">
          {t(`categories.${product.category}`)}
        </p>
        
        <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <button
          onClick={handleAddToCart}
          disabled={buttonState.disabled}
          className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors ${buttonState.className}`}
        >
          <div className="flex items-center justify-center space-x-2">
            {buttonState.icon}
            <span>{buttonState.text}</span>
          </div>
        </button>
      </div>
    </div>
  );
} 