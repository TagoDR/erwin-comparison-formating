import { initI18n } from './store/i18n.store';

// Initialize i18n before everything
initI18n().then(() => {
  import('./main');
});
