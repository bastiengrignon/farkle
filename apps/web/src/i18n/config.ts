import { initReactI18next } from 'react-i18next';

import { BackendFetch, DevTools, I18nextPlugin, Tolgee, withTolgee } from '@tolgee/i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const NAMESPACES = ['common', 'settings'];
export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;

type Namespace = (typeof NAMESPACES)[number];
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const bindNamespacesByLanguage =
  (language: SupportedLanguage) => async (namespaceList: Promise<object>, namespace: Namespace) => ({
    ...(await namespaceList),
    [namespace]: (await import(`./src/locales/${namespace}/${language}.json`)).default,
  });
const indexTranslationsByLanguage = async (resourceList: Promise<object>, language: SupportedLanguage) => {
  const translations = await NAMESPACES.reduce(bindNamespacesByLanguage(language), Promise.resolve({}));
  return { ...(await resourceList), [language]: translations };
};

const resources = await SUPPORTED_LANGUAGES.reduce(indexTranslationsByLanguage, Promise.resolve({}));

export const tolgee = Tolgee()
  .use(DevTools())
  .use(I18nextPlugin())
  .use(
    BackendFetch({
      prefix: import.meta.env.VITE_TOLGEE_CDN,
      fallbackOnFail: true,
    })
  )
  .init({
    language: 'fr',
    fallbackLanguage: 'fr',
    ns: NAMESPACES,
    fallbackNs: 'common',
    defaultNs: 'common',
    apiUrl: import.meta.env.VITE_TOLGEE_API_URL,
    apiKey: import.meta.env.VITE_TOLGEE_API_KEY,
    staticData: resources,
  });

withTolgee(i18n, tolgee)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'fr',
    fallbackLng: 'fr',
    ns: NAMESPACES,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    appendNamespaceToMissingKey: true,
  });

export default i18n;
