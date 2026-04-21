import { get } from 'lit-translate';
import { parseErwinHtml } from './parser/html-parser.js';
import {
  fileName$,
  initializeVisibility,
  isLoading$,
  isUserscript$,
  setModelData,
} from './store/data.store.js';
import { initI18n } from './store/i18n.store.js';

declare global {
  interface Window {
    /** Stores the original Erwin HTML for potential reference or reload. */
    __ERWIN_ORIGINAL_HTML__?: string;
  }
}

/**
 * Detects if the current document is a raw Erwin Data Modeler difference report
 * by checking for the presence of specific table header columns.
 *
 * @returns True if 'Type', 'Left Value', and 'Right Value' headers are found.
 */
function isErwinReport() {
  const ths = Array.from(document.querySelectorAll('table th'));
  const hasType = ths.some(th => th.textContent?.trim() === 'Type');
  const hasLeftValue = ths.some(th => th.textContent?.trim() === 'Left Value');
  const hasRightValue = ths.some(th => th.textContent?.trim() === 'Right Value');
  return hasType && hasLeftValue && hasRightValue;
}

// Initialize i18n before everything
initI18n().then(() => {
  /**
   * Userscript Mode Logic:
   * If an Erwin report is detected, the script immediately clears the body,
   * injects the <app-root> to show the loading spinner, and starts the parsing engine.
   */
  if (isErwinReport()) {
    console.log('Erwin Report detected via Userscript, transforming...');
    isUserscript$.set(true);

    const originalHTML = document.documentElement.outerHTML;
    window.__ERWIN_ORIGINAL_HTML__ = originalHTML;

    // Extract model name from the first tr after the header to use in the title
    const firstRow = document.querySelector('tbody tr');
    const modelNameCell =
      firstRow?.querySelectorAll('td')[1] || firstRow?.querySelectorAll('td')[3];
    const modelName = modelNameCell?.textContent?.trim().replace(/\[Calculated]/g, '') || 'Model';

    const isoDate = new Date().toISOString().split('T')[0];
    const comparisonLabel = get('header.comparison') || 'Comparison';
    const newTitle = `${modelName} ${isoDate} (${comparisonLabel})`;

    document.title = newTitle;
    fileName$.set(newTitle);
    isLoading$.set(true);

    // Inject App Root immediately to show loading spinner
    document.body.innerHTML = '<app-root></app-root>';

    // Use setTimeout to allow initial render of app-root (spinner) before blocking thread for parsing
    setTimeout(() => {
      const model = parseErwinHtml(originalHTML);
      setModelData(model);
      initializeVisibility();
      isLoading$.set(false);
    }, 100);
  }

  // Load the main app components
  import('./main.js');
});
