import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StoreController } from '@nanostores/lit';
import { isLoading$, rawData$, filteredData$ } from './store/data.store';

// Import Global CSS and Web Awesome
import './index.css';
import '@webawesome/webawesome/dist/webawesome.js';
import '@webawesome/webawesome/dist/themes/default.css';

// Importing icons and assets
import { icons } from './assets/icons';
import { registerIconLibrary } from '@webawesome/webawesome/dist/utilities/icon-library.js';

// Registering Tabler icons
registerIconLibrary('tabler', {
  resolver: name => {
    if (icons[name as keyof typeof icons]) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(icons[name as keyof typeof icons])}`;
    }
    return '';
  }
});

// Setting Tabler as the default library
document.documentElement.setAttribute('data-wa-icon-library', 'tabler');

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
      background: rgba(var(--wa-color-surface-overlay-rgb), 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
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
            <wa-spinner style="font-size: 3rem;"></wa-spinner>
          </div>
        ` : ''}
      </div>
    `;
  }
}
