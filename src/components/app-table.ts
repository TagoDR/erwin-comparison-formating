import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { translate } from 'lit-translate';
import { icons } from '../assets/icons';
import {
  checkedIds$,
  filteredData$,
  hiddenSubObjectsIds$,
  showProperties$,
  toggleCheck,
  toggledPropertiesIds$,
  togglePropertiesIndividual,
  toggleSubObjects,
} from '../store/data.store';
import tableStyles from './app-table.css?inline';

@customElement('app-table')
export class AppTable extends LitElement {
  private data = new StoreController(this, filteredData$);
  private showProps = new StoreController(this, showProperties$);
  private toggledProps = new StoreController(this, toggledPropertiesIds$);
  private hiddenSubs = new StoreController(this, hiddenSubObjectsIds$);
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
          ${translate('table.empty')}
        </div>
      `;
    }

    const globalShowProps = this.showProps.value;
    const toggledPropsSet = this.toggledProps.value;
    const hiddenSubsSet = this.hiddenSubs.value;
    const checkedSet = this.checked.value;

    const allRows = this.data.value;
    const rowMap = new Map(allRows.map(r => [r.id, r]));

    const isRowHidden = (rowId: string | undefined): boolean => {
      if (!rowId) return false;
      const row = rowMap.get(rowId);
      if (!row) return false;

      // Recursive check: if parent is hidden, child is hidden
      if (row.parentId) {
        const parent = rowMap.get(row.parentId);
        if (parent) {
          // Property Visibility: XOR of global state and individual toggle
          if (!row.isHeader) {
            const isParentToggled = toggledPropsSet.has(row.parentId);
            const isVisible = globalShowProps ? !isParentToggled : isParentToggled;
            if (!isVisible) return true;
          }

          // Sub-object Visibility: Explicitly hidden via right click
          if (row.isHeader && hiddenSubsSet.has(row.parentId)) return true;

          // Ancestor check
          if (isRowHidden(row.parentId)) return true;
        }
      }

      return false;
    };

    return html`
      <table class="table table-condensed table-hover table-container">
        <thead>
          <tr>
            <th class="col-check">${icons['square-check']}</th>
            <th>${translate('table.col_type')}</th>
            <th>${translate('table.col_left')}</th>
            <th>${translate('table.col_right')}</th>
            <th>${translate('table.col_prop')}</th>
            <th>${translate('table.col_change')}</th>
            <th>${translate('table.col_view')}</th>
          </tr>
        </thead>
        <tbody>
          ${allRows.map(row => {
            if (isRowHidden(row.id)) return html``;

            const isIdentificationRow = row.isHeader && !row.isGrouping;
            const isNameProp = row.type === 'Name' || row.type === 'Physical Name';
            const showCopy = isIdentificationRow || isNameProp;

            const level = row.indent;
            const isChecked = row.id ? checkedSet.has(row.id) : false;

            return html`
              <tr 
                data-change="${row.change}" 
                data-level="${level}"
                data-prop="${row.prop}"
                data-header="${row.isHeader || false}"
                data-grouping="${row.isGrouping || false}"
                class="${isChecked ? 'checked-row' : ''} ${isIdentificationRow ? 'clickable-row' : ''}"
                @click=${() => {
                  if (isIdentificationRow && row.id) {
                    togglePropertiesIndividual(row.id);
                  }
                }}
                @contextmenu=${(e: MouseEvent) => {
                  if (isIdentificationRow && row.id) {
                    e.preventDefault();
                    toggleSubObjects(row.id);
                  }
                }}
              >
                <td class="col-check" @click=${(e: Event) => e.stopPropagation()}>
                   <input 
                    type="checkbox" 
                    .checked=${isChecked}
                    @change=${() => row.id && toggleCheck(row.id)}
                   />
                </td>
                <td class="row-type">
                  <div class="tree-node" style="padding-left: ${level * 3}px">
                    <span class="type-text">${row.type}</span>
                  </div>
                </td>
                <td class="row-left">
                  ${row.leftModel}
                  ${
                    showCopy && row.leftModel
                      ? html`
                    <button 
                      class="btn btn-default btn-xs copy-btn" 
                      title="${translate('table.copy_left')}" 
                      @click=${(e: MouseEvent) => {
                        e.stopPropagation();
                        this._copyToClipboard(row.leftModel);
                      }}
                    >${icons.copy}</button>
                  `
                      : ''
                  }
                </td>
                <td class="row-right">
                  ${row.rightModel}
                  ${
                    showCopy && row.rightModel
                      ? html`
                    <button 
                      class="btn btn-default btn-xs copy-btn" 
                      title="${translate('table.copy_right')}" 
                      @click=${(e: MouseEvent) => {
                        e.stopPropagation();
                        this._copyToClipboard(row.rightModel);
                      }}
                    >${icons.copy}</button>
                  `
                      : ''
                  }
                </td>
                <td class="row-prop">${row.prop}</td>
                <td class="row-change">${isIdentificationRow ? row.change : ''}</td>
                <td class="row-view">${isIdentificationRow ? row.view : ''}</td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }
}
