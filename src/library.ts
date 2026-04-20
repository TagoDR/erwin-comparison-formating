import { AppRoot } from './main.js';
import { initI18n } from './store/i18n.store.js';

/**
 * Register the component as a library-specific tag.
 */
if (!customElements.get('erwin-comparison-formatter')) {
  customElements.define('erwin-comparison-formatter', AppRoot);
}

/**
 * Export the class for programmatic usage.
 */
export { AppRoot };

/**
 * Auto-initialize i18n when the library is loaded.
 */
initI18n().catch(err => {
  console.error('[Erwin Library] Failed to initialize i18n:', err);
});
