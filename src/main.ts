import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { translate } from 'lit-translate';
import icons from './icons/';
import { parseErwinHtml } from './parser/html-parser.js';
import { fileName$, initializeVisibility, isLoading$, rawData$ } from './store/data.store.js';

// Import Global CSS
import './index.css';
import mainStyles from './main.css?inline';

// Importing components
import './components/app-header.js';
import './components/app-stats.js';
import './components/app-table.js';

/**
 * Flag to enable automatic loading of sample data during development.
 */
const USE_SAMPLE = import.meta.env.DEV && true;

/**
 * Root Component of the Application.
 * Handles file loading, decoding (UTF-8/Windows-1252), and global Drag & Drop.
 */
@customElement('app-root')
export class AppRoot extends LitElement {
  static styles = unsafeCSS(mainStyles);
  private isLoading = new StoreController(this, isLoading$);
  private fileName = new StoreController(this, fileName$);

  /**
   * Initializes the component.
   * Sets up dynamic page titles, global drag-and-drop, and optionally loads sample data.
   */
  firstUpdated() {
    if (USE_SAMPLE) {
      this._loadSampleData();
    }

    // Sync HTML document title with the loaded file name
    fileName$.subscribe(name => {
      document.title = name ? name : 'Erwin Compare Formatter';
    });

    // Setup global listeners for drag-and-drop file ingestion
    this._setupGlobalDragDrop();
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

  /**
   * Configures global event listeners for the 'dragover' and 'drop' events.
   */
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

  /**
   * Handles the 'file-selected' event emitted by the app-header.
   * @param e CustomEvent containing the selected File object.
   */
  private _onFileSelected(e: CustomEvent<{ file: File }>) {
    this._handleFile(e.detail.file);
  }

  /**
   * Reads a file as an ArrayBuffer and triggers decoding.
   * @param file The File object to process.
   */
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
   * Attempts to decode an ArrayBuffer using UTF-8 first, then falls back to Windows-1252.
   * This is essential for handling Erwin reports generated on legacy systems or with
   * specific regional settings (e.g., Portuguese Windows-1252).
   *
   * @param buffer The ArrayBuffer to decode.
   */
  private _decodeBuffer(buffer: ArrayBuffer) {
    try {
      // Try UTF-8 first. 'fatal: true' ensures it throws on invalid sequences.
      const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
      const text = utf8Decoder.decode(buffer);
      this._processFileContent(text);
    } catch (e) {
      console.warn('UTF-8 decoding failed, falling back to windows-1252', e);
      // Fallback to Windows-1252 (commonly used for Erwin reports in Brazil)
      const winDecoder = new TextDecoder('windows-1252');
      const text = winDecoder.decode(buffer);
      this._processFileContent(text);
    }
  }

  /**
   * Loads the built-in sample.html file for demonstration/testing purposes.
   */
  private async _loadSampleData() {
    fileName$.set('sample.html');
    isLoading$.set(true);

    try {
      const response = await fetch('./src/store/sample.html');
      if (!response.ok) throw new Error('Failed to load sample file');

      const buffer = await response.arrayBuffer();
      this._decodeBuffer(buffer);
    } catch (error) {
      console.error('Error loading sample data:', error);
      isLoading$.set(false);
    }
  }

  /**
   * Final step of the file ingestion pipeline. Parses the HTML text and populates the store.
   * @param content The decoded HTML string.
   */
  private _processFileContent(content: string) {
    const rows = parseErwinHtml(content);
    rawData$.set(rows);
    initializeVisibility();
    isLoading$.set(false);
  }
}
