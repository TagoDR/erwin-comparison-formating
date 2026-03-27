import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StoreController } from '@nanostores/lit';
import { isLoading$ } from '../store/data.store';

@customElement('app-header')
export class AppHeader extends LitElement {
  private isLoading = new StoreController(this, isLoading$);

  static styles = css`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--wa-color-surface-default);
      border-bottom: 1px solid var(--wa-color-surface-border);
      padding: var(--wa-space-s) var(--wa-space-m);
    }

    .header-container {
      display: flex;
      align-items: center;
      gap: var(--wa-space-m);
    }

    .title {
      font-size: var(--wa-font-size-m);
      font-weight: var(--wa-font-weight-bold);
      margin-right: auto;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: var(--wa-space-s);
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
      <div class="header-container">
        <div class="title">Erwin Compare Formatter</div>
        
        <div class="controls">
          <wa-input 
            type="file" 
            label="Selecione o arquivo HTML do Erwin"
            @change=${this._handleFileChange}
            ?disabled=${this.isLoading.value}
            size="small"
          ></wa-input>

          <wa-select label="Tipo de Mudança" size="small" multiple clearable>
            <wa-option value="I">Inclusão (I)</wa-option>
            <wa-option value="A">Alteração (A)</wa-option>
            <wa-option value="E">Exclusão (E)</wa-option>
          </wa-select>

          <wa-select label="Tipo de Objeto" size="small" clearable>
            <wa-option value="table">Tabela</wa-option>
            <wa-option value="others">Outros</wa-option>
          </wa-select>
        </div>
      </div>
    `;
  }
}
