import { initI18n } from './store/i18n.store';

// Function to detect Erwin Report
function isErwinReport() {
  const ths = Array.from(document.querySelectorAll('table th'));
  const hasObject = ths.some(th => th.textContent?.trim() === 'Object');
  const hasLeft = ths.some(th => th.textContent?.trim() === 'Left');
  const hasRight = ths.some(th => th.textContent?.trim() === 'Right');
  return hasObject && hasLeft && hasRight;
}

// Initialize i18n before everything
initI18n().then(() => {
  // If we are in a Userscript environment and detect an Erwin report,
  // we might want to clear the body to avoid showing the raw table below our app
  if (isErwinReport()) {
    // We wait for the DOM to be fully loaded if needed,
    // but usually userscripts run at document-end or document-idle
    document.body.innerHTML = '<app-root></app-root>';
  }

  import('./main');
});
