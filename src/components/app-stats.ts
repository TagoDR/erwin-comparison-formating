import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { get, translate } from 'lit-translate';
import { icons } from '../assets/icons';
import {
  enrichedData$,
  filterChange$,
  filterName$,
  hideCalculated$,
  onlyEntities$,
  onlyEntitiesAndAttributes$,
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
            <button class="btn btn-primary btn-xs copy-side-btn" @click=${this._copyTablesToClipboard} title="${translate('stats.actions.copy_tables')}">
               ${this.isCopying ? icons.check : icons['clipboard-list']} 
               <span>${this.isCopying ? translate('stats.messages.copied') : translate('stats.actions.copy_tables')}</span>
            </button>
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
                    <input type="checkbox" .checked=${this.hideCalc.value} @change=${(e: any) => hideCalculated$.set(e.target.checked)}>
                    <span class="slider round"></span>
                  </div>
                  <span>${translate('stats.actions.hide_calculated')}</span>
                </label>
              </div>

              <div class="stacked-switches">
                <label class="switch-label">
                  <div class="switch">
                    <input type="checkbox" .checked=${this.onlyEnt.value} @change=${(e: any) => {
                      onlyEntities$.set(e.target.checked);
                      if (e.target.checked) onlyEntitiesAndAttributes$.set(false);
                    }}>
                    <span class="slider round"></span>
                  </div>
                  <span>${translate('stats.actions.only_entities')}</span>
                </label>

                <label class="switch-label">
                  <div class="switch">
                    <input type="checkbox" .checked=${this.onlyEntAtr.value} @change=${(e: any) => {
                      onlyEntitiesAndAttributes$.set(e.target.checked);
                      if (e.target.checked) onlyEntities$.set(false);
                    }}>
                    <span class="slider round"></span>
                  </div>
                  <span>${translate('stats.actions.only_ent_atr')}</span>
                </label>
              </div>
            </div>
          </div>
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
