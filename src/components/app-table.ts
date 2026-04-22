import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { translate } from 'lit-translate';
import icons from '../icons';
import '@lit-labs/virtualizer';
import {
  checkedIds$,
  filteredData$,
  hiddenSubObjectsIds$,
  isFlipped$,
  isLongNamingConvention$,
  onlyEntities$,
  onlyEntitiesAndAttributes$,
  showProperties$,
  toggleCheck,
  toggledPropertiesIds$,
  togglePropertiesIndividual,
  toggleSubObjects,
} from '../store/data.store.js';
import type { EnrichedDiffRow } from '../types.js';
import tableStyles from './app-table.css?inline';

/**
 * Main data grid component for displaying Erwin differences.
 * Uses @lit-labs/virtualizer for high-performance rendering of massive datasets.
 */
@customElement('app-table')
export class AppTable extends LitElement {
  static styles = unsafeCSS(tableStyles);
  private data = new StoreController(this, filteredData$);
  private checked = new StoreController(this, checkedIds$);
  private isFlipped = new StoreController(this, isFlipped$);
  private onlyEnt = new StoreController(this, onlyEntities$);
  private onlyEntAtr = new StoreController(this, onlyEntitiesAndAttributes$);
  private isLongNamingConvention = new StoreController(this, isLongNamingConvention$);
  private showProps = new StoreController(this, showProperties$);
  private toggledProps = new StoreController(this, toggledPropertiesIds$);
  private hiddenSubs = new StoreController(this, hiddenSubObjectsIds$);

  @state() private copiedId: string | null = null;
  @state() private copiedSide: 'left' | 'right' | null = null;

  render() {
    const visibleRows = this.data.value;
    const flipped = this.isFlipped.value;
    const checkedSet = this.checked.value;

    if (visibleRows.length === 0) {
      return this._renderEmptyState();
    }

    return html`
      <div class="virtual-table">
        <div class="table-header">
          <div class="col-check">${icons['square-check']}</div>
          <div class="col-type">${translate('table.col_type')}</div>
          <div class="col-left">${flipped ? translate('table.col_right') : translate('table.col_left')}</div>
          <div class="col-right">${flipped ? translate('table.col_left') : translate('table.col_right')}</div>
          <div class="col-prop">${translate('table.col_prop')}</div>
          <div class="col-change">${translate('table.col_change')}</div>
          <div class="col-view">${translate('table.col_view')}</div>
          <div class="col-cal">Cal</div>
        </div>
        
        <lit-virtualizer
          class="table-body"
          .items=${visibleRows}
          .renderItem=${(row: EnrichedDiffRow) => this._renderRow(row, flipped, checkedSet)}
        ></lit-virtualizer>
      </div>
    `;
  }

  private _renderEmptyState() {
    return html`
      <div class="empty-container">
        <div class="callout">
          <span class="callout-icon">${icons['clipboard-list']}</span>
          ${translate('table.empty')}
        </div>
      </div>
    `;
  }

  private _renderRow(row: EnrichedDiffRow, flipped: boolean, checkedSet: Set<string>) {
    const isIdentificationRow = row.isHeader && !row.isGrouping;
    const isNameProp = row.type === 'Physical Name' || row.type === 'Name';
    const showCopy = isIdentificationRow || isNameProp;
    const isChecked = checkedSet.has(row.id);

    const leftVal = flipped ? row.right : row.left;
    const rightVal = flipped ? row.left : row.right;

    let change = row.change;
    if (flipped) {
      if (change === 'I') change = 'E';
      else if (change === 'E') change = 'I';
    }

    return html`
      <div 
        class="table-row ${isChecked ? 'checked-row' : ''} ${isIdentificationRow ? 'clickable-row' : ''}"
        data-change="${change}" 
        data-level="${row.level}"
        data-prop="${row.prop}"
        data-header="${row.isHeader || false}"
        data-grouping="${row.isGrouping || false}"
        data-calculated="${row.isCalculated || false}"
        data-udp="${row.isUDP || false}"
        @click=${() => isIdentificationRow && row.hasProperties && togglePropertiesIndividual(row.id)}
        @contextmenu=${(e: MouseEvent) => {
          if (isIdentificationRow && row.hasSubObjects) {
            e.preventDefault();
            toggleSubObjects(row.id);
          }
        }}
      >
        <div class="col-check" @click=${(e: Event) => e.stopPropagation()}>
           <input type="checkbox" .checked=${isChecked} @change=${() => toggleCheck(row.id)} />
        </div>
        <div class="col-type">
          <div class="tree-node">
            <div class="indent-dots">
              ${Array.from({ length: row.level }).map(() => html`<span class="dot">·</span>`)}
            </div>
            <span class="type-text" title="${row.type}">${row.type}</span>
            ${this._renderAttributeCounter(row)}
            <div class="row-indicators">
              ${this._renderIndicators(row)}
            </div>
          </div>
        </div>
        <div class="col-left">${this._renderValueCell(row, leftVal, 'left', showCopy)}</div>
        <div class="col-right">${this._renderValueCell(row, rightVal, 'right', showCopy)}</div>
        <div class="col-prop">${row.prop}</div>
        <div class="col-change">${isIdentificationRow ? change : ''}</div>
        <div class="col-view">${isIdentificationRow ? row.view : ''}</div>
        <div class="col-cal">${row.isCalculated ? 'C' : ''}</div>
      </div>
    `;
  }

  private _renderIndicators(row: EnrichedDiffRow) {
    if (!row.isHeader) return html``;

    const arePropsHidden = this._arePropertiesHidden(row);
    const areSubsHidden = this._areSubObjectsHidden(row);

    return html`
      ${
        row.hasProperties
          ? html`
        <span class="icon-indicator prop-indicator ${!arePropsHidden ? 'expanded' : ''}">
          ${icons['chevron-down']}
        </span>
      `
          : ''
      }
      ${
        row.hasSubObjects
          ? html`
        <span class="icon-indicator sub-indicator">
          ${areSubsHidden ? icons['schema-off'] : icons.schema}
        </span>
      `
          : ''
      }
    `;
  }

  private _renderValueCell(
    row: EnrichedDiffRow,
    value: string,
    side: 'left' | 'right',
    showCopy: boolean,
  ) {
    return html`
      <div class="content-wrapper">
        <span class="value-text">${unsafeHTML(value)}</span>
        <div class="row-actions">
          ${this._renderLenCounter(row, value)}
          ${
            showCopy && value
              ? html`
            <button 
              class="btn btn-default btn-xs copy-btn ${this.copiedId === row.id && this.copiedSide === side ? 'copy-success' : ''}" 
              title="${translate(`table.copy_${side}`)}" 
              @click=${(e: MouseEvent) => {
                e.stopPropagation();
                this._handleCopy(row.id, value, side);
              }}
            >${this.copiedId === row.id && this.copiedSide === side ? icons.check : icons.copy}</button>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  private _renderAttributeCounter(row: EnrichedDiffRow) {
    if (!(row.prop === 'Ent' && row.isHeader)) return '';
    return html`<span class="attr-badge">${row.attributeCount ?? '?'}</span>`;
  }

  private _renderLenCounter(row: EnrichedDiffRow, value: string) {
    const isPhysicalName = row.type === 'Physical Name';
    const isIdentificationRow =
      row.isHeader && !row.isGrouping && (row.prop === 'Ent' || row.prop === 'Atr');
    if (!(isPhysicalName || isIdentificationRow) || !value) return '';

    const getLen = (val: string) => {
      let clean = val
        .trim()
        .replace(/\s*\[Calculated\]$/, '')
        .replace(/\s*\(FK\)$/, '');
      if (clean.includes('.')) clean = clean.split('.').pop() || clean;
      return clean.length;
    };

    const len = getLen(value);
    if (len === 0) return '';

    const threshold = this.isLongNamingConvention.value ? 50 : 18;
    return html`<span class="len-badge ${len > threshold ? 'len-warn' : 'len-ok'}">${len}</span>`;
  }

  private _areSubObjectsHidden(row: EnrichedDiffRow): boolean {
    let isHidden = this.hiddenSubs.value.has(row.id);
    if (this.onlyEnt.value && row.prop === 'Ent' && row.hasSubObjects) isHidden = !isHidden;
    if (this.onlyEntAtr.value && (row.prop === 'Ent' || row.prop === 'Atr') && row.hasSubObjects)
      isHidden = !isHidden;
    return isHidden;
  }

  private _arePropertiesHidden(row: EnrichedDiffRow): boolean {
    const isParentToggled = this.toggledProps.value.has(row.id);
    return this.showProps.value ? isParentToggled : !isParentToggled;
  }

  private _handleCopy(id: string, text: string, side: 'left' | 'right') {
    let cleanText = text.includes('.') ? text.split('.')[1].trim() : text.trim();
    cleanText = cleanText.replace('(FK)', '').replace('[Calculated]', '').trim();
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
