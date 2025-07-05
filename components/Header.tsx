'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Globe, MapPin } from 'lucide-react';
import { getCart } from '@/lib/cart';
import { Cart } from '@/types/product';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 });
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    // Cargar carrito inicial
    const currentCart = getCart();
    setCart(currentCart);

    // Escuchar cambios en el carrito
    const handleStorageChange = () => {
      const updatedCart = getCart();
      setCart(updatedCart);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cart-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart-updated', handleStorageChange);
    };
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = pathname.split('/').slice(2).join('/');
    router.push(`/${newLocale}/${currentPath}`);
    setIsLangMenuOpen(false);
  };

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-900">
                  {t('header.title')}
                </h1>
                <p className="text-sm text-secondary-600 hidden sm:block">
                  {t('header.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="hidden md:flex items-center space-x-2 text-secondary-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{t('header.location')}</span>
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-4">
            {/* Selector de idioma */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{currentLanguage.flag}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Contador del carrito */}
            <div className="relative">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">
                  {t('header.cart')}
                </span>
                {cart.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 