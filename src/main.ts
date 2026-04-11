import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { translate } from 'lit-translate';
import { icons } from './assets/icons';
import { parseErwinHtml } from './parser/html-parser';
import { fileName$, initializeVisibility, isLoading$, rawData$ } from './store/data.store';

// Import Global CSS
import './index.css';
import mainStyles from './main.css?inline';

// Importing components
import './components/app-header';
import './components/app-stats';
import './components/app-table';

// FLAG TO ENABLE SAMPLE DATA IN DEV MODE
const USE_SAMPLE = import.meta.env.DEV && true;

@customElement('app-root')
export class AppRoot extends LitElement {
  static styles = unsafeCSS(mainStyles);
  private isLoading = new StoreController(this, isLoading$);
  private fileName = new StoreController(this, fileName$);

  firstUpdated() {
    if (USE_SAMPLE) {
      this._loadSampleData();
    }

    // Phase 2: Dynamic Page Title
    fileName$.subscribe(name => {
      document.title = name ? `Erwin: ${name}` : 'Erwin Compare Formatter';
    });

    // Phase 2: Global Drag & Drop Support
    this._setupGlobalDragDrop();

    // Userscript: Auto-transform if Erwin report is detected in the current document
    this._detectAndTransformUserscript();
  }

  render() {
    const showData = !!this.fileName.value && !this.isLoading.value;

    return html`
	<div class="main-content" @file-loaded=${this._onFileLoaded}>
	<app-header></app-header>
        <div class="display-area">
          ${
            showData
              ? html`
            <app-stats></app-stats>
            <app-table></app-table>
          `
              : ''
          }

          ${
            !this.fileName.value && !this.isLoading.value
              ? html`
            <div class="empty-state">
              <span class="empty-icon">${icons['file-diff']}</span>
              <span>${translate('app.no_file')}</span>
            </div>
          `
              : ''
          }
        </div>
        
        ${
          this.isLoading.value
            ? html`
          <div class="loading-overlay">
            <div class="spinner"></div>
            <span class="loading-text">${translate('app.loading')}</span>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  private _detectAndTransformUserscript() {
    // Look for typical Erwin Report markers: a table with specific headers
    const ths = Array.from(document.querySelectorAll('table th'));
    const hasObject = ths.some(th => th.textContent?.trim() === 'Object');
    const hasLeft = ths.some(th => th.textContent?.trim() === 'Left');
    const hasRight = ths.some(th => th.textContent?.trim() === 'Right');

    if (hasObject && hasLeft && hasRight) {
      console.log('Erwin Report detected via Userscript, transforming...');
      const originalHTML = document.documentElement.outerHTML;

      // Store current page content before it gets potentially cleared or shadowed
      // In monkey mode, the script might run after DOM is ready.
      fileName$.set(location.pathname.split('/').pop() || 'local-report.html');
      this._processFileContent(originalHTML);
    }
  }

  private _setupGlobalDragDrop() {
    window.addEventListener('dragover', e => {
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener('drop', e => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer?.files?.[0];
      if (file?.name.toLowerCase().endsWith('.html')) {
        this._onFileLoadedFromDrop(file);
      }
    });
  }

  private _onFileLoadedFromDrop(file: File) {
    fileName$.set(file.name);
    isLoading$.set(true);

    const reader = new FileReader();
    reader.onload = e => {
      const buffer = e.target?.result as ArrayBuffer;
      const text = new TextDecoder('windows-1252').decode(buffer);
      this._processFileContent(text);
    };
    reader.readAsArrayBuffer(file);
  }

  private async _loadSampleData() {
    fileName$.set('sample.html');
    isLoading$.set(true);

    try {
      // Using fetch to get the sample file provided in the store
      const response = await fetch('./src/store/sample.html');
      if (!response.ok) throw new Error('Failed to load sample file');
      const content = await response.text();

      // Simulate parsing delay for visual verification
      setTimeout(() => {
        this._processFileContent(content);
      }, 800);
    } catch (error) {
      console.error('Error loading sample data:', error);
      isLoading$.set(false);
    }
  }

  private _onFileLoaded(e: CustomEvent<{ content: string; name: string }>) {
    const { content, name } = e.detail;
    fileName$.set(name);
    isLoading$.set(true);
    this._processFileContent(content);
  }

  private _processFileContent(content: string) {
    console.log('File content loaded, starting parser...', content.substring(0, 100));
    const rows = parseErwinHtml(content);
    rawData$.set(rows);
    initializeVisibility();
    isLoading$.set(false);
  }
}
