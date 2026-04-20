import { registerTranslateConfig, use } from 'lit-translate';
import { atom } from 'nanostores';

export const language$ = atom<string>(__APP_LANG__);

export const changeLanguage = async (lang: string) => {
  await use(lang);
  language$.set(lang);
};

export const initI18n = async () => {
  registerTranslateConfig({
    loader: (_lang: string) => Promise.resolve(__APP_TRANSLATIONS__),
  });

  await changeLanguage(__APP_LANG__);
};
