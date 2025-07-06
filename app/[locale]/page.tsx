import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import ProductCatalog from '@/components/ProductCatalog';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Catálogo de productos */}
          <div className="lg:col-span-3">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductCatalog />
            </Suspense>
          </div>
          
          {/* Carrito lateral */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Cart />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

export function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'it' },
    { locale: 'en' }
  ];
} 