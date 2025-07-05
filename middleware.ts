import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['es', 'it', 'en'],
  
  // Used when no locale matches
  defaultLocale: 'es',
  
  // Only match routes
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|it|en)/:path*']
}; 