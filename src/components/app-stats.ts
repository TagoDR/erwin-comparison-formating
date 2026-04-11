import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { icons } from '../assets/icons';
import {
  filterChange$,
  filterName$,
  rawData$,
  showProperties$,
  statsSummary$,
  togglePropertiesGlobal,
} from '../store/data.store';
import statsStyles from './app-stats.css?inline';

@customElement('app-stats')
export class AppStats extends LitElement {
  private stats = new StoreController(this, statsSummary$);
  private nameFilter = new StoreController(this, filterName$);
  private showProps = new StoreController(this, showProperties$);

  static styles = unsafeCSS(statsStyles);

  private _updateChangeFilter(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    filterChange$.set(val);
  }

  private _updateNameFilter(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    filterName$.set(val);
  }

  private _copyTablesToClipboard() {
    const tables = rawData$
      .get()
      .filter(row => row.isHeader && row.type.toLowerCase().includes('table'))
      .map(row => {
        // Extracting table name after ':'
        const parts = row.type.split(':');
        return parts.length > 1 ? parts[1].trim() : row.type.trim();
      })
      .join('\n');

    if (tables) {
      navigator.clipboard.writeText(tables).then(() => {
        alert('Table name list copied to clipboard!');
      });
    } else {
      alert('No table names found.');
    }
  }

  render() {
    if (this.stats.value.length === 0) return html``;

    return html`
      <div class="layout-stats">
        <div class="left-stats">
          <div class="stats-container">
            <table class="table table-condensed stats-table">
              <thead>
                <tr>
                  <th>Object</th>
                  <th>Total</th>
                  <th class="status-I">Inclusion</th>
                  <th class="status-A">Alteration</th>
                  <th class="status-E">Exclusion</th>
                </tr>
              </thead>
              <tbody>
                ${this.stats.value.map(
                  s => html`
                  <tr data-type="${s.type}">
                    <td class="type-col">${s.type}</td>
                    <td class="val-col">${s.total}</td>
                    <td class="val-col status-I">${s.inclusion}</td>
                    <td class="val-col status-A">${s.alteration}</td>
                    <td class="val-col status-E">${s.exclusion}</td>
                  </tr>
                `,
                )}
              </tbody>
            </table>
          </div>

          <div class="filter-panel">
            <div class="filter-item search-filter">
              <label for="name-filter">Filter by Name</label>
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
              <label for="change-filter">Change Type</label>
              <select id="change-filter" class="form-control" @change=${this._updateChangeFilter}>
                <option value="">All</option>
                <option value="I">Inclusion (I)</option>
                <option value="A">Alteration (A)</option>
                <option value="E">Exclusion (E)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="action-panel">
          <button type="button" class="btn btn-primary btn-block action-btn" @click=${this._copyTablesToClipboard}>
            ${icons['clipboard-list']} <span>COPY TABLES</span>
          </button>
          <button type="button" class="btn btn-default btn-block action-btn" @click=${togglePropertiesGlobal}>
            ${this.showProps.value ? icons['filter-off'] : icons.filter} 
            <span>${this.showProps.value ? 'HIDE PROPERTIES' : 'SHOW PROPERTIES'}</span>
          </button>
        </div>
      </div>
    `;
  }
}
