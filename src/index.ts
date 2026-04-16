import { get } from 'lit-translate';
import { parseErwinHtml } from './parser/html-parser';
import {
  fileName$,
  initializeVisibility,
  isLoading$,
  isUserscript$,
  rawData$,
} from './store/data.store';
import { initI18n } from './store/i18n.store';

declare global {
  interface Window {
    __ERWIN_ORIGINAL_HTML__?: string;
  }
}

// Function to detect Erwin Report
function isErwinReport() {
  const ths = Array.from(document.querySelectorAll('table th'));
  const hasType = ths.some(th => th.textContent?.trim() === 'Type');
  const hasLeftValue = ths.some(th => th.textContent?.trim() === 'Left Value');
  const hasRightValue = ths.some(th => th.textContent?.trim() === 'Right Value');
  return hasType && hasLeftValue && hasRightValue;
}

// Initialize i18n before everything
initI18n().then(() => {
  // If we are in a Userscript environment and detect an Erwin report,
  // we might want to clear the body to avoid showing the raw table below our app
  if (isErwinReport()) {
    console.log('Erwin Report detected via Userscript, transforming...');
    isUserscript$.set(true);

    const originalHTML = document.documentElement.outerHTML;
    window.__ERWIN_ORIGINAL_HTML__ = originalHTML;

    // Extract model name from the first tr after the header
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
      const rows = parseErwinHtml(originalHTML);
      rawData$.set(rows);
      initializeVisibility();
      isLoading$.set(false);
    }, 100);
  }

  import('./main');
});
