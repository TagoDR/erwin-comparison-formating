import { registerTranslateConfig, use } from 'lit-translate';
import { atom } from 'nanostores';
import enUS from '../i18n/en-US.json';
import esES from '../i18n/es-ES.json';
import frFR from '../i18n/fr-FR.json';
import ptBR from '../i18n/pt-BR.json';

const translations = {
  'en-US': enUS,
  'pt-BR': ptBR,
  'fr-FR': frFR,
  'es-ES': esES,
};

export const language$ = atom<string>('pt-BR');

export const changeLanguage = async (lang: string) => {
  await use(lang);
  language$.set(lang);
};

export const initI18n = async () => {
  registerTranslateConfig({
    loader: (lang: string) =>
      Promise.resolve(translations[lang as keyof typeof translations] || ptBR),
  });

  // Detect language
  const browserLang = navigator.language;
  let defaultLang = 'pt-BR'; // Portuguese is the default if detection fails or is not matched

  if (browserLang.startsWith('en')) {
    defaultLang = 'en-US';
  } else if (browserLang.startsWith('fr')) {
    defaultLang = 'fr-FR';
  } else if (browserLang.startsWith('es')) {
    defaultLang = 'es-ES';
  } else if (browserLang.startsWith('pt')) {
    defaultLang = 'pt-BR';
  }

  await changeLanguage(defaultLang);
};
