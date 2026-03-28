import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StoreController } from '@nanostores/lit';
import { isLoading$, rawData$, filteredData$, fileName$ } from './store/data.store';

// Import Global CSS
import './index.css';
import mainStyles from './main.css?inline';

// Importing components
import './components/app-header';
import './components/app-stats';
import './components/app-table';

@customElement('app-root')
export class AppRoot extends LitElement {
  private isLoading = new StoreController(this, isLoading$);
  private fileName = new StoreController(this, fileName$);

  static styles = unsafeCSS(mainStyles);

  private _onFileLoaded(e: CustomEvent<{ content: string }>) {
    const { content } = e.detail;
    console.log('File content loaded, starting parser...', content.substring(0, 100));
    
    // Parser Simulation (Real parser will replace this)
    setTimeout(() => {
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
    }, 1500); // Extended delay for visualization
  }

  render() {
    const showData = !!this.fileName.value && !this.isLoading.value;

    return html`
      <div class="main-content" @file-loaded=${this._onFileLoaded}>
        <app-header></app-header>
        
        <div class="display-area">
          ${showData ? html`
            <app-stats></app-stats>
            <app-table></app-table>
          ` : ''}

          ${!this.fileName.value && !this.isLoading.value ? html`
            <div class="empty-state">
              <span class="empty-icon">📂</span>
              <span>Nenhum arquivo carregado. Use a área superior para iniciar.</span>
            </div>
          ` : ''}
        </div>
        
        ${this.isLoading.value ? html`
          <div class="loading-overlay">
            <div class="spinner"></div>
            <span class="loading-text">Processando arquivo Erwin...</span>
          </div>
        ` : ''}
      </div>
    `;
  }
}
