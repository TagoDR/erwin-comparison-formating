import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { translate } from 'lit-translate';
import icons from '../icons';
import {
  checkedIds$,
  filteredData$,
  hiddenSubObjectsIds$,
  isFlipped$,
  onlyEntities$,
  onlyEntitiesAndAttributes$,
  showProperties$,
  toggleCheck,
  toggledPropertiesIds$,
  togglePropertiesIndividual,
  toggleSubObjects,
} from '../store/data.store.js';
import type { EnrichedDiffRow } from '../types.ts';
import tableStyles from './app-table.css?inline';

/**
 * Main data grid component for displaying Erwin differences.
 * Implements complex visibility logic for properties and sub-objects,
 * hierarchical indentation guides, and interactive action buttons (copy, check).
 */
@customElement('app-table')
export class AppTable extends LitElement {
  static styles = unsafeCSS(tableStyles);
  private data = new StoreController(this, filteredData$);
  private showProps = new StoreController(this, showProperties$);
  private toggledProps = new StoreController(this, toggledPropertiesIds$);
  private hiddenSubs = new StoreController(this, hiddenSubObjectsIds$);
  private checked = new StoreController(this, checkedIds$);
  private isFlipped = new StoreController(this, isFlipped$);
  private onlyEnt = new StoreController(this, onlyEntities$);
  private onlyEntAtr = new StoreController(this, onlyEntitiesAndAttributes$);

  @state() private copiedId: string | null = null;
  @state() private copiedSide: 'left' | 'right' | null = null;

  render() {
    const globalShowProps = this.showProps.value;
    const toggledPropsSet = this.toggledProps.value;
    const hiddenSubsSet = this.hiddenSubs.value;
    const checkedSet = this.checked.value;
    const flipped = this.isFlipped.value;
    const onlyEntities = this.onlyEnt.value;
    const onlyEntitiesAndAttributes = this.onlyEntAtr.value;

    const allRows = this.data.value;
    const rowMap = new Map(allRows.map(r => [r.id, r]));

    /**
     * Determines if a row should be hidden based on global toggles, individual toggles,
     * and the hierarchical state of its ancestors.
     */
    const isRowHidden = (rowId: string | undefined): boolean => {
      if (!rowId) return false;
      const row = rowMap.get(rowId);
      if (!row) return false;

      if (row.parentId) {
        const parent = rowMap.get(row.parentId);
        if (parent) {
          // 1. Property Visibility (Left Click interaction on parent)
          if (!row.isHeader) {
            const isParentToggled = toggledPropsSet.has(row.parentId);
            const isVisible = globalShowProps ? !isParentToggled : isParentToggled;
            if (!isVisible) return true;
          }

          // 2. Sub-Object Visibility (Right Click interaction on parent)
          if (row.isHeader) {
            let isHidden = hiddenSubsSet.has(row.parentId);

            // SPECIAL RULE: Right clicking Model does not hide its direct Entity/Attribute children
            if (isHidden && parent.type === 'Model' && (row.prop === 'Ent' || row.prop === 'Atr')) {
              isHidden = false;
            }

            // Default Collapse Logic for "Only X" Modes (Drill-down behavior)
            if (onlyEntities && parent.prop === 'Ent' && row.prop !== 'Ent') {
              isHidden = !isHidden;
            }
            if (onlyEntitiesAndAttributes && parent.prop === 'Atr') {
              isHidden = !isHidden;
            }

            if (isHidden) return true;
          }

          // 3. Recursive check for ancestor visibility (cascading hide)
          if (isRowHidden(row.parentId)) return true;
        }
      }
      return false;
    };

    const visibleRows = allRows.filter(row => !isRowHidden(row.id));

    /** Returns true if the sub-objects of the given header row are currently hidden. */
    const areSubObjectsHidden = (row: EnrichedDiffRow): boolean => {
      let isHidden = hiddenSubsSet.has(row.id ?? '');
      if (onlyEntities && row.prop === 'Ent' && row.hasSubObjects) {
        isHidden = !isHidden;
      }
      if (onlyEntitiesAndAttributes && row.prop === 'Atr' && row.hasSubObjects) {
        isHidden = !isHidden;
      }
      return isHidden;
    };

    /** Returns true if the properties of the given header row are currently hidden. */
    const arePropertiesHidden = (row: EnrichedDiffRow): boolean => {
      const isParentToggled = toggledPropsSet.has(row.id ?? '');
      const isVisible = globalShowProps ? !isParentToggled : isParentToggled;
      return !isVisible;
    };

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
                : repeat(
                    visibleRows,
                    row => row.id,
                    row => {
                      const isIdentificationRow = row.isHeader && !row.isGrouping;
                      const isNameProp = row.type === 'Physical Name' || row.type === 'Name';
                      const showCopy = isIdentificationRow || isNameProp;

                      const level = row.level;
                      const isChecked = row.id ? checkedSet.has(row.id) : false;

                      const leftVal = flipped ? row.right : row.left;
                      const rightVal = flipped ? row.left : row.right;

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
                  data-udp="${row.isUDP || false}"
                  class="${isChecked ? 'checked-row' : ''} ${isIdentificationRow ? 'clickable-row' : ''}"
                  @click=${() => {
                    if (isIdentificationRow && row.id && row.hasProperties) {
                      togglePropertiesIndividual(row.id);
                    }
                  }}
                  @contextmenu=${(e: MouseEvent) => {
                    if (isIdentificationRow && row.id && row.hasSubObjects) {
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
                    <div class="tree-node">
                      <div class="indent-dots">
                        ${Array.from({ length: level }).map(() => html`<span class="dot">·</span>`)}
                      </div>
                      <span class="type-text">${row.type}</span>
                      ${this._renderAttributeCounter(row)}

                      <div class="row-indicators">
                        ${
                          row.isHeader && row.hasProperties
                            ? html`
                          <span class="icon-indicator prop-indicator ${!arePropertiesHidden(row) ? 'expanded' : ''}">
                            ${icons['chevron-down']}
                          </span>
                        `
                            : ''
                        }
                        ${
                          row.isHeader && row.hasSubObjects
                            ? html`
                          <span class="icon-indicator sub-indicator">
                            ${areSubObjectsHidden(row) ? icons['schema-off'] : icons.schema}
                          </span>
                        `
                            : ''
                        }
                      </div>
                    </div>
                  </td>
                  <td class="row-left">
                  <div class="content-wrapper">
                    <span class="value-text">${leftVal}</span>
                    <div class="row-actions">
                      ${this._renderLenCounter(row, leftVal)}
                      ${
                        showCopy && leftVal
                          ? html`
                        <button 
                          class="btn btn-default btn-xs copy-btn ${this.copiedId === row.id && this.copiedSide === 'left' ? 'copy-success' : ''}" 
                          title="${translate('table.copy_left')}" 
                          @click=${(e: MouseEvent) => {
                            e.stopPropagation();
                            this._handleCopy(row.id, leftVal, 'left');
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
                      ${this._renderLenCounter(row, rightVal)}
                      ${
                        showCopy && rightVal
                          ? html`
                        <button 
                          class="btn btn-default btn-xs copy-btn ${this.copiedId === row.id && this.copiedSide === 'right' ? 'copy-success' : ''}" 
                          title="${translate('table.copy_right')}" 
                          @click=${(e: MouseEvent) => {
                            e.stopPropagation();
                            this._handleCopy(row.id, rightVal, 'right');
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
                    },
                  )
            }
        </tbody>
      </table>
    `;
  }

  /** Renders a badge showing the number of attributes/columns for an entity/table. */
  private _renderAttributeCounter(row: EnrichedDiffRow) {
    const isEntity = row.prop === 'Ent' && row.isHeader;
    if (!isEntity) return '';

    const count = row.attributeCount;
    const display = count !== undefined ? count : '?';

    return html`<span class="attr-badge">${display}</span>`;
  }

  /** Renders a character counter badge for physical names, with warning state for lengths > 18. */
  private _renderLenCounter(row: EnrichedDiffRow, value: string) {
    const isPhysicalName = row.type === 'Physical Name';
    const isIdentificationRow =
      row.isHeader && !row.isGrouping && (row.prop === 'Ent' || row.prop === 'Atr');

    if (!(isPhysicalName || isIdentificationRow) || !value) return '';

    /** Calculates normalized length by stripping technical suffixes and owner prefixes. */
    const getLen = (val: string) => {
      let clean = val.trim();

      // 1. Remove Erwin tags
      clean = clean.replace(/\s*\[Calculated\]$/, '');
      clean = clean.replace(/\s*\(FK\)$/, '');

      // 2. Strip database owner prefix
      if (clean.includes('.')) {
        const parts = clean.split('.');
        clean = parts[parts.length - 1];
      }

      return clean.length;
    };

    const len = getLen(value);
    if (len === 0) return '';

    const isWarn = len > 18;
    return html`<span class="len-badge ${isWarn ? 'len-warn' : 'len-ok'}">${len}</span>`;
  }

  /**
   * Copies text to the clipboard and handles visual feedback state.
   */
  private _handleCopy(id: string, text: string, side: 'left' | 'right') {
    // Strip type prefix if present (e.g. "Physical Name: MY_TABLE" -> "MY_TABLE")
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
