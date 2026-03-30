import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { icons } from '../assets/icons';
import {
  checkedIds$,
  collapsedIds$,
  filteredData$,
  toggleCheck,
  toggleCollapse,
} from '../store/data.store';
import tableStyles from './app-table.css?inline';

@customElement('app-table')
export class AppTable extends LitElement {
  private data = new StoreController(this, filteredData$);
  private collapsed = new StoreController(this, collapsedIds$);
  private checked = new StoreController(this, checkedIds$);

  static styles = unsafeCSS(tableStyles);

  private _copyToClipboard(text: string) {
    const cleanText = text.includes(':') ? text.split(':')[1].trim() : text.trim();
    navigator.clipboard.writeText(cleanText).then(() => {
      console.log('Copied:', cleanText);
    });
  }

  render() {
    if (this.data.value.length === 0) {
      return html`
        <div class="callout">
          <span class="callout-icon">${icons['clipboard-list']}</span>
          Selecione o arquivo HTML gerado pelo Erwin Modeler para análise comparativa.
        </div>
      `;
    }

    const collapsedSet = this.collapsed.value;
    const checkedSet = this.checked.value;

    // Recursive hidden check: if any ancestor is collapsed, hide row
    const allRows = this.data.value;

    // Map id to row for fast lookup
    const rowMap = new Map(allRows.map(r => [r.id, r]));

    const isAncestorCollapsed = (rowId: string | undefined): boolean => {
      if (!rowId) return false;
      const row = rowMap.get(rowId);
      if (!row) return false;
      if (collapsedSet.has(rowId)) return true;
      return isAncestorCollapsed(row.parentId);
    };

    return html`
      <table class="table table-condensed table-hover table-container">
        <thead>
          <tr>
            <th class="col-check">${icons['square-check']}</th>
            <th>Tipo / Objeto</th>
            <th>Modelo Trabalhando (Left)</th>
            <th>Modelo Referência (Right)</th>
            <th>Prop</th>
            <th>Alt</th>
            <th>Vis</th>
          </tr>
        </thead>
        <tbody>
          ${allRows.map(row => {
            // Requirement 5: Check if any ancestor is collapsed
            if (isAncestorCollapsed(row.parentId)) return html``;

            const isNameRow = row.type.toLowerCase().includes('name') || row.isHeader;
            const level = row.indent;
            const isCollapsed = row.id ? collapsedSet.has(row.id) : false;
            const isChecked = row.id ? checkedSet.has(row.id) : false;

            return html`
              <tr 
                data-change="${row.change}" 
                data-level="${level}"
                data-prop="${row.prop}"
                data-header="${row.isHeader || false}"
                data-grouping="${row.isGrouping || false}"
                class="${isChecked ? 'checked-row' : ''}"
              >
                <td class="col-check">
                   <input 
                    type="checkbox" 
                    .checked=${isChecked}
                    @change=${() => row.id && toggleCheck(row.id)}
                   />
                </td>
                <td class="row-type">
                  <div class="tree-node" style="padding-left: ${level * 20}px">
                    ${
                      row.isHeader
                        ? html`
                          <span 
                            class="tree-toggle ${isCollapsed ? 'collapsed' : ''}" 
                            @click=${() => row.id && toggleCollapse(row.id)}
                          ></span>
                        `
                        : html`<span class="tree-leaf-connector"></span>`
                    }
                    <span class="type-text">${row.type}</span>
                    ${
                      isNameRow
                        ? html`
                      <button 
                        class="btn btn-default btn-xs copy-btn" 
                        title="Copiar nome" 
                        @click=${() => this._copyToClipboard(row.type)}
                      >${icons.copy}</button>
                    `
                        : ''
                    }
                  </div>
                </td>
                <td class="row-left">${row.leftModel}</td>
                <td class="row-right">${row.rightModel}</td>
                <td class="row-prop">${row.prop}</td>
                <td class="row-change">${row.change}</td>
                <td class="row-view">${row.view}</td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }
}
