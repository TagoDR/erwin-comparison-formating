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
	<div class="main-content" @file-selected=${this._onFileSelected}>
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
      // When running as a userscript, the browser has already parsed the document.
      // If the encoding was wrong, the textContent might already be mangled.
      // However, usually the browser handles the local file encoding based on system locale or BOM.
      const originalHTML = document.documentElement.outerHTML;

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
        this._handleFile(file);
      }
    });
  }

  private _onFileSelected(e: CustomEvent<{ file: File }>) {
    this._handleFile(e.detail.file);
  }

  private _handleFile(file: File) {
    fileName$.set(file.name);
    isLoading$.set(true);

    const reader = new FileReader();
    reader.onload = e => {
      const buffer = e.target?.result as ArrayBuffer;
      this._decodeBuffer(buffer);
    };
    reader.readAsArrayBuffer(file);
  }

  /**
   * Attempts to decode the buffer using UTF-8 first, then falling back to Windows-1252.
   * This is a robust way to handle Erwin reports with special Portuguese characters.
   */
  private _decodeBuffer(buffer: ArrayBuffer) {
    try {
      // Try UTF-8 first. 'fatal: true' makes it throw if it encounters invalid sequences.
      const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
      const text = utf8Decoder.decode(buffer);
      this._processFileContent(text);
    } catch (e) {
      console.warn('UTF-8 decoding failed, falling back to windows-1252', e);
      // If UTF-8 fails, it's likely Windows-1252 (common for Erwin/Portuguese)
      const winDecoder = new TextDecoder('windows-1252');
      const text = winDecoder.decode(buffer);
      this._processFileContent(text);
    }
  }

  private async _loadSampleData() {
    fileName$.set('sample.html');
    isLoading$.set(true);

    try {
      const response = await fetch('./src/store/sample.html');
      if (!response.ok) throw new Error('Failed to load sample file');

      // For fetch, we can also use arrayBuffer() to be consistent
      const buffer = await response.arrayBuffer();
      this._decodeBuffer(buffer);
    } catch (error) {
      console.error('Error loading sample data:', error);
      isLoading$.set(false);
    }
  }

  private _processFileContent(content: string) {
    const rows = parseErwinHtml(content);
    rawData$.set(rows);
    initializeVisibility();
    isLoading$.set(false);
  }
}
