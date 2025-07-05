import '../globals.css';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyShop Sicilia - Productos de hogar en venta',
  description: 'Encuentra productos de hogar en venta en Ragusa, Sicilia. Tecnología, electrodomésticos, muebles y más. Contacto directo por WhatsApp.',
  keywords: 'venta, hogar, productos, Ragusa, Sicilia, tecnología, electrodomésticos, muebles',
  authors: [{ name: 'MyShop Sicilia' }],
  creator: 'MyShop Sicilia',
  publisher: 'MyShop Sicilia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://myshop-sicilia.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'es': '/es',
      'it': '/it',
      'en': '/en',
    },
  },
  openGraph: {
    title: 'MyShop Sicilia - Productos de hogar en venta',
    description: 'Encuentra productos de hogar en venta en Ragusa, Sicilia. Tecnología, electrodomésticos, muebles y más.',
    url: 'https://myshop-sicilia.vercel.app',
    siteName: 'MyShop Sicilia',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MyShop Sicilia - Productos de hogar en venta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyShop Sicilia - Productos de hogar en venta',
    description: 'Encuentra productos de hogar en venta en Ragusa, Sicilia.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MyShop Sicilia" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 