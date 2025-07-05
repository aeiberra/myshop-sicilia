'use client';

import { useTranslations } from 'next-intl';
import { MessageCircle, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const t = useTranslations();

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/393481860784`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="bg-secondary-900 text-white mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="text-secondary-300">{t('footer.location')}</span>
              </div>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center space-x-3 hover:text-primary-400 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-secondary-300">{t('footer.whatsapp')}</span>
              </button>
            </div>
          </div>

          {/* Información del sitio */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('header.title')}</h3>
            <p className="text-secondary-300 text-sm">
              {t('header.subtitle')}
            </p>
            <p className="text-secondary-400 text-sm mt-2">
              {t('seo.description')}
            </p>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common.category')}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-secondary-300">{t('categories.Tecnología')}</span>
              <span className="text-secondary-300">{t('categories.Electrodomésticos')}</span>
              <span className="text-secondary-300">{t('categories.Muebles')}</span>
              <span className="text-secondary-300">{t('categories.Bazar')}</span>
              <span className="text-secondary-300">{t('categories.Oficina')}</span>
              <span className="text-secondary-300">{t('categories.Herramientas')}</span>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-secondary-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-6">
              <button
                onClick={handleWhatsAppClick}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 