import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { get, translate } from 'lit-translate';
import icons from '../icons';
import {
  enrichedData$,
  filterChange$,
  filterName$,
  hideCalculated$,
  onlyEntities$,
  onlyEntitiesAndAttributes$,
  resetFilters,
  showProperties$,
  statsSummary$,
  toggleFlip,
  togglePropertiesGlobal,
} from '../store/data.store.js';
import statsStyles from './app-stats.css?inline';

/**
 * Application statistics and filter panel component.
 * Displays a summary of changes (additions, alterations, deletions) for tables and columns,
 * and provides various filtering and interaction controls.
 */
@customElement('app-stats')
export class AppStats extends LitElement {
  static styles = unsafeCSS(statsStyles);
  private stats = new StoreController(this, statsSummary$);
  private nameFilter = new StoreController(this, filterName$);
  private changeFilter = new StoreController(this, filterChange$);
  private showProps = new StoreController(this, showProperties$);
  private hideCalc = new StoreController(this, hideCalculated$);
  private onlyEnt = new StoreController(this, onlyEntities$);

  private onlyEntAtr = new StoreController(this, onlyEntitiesAndAttributes$);
  @state() private isCopying = false;

  render() {
    if (this.stats.value.length === 0) return html``;

    return html`
      <div class="layout-stats">
        <div class="left-stats">
          <div class="stats-container">
            <button class="btn btn-primary btn-xs flip-btn" @click=${toggleFlip} title="${translate('header.flip_tooltip')}">
               ${icons['switch-horizontal']} <span>${translate('header.flip')}</span>
            </button>
            <table class="table table-condensed stats-table">
              <thead>
                <tr>
                  <th>${translate('stats.col_type')}</th>
                  <th class="total-col">${translate('stats.col_total')}</th>
                  <th class="status-I">${translate('stats.col_addition')}</th>
                  <th class="status-A">${translate('stats.col_change')}</th>
                  <th class="status-E">${translate('stats.col_deletion')}</th>
                  <th class="status-C">${translate('stats.col_calculated')}</th>
                </tr>
              </thead>
              <tbody>
                ${this.stats.value.map(
                  s => html`
                  <tr data-type="${s.type}">
                    <td class="type-col">${translate(`stats.row_${s.type.toLowerCase()}`)}</td>
                    <td class="val-col total-col clickable-cell" @click=${() => this._handleCellClick(s.type, '')}>
                      <div class="val-wrapper">
                        ${s.total}
                        ${s.type === 'Tables' /*&& s.largeTablesCount*/ ? html`<span class="large-count-bubble" title="Tables with > 11 attributes">${s.largeTablesCount}</span>` : ''}
                      </div>
                    </td>
                    <td class="val-col status-I clickable-cell" @click=${() => this._handleCellClick(s.type, 'I')}>${s.inclusion}</td>
                    <td class="val-col status-A clickable-cell" @click=${() => this._handleCellClick(s.type, 'A')}>${s.alteration}</td>
                    <td class="val-col status-E clickable-cell" @click=${() => this._handleCellClick(s.type, 'E')}>${s.exclusion}</td>
                    <td class="val-col status-C">${s.calculated}</td>
                  </tr>
                `,
                )}
              </tbody>
            </table>
            <button class="btn btn-primary btn-xs copy-side-btn" @click=${this._copyTablesToClipboard} title="${translate('stats.actions.copy_tables')}">
               ${this.isCopying ? icons.check : icons['clipboard-list']} 
               <span>${this.isCopying ? translate('stats.messages.copied') : translate('stats.actions.copy_tables')}</span>
            </button>
          </div>

          <div class="filter-panel">
            <div class="filter-item search-filter">
              <label for="name-filter">${translate('header.filters.name')}</label>
              <div class="search-input-wrapper">
                  ${icons['list-search']}
                  <input 
                    id="name-filter"
                    type="text" 
                    class="form-control" 
                    placeholder="Search..." 
                    .value=${this.nameFilter.value}
                    @input=${this._updateNameFilter}
                  />
              </div>
            </div>

            <div class="filter-item">
              <label for="change-filter">${translate('header.filters.change')}</label>
              <select id="change-filter" class="form-control" .value=${this.changeFilter.value} @change=${this._updateChangeFilter}>
                <option value="">${translate('changes.all')}</option>
                <option value="I">${translate('changes.addition')}</option>
                <option value="A">${translate('changes.change')}</option>
                <option value="E">${translate('changes.deletion')}</option>
              </select>
            </div>

            <div class="filter-switches">
              <div class="stacked-switches main-stacked">
                <label class="switch-label main-switch">
                  <div class="switch">
                    <input type="checkbox" .checked=${this.showProps.value} @change=${togglePropertiesGlobal}>
                    <span class="slider round"></span>
                  </div>
                  <span>${translate('stats.actions.show_props')}</span>
                </label>

                <label class="switch-label">
                  <div class="switch">
                    <input type="checkbox" .checked=${this.hideCalc.value} @change=${(e: Event) => hideCalculated$.set((e.target as HTMLInputElement).checked)}>
                    <span class="slider round"></span>
                  </div>
                  <span>${translate('stats.actions.hide_calculated')}</span>
                </label>
              </div>

              <div class="stacked-switches">
                <label class="switch-label">
                  <div class="switch">
                    <input type="checkbox" .checked=${this.onlyEnt.value} @change=${(e: Event) => {
                      onlyEntities$.set((e.target as HTMLInputElement).checked);
                      if ((e.target as HTMLInputElement).checked)
                        onlyEntitiesAndAttributes$.set(false);
                    }}>
                    <span class="slider round"></span>
                  </div>
                  <span>${translate('stats.actions.only_entities')}</span>
                </label>

                <label class="switch-label">
                  <div class="switch">
                    <input type="checkbox" .checked=${this.onlyEntAtr.value} @change=${(
                      e: Event,
                    ) => {
                      onlyEntitiesAndAttributes$.set((e.target as HTMLInputElement).checked);
                      if ((e.target as HTMLInputElement).checked) onlyEntities$.set(false);
                    }}>
                    <span class="slider round"></span>
                  </div>
                  <span>${translate('stats.actions.only_ent_atr')}</span>
                </label>
              </div>
            </div>

            <div class="clear-filters-area">
               <button class="btn btn-default btn-xs clear-btn" @click=${resetFilters} title="${translate('header.filters.clear_filters')}">
                  ${icons['filter-off']}
               </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Updates the change filter based on user selection.
   * @param e The change event from the select element.
   */
  private _updateChangeFilter(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    filterChange$.set(val);
  }

  /**
   * Updates the name search filter based on user input.
   * @param e The input event from the text field.
   */
  private _updateNameFilter(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    filterName$.set(val);
  }

  /**
   * Handles clicks on the statistics table cells to apply filters.
   * Clicking on a total or change count will filter the main table accordingly.
   * @param type The type of object clicked ('Tables' or 'Columns').
   * @param change The change type ('I', 'A', 'E', or empty for total).
   */
  private _handleCellClick(type: string, change: string) {
    // Update change filter
    filterChange$.set(change);

    // Sync the select element if it exists
    const select = this.renderRoot.querySelector('#change-filter') as HTMLSelectElement;
    if (select) select.value = change;

    // Handle switches for drill-down modes
    if (type === 'Tables') {
      if (change === '') {
        // Toggle if total clicked
        const current = onlyEntities$.get();
        onlyEntities$.set(!current);
        if (!current) onlyEntitiesAndAttributes$.set(false);
      } else {
        // Force on if status clicked
        onlyEntities$.set(true);
        onlyEntitiesAndAttributes$.set(false);
      }
    } else if (type === 'Columns') {
      if (change === '') {
        // Toggle if total clicked
        const current = onlyEntitiesAndAttributes$.get();
        onlyEntitiesAndAttributes$.set(!current);
        if (!current) onlyEntities$.set(false);
      } else {
        // Force on if status clicked
        onlyEntitiesAndAttributes$.set(true);
        onlyEntities$.set(false);
      }
    }
  }

  /**
   * Copies the names of all identified tables to the clipboard.
   * Provides visual feedback upon successful copy.
   */
  private _copyTablesToClipboard() {
    const tables = enrichedData$
      .get()
      .filter(row => row.isHeader && row.prop === 'Ent' && (row.left || row.right))
      .map(row => row.left || row.right)
      .filter((v, i, a) => v && a.indexOf(v) === i)
      .join('\n');

    if (tables) {
      navigator.clipboard.writeText(tables).then(() => {
        this.isCopying = true;
        setTimeout(() => {
          this.isCopying = false;
        }, 2000);
      });
    } else {
      alert(get('stats.messages.no_tables'));
    }
  }
}
