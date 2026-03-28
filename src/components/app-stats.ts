import { StoreController } from "@nanostores/lit";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import {
	filterChange$,
	filterObject$,
	rawData$,
	statsSummary$,
} from "../store/data.store";
import statsStyles from "./app-stats.css?inline";

@customElement("app-stats")
export class AppStats extends LitElement {
	private stats = new StoreController(this, statsSummary$);

	static styles = unsafeCSS(statsStyles);

	private _updateChangeFilter(e: Event) {
		const val = (e.target as HTMLSelectElement).value;
		filterChange$.set(val);
	}

	private _updateObjectFilter(e: Event) {
		const val = (e.target as HTMLSelectElement).value;
		filterObject$.set(val);
	}

	private _copyTablesToClipboard() {
		const tables = rawData$
			.get()
			.filter((row) => row.isHeader && row.type.toLowerCase().includes("table"))
			.map((row) => {
				// Extracting table name after ':'
				const parts = row.type.split(":");
				return parts.length > 1 ? parts[1].trim() : row.type.trim();
			})
			.join("\n");

		if (tables) {
			navigator.clipboard.writeText(tables).then(() => {
				alert("Lista de tabelas copiada para o clipboard!");
			});
		} else {
			alert("Nenhuma tabela encontrada para copiar.");
		}
	}

	render() {
		if (this.stats.value.length === 0) return html``;

		return html`
      <div class="layout-stats">
        <div class="left-stats">
          <div class="stats-container">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Objeto</th>
                  <th>Total</th>
                  <th class="status-I">Inclusão</th>
                  <th class="status-A">Alteração</th>
                  <th class="status-E">Exclusão</th>
                </tr>
              </thead>
              <tbody>
                ${this.stats.value.map(
									(s) => html`
                  <tr>
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
            <div class="filter-item">
              <label for="change-filter">Tipo de Mudança</label>
              <select id="change-filter" @change=${this._updateChangeFilter}>
                <option value="">Todas</option>
                <option value="I">Inclusão (I)</option>
                <option value="A">Alteração (A)</option>
                <option value="E">Exclusão (E)</option>
              </select>
            </div>

            <div class="filter-item">
              <label for="object-filter">Categoria</label>
              <select id="object-filter" @change=${this._updateObjectFilter}>
                <option value="">Todos</option>
                <option value="table">Tabelas</option>
                <option value="column">Colunas</option>
                <option value="others">Outros</option>
              </select>
            </div>
          </div>
        </div>

        <div class="action-panel">
          <button type="button" class="copy-all-btn" @click=${this._copyTablesToClipboard}>
            <span>📋</span> COPIAR NOMES DAS TABELAS
          </button>
        </div>
      </div>
    `;
	}
}
