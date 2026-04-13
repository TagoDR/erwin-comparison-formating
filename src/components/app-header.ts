import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { translate } from 'lit-translate';
import { icons } from '../assets/icons';
import { fileName$, filterName$, isUserscript$, rawData$ } from '../store/data.store';
import { changeLanguage, language$ } from '../store/i18n.store';
import { theme$, toggleTheme } from '../store/theme.store';
import headerStyles from './app-header.css?inline';

@customElement('app-header')
export class AppHeader extends LitElement {
  static styles = unsafeCSS(headerStyles);
  private fileName = new StoreController(this, fileName$);
  private theme = new StoreController(this, theme$);
  private language = new StoreController(this, language$);
  private isUserscript = new StoreController(this, isUserscript$);
  @state() private isDragging = false;

  render() {
    const isMonkey = this.isUserscript.value;

    return html`
      <div class="header-layout">
        <div class="brand">${translate('header.title')}</div>
        ${isMonkey ? html`<div class="file-info">${this.fileName.value}</div>` : ''}

        ${
          !isMonkey
            ? html`
          ${
            this.fileName.value
              ? html`
            <div class="file-info">
              <span class="file-name">${this.fileName.value}</span>
              <button class="btn btn-danger btn-xs close-btn" @click=${this._closeFile}>
                 ${icons.x} <span>${translate('header.close')}</span>
              </button>
            </div>
          `
              : html`
            <div 
              class="file-drop-zone ${this.isDragging ? 'dragging' : ''}"
              @drop=${this._onDrop}
              @dragover=${this._onDragOver}
              @dragleave=${this._onDragLeave}
            >
              <span class="icon">${icons['file-diff']}</span>
              <span>${translate('header.upload')}</span>
              <input type="file" @change=${(e: Event) => this._handleFile((e.target as HTMLInputElement).files?.[0] as File)} />
            </div>
          `
          }
        `
            : ''
        }

        <div class="header-controls">
          <select class="lang-select" .value=${this.language.value} @change=${this._onLanguageChange}>
            <option value="pt-BR">PT</option>
            <option value="en-US">EN</option>
            <option value="fr-FR">FR</option>
            <option value="es-ES">ES</option>
          </select>

          <button class="theme-toggle" @click=${toggleTheme} title="Change Theme">
            ${this.theme.value === 'dark' ? icons.sun : icons.moon}
          </button>
          
          <div class="version-tag">v5</div>
        </div>
      </div>
    `;
  }

  private _handleFile(file: File) {
    if (!file) return;

    this.dispatchEvent(
      new CustomEvent('file-selected', {
        detail: { file },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    const file = e.dataTransfer?.files[0];
    if (file) this._handleFile(file);
  }

  private _onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging = true;
  }

  private _onDragLeave() {
    this.isDragging = false;
  }

  private _closeFile() {
    fileName$.set(null);
    rawData$.set([]);
    filterName$.set('');
  }

  private _onLanguageChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    changeLanguage(val);
  }
}
