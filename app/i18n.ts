import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({requestLocale}) => {
  // Get the locale from the request
  const locale = await requestLocale;
  
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
}); 