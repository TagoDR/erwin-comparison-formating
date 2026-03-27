import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StoreController } from '@nanostores/lit';
import { isLoading$, rawData$, filteredData$ } from './store/data.store';

// Import Global CSS
import './index.css';

// Importing components
import './components/app-header';
import './components/app-table';

@customElement('app-root')
export class AppRoot extends LitElement {
  private isLoading = new StoreController(this, isLoading$);

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #0f172a;
    }

    .main-content {
      position: relative;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      color: #f8fafc;
      gap: 1rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #334155;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  private _onFileLoaded(e: CustomEvent<{ content: string }>) {
    const { content } = e.detail;
    console.log('File content loaded, starting parser...', content.substring(0, 100));
    
    // Parser Logic will be implemented next
    const mockData = [
      { type: 'TABLE: CUSTOMER', prop: 'CUSTOMER', change: 'A', view: 'L/P', leftModel: 'Active', rightModel: 'Active', indent: 0, isHeader: true },
      { type: '  Attribute: Name', prop: 'CUSTOMER', change: 'A', view: '', leftModel: 'VARCHAR(100)', rightModel: 'VARCHAR(50)', indent: 2 },
      { type: 'TABLE: ORDERS', prop: 'ORDERS', change: 'I', view: 'L', leftModel: 'Created', rightModel: '', indent: 0, isHeader: true },
      { type: '  Attribute: OrderID', prop: 'ORDERS', change: 'I', view: '', leftModel: 'INT', rightModel: '', indent: 2 },
      { type: 'TABLE: LOGS', prop: 'LOGS', change: 'E', view: 'P', leftModel: '', rightModel: 'Dropped', indent: 0, isHeader: true },
    ] as any;
    
    rawData$.set(mockData);
    filteredData$.set(mockData);
    isLoading$.set(false);
  }

  render() {
    return html`
      <div class="main-content" @file-loaded=${this._onFileLoaded}>
        <app-header></app-header>
        <app-table></app-table>
        
        ${this.isLoading.value ? html`
          <div class="loading-overlay">
            <div class="spinner"></div>
            <span>Processando arquivo...</span>
          </div>
        ` : ''}
      </div>
    `;
  }
}
