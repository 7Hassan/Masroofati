import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Load translations using http (default: public/locales folder)
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    fallbackLng: 'ar', // Default language
    debug: true, // Enable debug mode for development
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    backend: {
      loadPath: '/locales/{{lng}}.json', // Path to JSON files
    },
    detection: {
      order: [
        'queryString',
        'cookie',
        'localStorage',
        'htmlTag',
        'navigator',
        'path',
        'subdomain',
      ],
      caches: ['cookie'],
    },
  });

export default i18n;
