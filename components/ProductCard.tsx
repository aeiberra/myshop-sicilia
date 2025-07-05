'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { addToCart } from '@/lib/cart';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const t = useTranslations();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addToCart(product, 1);
      
      // Disparar evento personalizado para actualizar el carrito
      window.dispatchEvent(new Event('cart-updated'));
      
      // Feedback visual
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
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

  if (viewMode === 'list') {
    return (
      <div className="card p-4 hover:shadow-lg transition-shadow duration-300">
        <div className="flex space-x-4">
          {/* Imagen */}
          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
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
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex-1 min-w-0">
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
                  disabled={!product.available || isAddingToCart}
                  className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    product.available
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {product.available ? t('products.addToCart') : t('products.outOfStock')}
                      </span>
                    </div>
                  )}
                </button>
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
          disabled={!product.available || isAddingToCart}
          className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            product.available
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAddingToCart ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>
                {product.available ? t('products.addToCart') : t('products.outOfStock')}
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
} 