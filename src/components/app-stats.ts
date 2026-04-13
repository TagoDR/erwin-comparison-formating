import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { get, translate } from 'lit-translate';
import { icons } from '../assets/icons';
import {
  enrichedData$,
  filterChange$,
  filterName$,
  showProperties$,
  statsSummary$,
  toggleFlip,
  togglePropertiesGlobal,
} from '../store/data.store';
import statsStyles from './app-stats.css?inline';

@customElement('app-stats')
export class AppStats extends LitElement {
  static styles = unsafeCSS(statsStyles);
  private stats = new StoreController(this, statsSummary$);
  private nameFilter = new StoreController(this, filterName$);
  private showProps = new StoreController(this, showProperties$);

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
                    <td class="val-col total-col">
                      <div class="val-wrapper">
                        ${s.total}
                        ${s.type === 'Tables' /*&& s.largeTablesCount*/ ? html`<span class="large-count-bubble" title="Tables with > 11 attributes">${s.largeTablesCount}</span>` : ''}
                      </div>
                    </td>
                    <td class="val-col status-I">${s.inclusion}</td>
                    <td class="val-col status-A">${s.alteration}</td>
                    <td class="val-col status-E">${s.exclusion}</td>
                    <td class="val-col status-C">${s.calculated}</td>
                  </tr>
                `,
                )}
              </tbody>
            </table>
          </div>

          <div class="filter-panel">
            <div class="filter-item search-filter">
              <label for="name-filter">${translate('header.filters.name')}</label>
              <div class="search-input-wrapper">
                  ${icons.filter}
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
              <select id="change-filter" class="form-control" @change=${this._updateChangeFilter}>
                <option value="">${translate('changes.all')}</option>
                <option value="I">${translate('changes.addition')}</option>
                <option value="A">${translate('changes.change')}</option>
                <option value="E">${translate('changes.deletion')}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="action-panel">
          <button type="button" class="btn btn-primary btn-block action-btn" @click=${this._copyTablesToClipboard}>
            ${this.isCopying ? icons.check : icons['clipboard-list']} 
            <span>${this.isCopying ? translate('stats.messages.copied') : translate('stats.actions.copy_tables')}</span>
          </button>
          <button type="button" class="btn btn-default btn-block action-btn" @click=${togglePropertiesGlobal}>
            ${this.showProps.value ? icons['filter-off'] : icons.filter} 
            <span>${this.showProps.value ? translate('stats.actions.hide_props') : translate('stats.actions.show_props')}</span>
          </button>
        </div>
      </div>
    `;
  }

  private _updateChangeFilter(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    filterChange$.set(val);
  }

  private _updateNameFilter(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    filterName$.set(val);
  }

  private _copyTablesToClipboard() {
    const tables = enrichedData$
      .get()
      .filter(row => row.isHeader && row.prop === 'Ent' && (row.leftModel || row.rightModel))
      .map(row => row.leftModel || row.rightModel)
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
