import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { translate } from 'lit-translate';
import { icons } from '../assets/icons';
import {
  checkedIds$,
  filteredData$,
  hiddenSubObjectsIds$,
  isFlipped$,
  showProperties$,
  toggleCheck,
  toggledPropertiesIds$,
  togglePropertiesIndividual,
  toggleSubObjects,
} from '../store/data.store';
import tableStyles from './app-table.css?inline';

@customElement('app-table')
export class AppTable extends LitElement {
  static styles = unsafeCSS(tableStyles);
  private data = new StoreController(this, filteredData$);
  private showProps = new StoreController(this, showProperties$);
  private toggledProps = new StoreController(this, toggledPropertiesIds$);
  private hiddenSubs = new StoreController(this, hiddenSubObjectsIds$);
  private checked = new StoreController(this, checkedIds$);
  private isFlipped = new StoreController(this, isFlipped$);

  @state() private copiedId: string | null = null;
  @state() private copiedSide: 'left' | 'right' | null = null;

  render() {
    const globalShowProps = this.showProps.value;
    const toggledPropsSet = this.toggledProps.value;
    const hiddenSubsSet = this.hiddenSubs.value;
    const checkedSet = this.checked.value;
    const flipped = this.isFlipped.value;

    const allRows = this.data.value;
    const rowMap = new Map(allRows.map(r => [r.id!, r]));

    const isRowHidden = (rowId: string | undefined): boolean => {
      if (!rowId) return false;
      const row = rowMap.get(rowId);
      if (!row) return false;

      if (row.parentId) {
        const parent = rowMap.get(row.parentId);
        if (parent) {
          if (!row.isHeader) {
            const isParentToggled = toggledPropsSet.has(row.parentId);
            const isVisible = globalShowProps ? !isParentToggled : isParentToggled;
            if (!isVisible) return true;
          }
          if (row.isHeader && hiddenSubsSet.has(row.parentId)) return true;
          if (isRowHidden(row.parentId)) return true;
        }
      }
      return false;
    };

    const visibleRows = allRows.filter(row => !isRowHidden(row.id));

    return html`
      <table class="table table-condensed table-hover table-container">
        <thead>
          <tr>
            <th class="col-check">${icons['square-check']}</th>
            <th class="col-type">${translate('table.col_type')}</th>
            <th class="col-left">${flipped ? translate('table.col_right') : translate('table.col_left')}</th>
            <th class="col-right">${flipped ? translate('table.col_left') : translate('table.col_right')}</th>
            <th class="col-prop">${translate('table.col_prop')}</th>
            <th class="col-change">${translate('table.col_change')}</th>
            <th class="col-view">${translate('table.col_view')}</th>
            <th class="col-cal">Cal</th>
          </tr>
        </thead>
        <tbody>
          ${
            visibleRows.length === 0
              ? html`
            <tr>
              <td colspan="8" class="text-center empty-cell">
                <div class="callout">
                  <span class="callout-icon">${icons['clipboard-list']}</span>
                  ${translate('table.empty')}
                </div>
              </td>
            </tr>
          `
              : visibleRows.map(row => {
                  const isIdentificationRow = row.isHeader && !row.isGrouping;
                  const isNameProp = row.type.toLowerCase().includes('name');
                  const showCopy = isIdentificationRow || isNameProp;

                  const level = row.indent;
                  const isChecked = row.id ? checkedSet.has(row.id) : false;

                  const leftVal = flipped ? row.rightModel : row.leftModel;
                  const rightVal = flipped ? row.leftModel : row.rightModel;

                  let change = row.change;
                  if (flipped) {
                    if (change === 'I') change = 'E';
                    else if (change === 'E') change = 'I';
                  }

                  return html`
              <tr 
                data-change="${change}" 
                data-level="${level}"
                data-prop="${row.prop}"
                data-header="${row.isHeader || false}"
                data-grouping="${row.isGrouping || false}"
                data-calculated="${row.isCalculated || false}"
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
                    ${this._renderAttributeCounter(row)}
                  </div>
                </td>
                <td class="row-left">
                  <div class="content-wrapper">
                    <span class="value-text">${leftVal}</span>
                    <div class="row-actions">
                      ${this._renderLenCounter(row.type, leftVal)}
                      ${
                        showCopy && leftVal
                          ? html`
                        <button 
                          class="btn btn-default btn-xs copy-btn ${this.copiedId === row.id && this.copiedSide === 'left' ? 'copy-success' : ''}" 
                          title="${translate('table.copy_left')}" 
                          @click=${(e: MouseEvent) => {
                            e.stopPropagation();
                            this._handleCopy(row.id!, leftVal, 'left');
                          }}
                        >${this.copiedId === row.id && this.copiedSide === 'left' ? icons.check : icons.copy}</button>
                      `
                          : ''
                      }
                    </div>
                  </div>
                </td>
                <td class="row-right">
                  <div class="content-wrapper">
                    <span class="value-text">${rightVal}</span>
                    <div class="row-actions">
                      ${this._renderLenCounter(row.type, rightVal)}
                      ${
                        showCopy && rightVal
                          ? html`
                        <button 
                          class="btn btn-default btn-xs copy-btn ${this.copiedId === row.id && this.copiedSide === 'right' ? 'copy-success' : ''}" 
                          title="${translate('table.copy_right')}" 
                          @click=${(e: MouseEvent) => {
                            e.stopPropagation();
                            this._handleCopy(row.id!, rightVal, 'right');
                          }}
                        >${this.copiedId === row.id && this.copiedSide === 'right' ? icons.check : icons.copy}</button>
                      `
                          : ''
                      }
                    </div>
                  </div>
                </td>
                <td class="row-prop">${row.prop}</td>
                <td class="row-change">${isIdentificationRow ? change : ''}</td>
                <td class="row-view">${isIdentificationRow ? row.view : ''}</td>
                <td class="row-cal">${row.isCalculated ? 'C' : ''}</td>
              </tr>
            `;
                })
          }
        </tbody>
      </table>
    `;
  }

  private _renderAttributeCounter(row: any) {
    const isEntity = row.prop === 'Ent' && row.isHeader;
    if (!isEntity) return '';

    const count = row.attributeCount;
    const display = count !== undefined ? count : '?';

    return html`<span class="attr-badge">${display}</span>`;
  }

  private _renderLenCounter(type: string, value: string) {
    if (!type.toLowerCase().includes('name') || !value) return '';

    const getLen = (val: string) => {
      const clean = val.includes(':') ? val.split(':')[1].trim() : val.trim();
      return clean.length;
    };

    const len = getLen(value);
    if (len === 0) return '';

    const isWarn = len > 18;
    return html`<span class="len-badge ${isWarn ? 'len-warn' : 'len-ok'}">${len}</span>`;
  }

  private _handleCopy(id: string, text: string, side: 'left' | 'right') {
    const cleanText = text.includes(':') ? text.split(':')[1].trim() : text.trim();
    navigator.clipboard.writeText(cleanText).then(() => {
      this.copiedId = id;
      this.copiedSide = side;
      setTimeout(() => {
        this.copiedId = null;
        this.copiedSide = null;
      }, 2000);
    });
  }
}
