import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh/translation.json';
import en from './locales/en/translation.json';

const resources = {
  zh: { translation: zh },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.startsWith('zh') ? 'zh' : 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n; 