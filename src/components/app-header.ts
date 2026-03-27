import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StoreController } from '@nanostores/lit';
import { isLoading$ } from '../store/data.store';

@customElement('app-header')
export class AppHeader extends LitElement {
  private isLoading = new StoreController(this, isLoading$);

  // We rely on PureCSS's base styles via the main index.css
  static styles = css`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 100;
      background: #1e293b;
      border-bottom: 1px solid #334155;
      padding: 0.75rem 1.5rem;
    }

    .header-layout {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .brand {
      font-size: 1.25rem;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.025em;
    }

    .pure-form {
      display: flex;
      gap: 1.5rem;
      align-items: flex-end;
    }

    .pure-form-stacked {
      margin-bottom: 0 !important;
    }

    input[type="file"] {
      padding: 0.3rem 0.6rem !important;
      min-width: 250px;
    }

    select {
      min-width: 150px;
    }

    label {
      font-size: 0.75rem !important;
      text-transform: uppercase;
      font-weight: 600;
      color: #94a3b8;
    }
  `;

  private async _handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    isLoading$.set(true);
    
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      this.dispatchEvent(new CustomEvent('file-loaded', {
        detail: { content },
        bubbles: true,
        composed: true
      }));
    };
    
    reader.readAsText(file);
  }

  render() {
    return html`
      <div class="header-layout">
        <div class="brand">Erwin Formatter</div>
        
        <form class="pure-form pure-form-stacked">
          <div class="pure-control-group">
            <label for="erwin-file">Arquivo Erwin</label>
            <input 
              id="erwin-file"
              type="file" 
              class="pure-input-1"
              @change=${this._handleFileChange}
              ?disabled=${this.isLoading.value}
            />
          </div>

          <div class="pure-control-group">
            <label for="change-type">Mudança</label>
            <select id="change-type">
              <option value="">Todas</option>
              <option value="I">Inclusão (I)</option>
              <option value="A">Alteração (A)</option>
              <option value="E">Exclusão (E)</option>
            </select>
          </div>

          <div class="pure-control-group">
            <label for="obj-type">Objeto</label>
            <select id="obj-type">
              <option value="">Todos</option>
              <option value="table">Tabela</option>
              <option value="others">Outros</option>
            </select>
          </div>
        </form>
      </div>
    `;
  }
}
