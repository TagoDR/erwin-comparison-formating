import { StoreController } from "@nanostores/lit";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { icons } from "../assets/icons";
import {
	checkedIds$,
	collapsedIds$,
	enrichedData$,
	filteredData$,
	toggleCheck,
	toggleCollapse,
} from "../store/data.store";
import tableStyles from "./app-table.css?inline";

@customElement("app-table")
export class AppTable extends LitElement {
	private data = new StoreController(this, filteredData$);
	private collapsed = new StoreController(this, collapsedIds$);
	private checked = new StoreController(this, checkedIds$);

	static styles = unsafeCSS(tableStyles);

	private _copyToClipboard(text: string) {
		const cleanText = text.includes(":")
			? text.split(":")[1].trim()
			: text.trim();
		navigator.clipboard.writeText(cleanText).then(() => {
			console.log("Copied:", cleanText);
		});
	}

	private _getNestingLevel(indent: number): number {
		// 4 spaces = 1 Level.
		const level = Math.floor(indent / 4);
		return Math.min(level, 4);
	}

	/**
	 * Replaces the leading spaces with a visible indentation symbol and removes object name.
	 */
	private _formatTypeWithIndents(type: string, indent: number) {
		const level = this._getNestingLevel(indent);
		const category = type.includes(":")
			? type.split(":")[0].trim()
			: type.trim();

		if (level === 0) return category;

		// Using a subtle middle dot (·) for each level without spaces
		const symbol = "·".repeat(level);
		return `${symbol} ${category}`;
	}

	render() {
		if (this.data.value.length === 0) {
			return html`
        <div class="callout">
          <span class="callout-icon">${icons["clipboard-list"]}</span>
          Selecione o arquivo HTML gerado pelo Erwin Modeler para análise comparativa.
        </div>
      `;
		}

		const collapsedSet = this.collapsed.value;
		const checkedSet = this.checked.value;

		// Determine which rows are hidden due to collapsed parents
		const hiddenRows = new Set<string>();
		this.data.value.forEach((row) => {
			if (
				row.parentId &&
				(collapsedSet.has(row.parentId) || hiddenRows.has(row.parentId))
			) {
				hiddenRows.add(row.id!);
			}
		});

		return html`
      <table class="table table-condensed table-hover table-container">
        <thead>
          <tr>
            <th class="col-check">√</th>
            <th>Tipo / Objeto</th>
            <th>Modelo Trabalhando (Left)</th>
            <th>Modelo Referência (Right)</th>
            <th>Prop</th>
            <th>Alt</th>
            <th>Vis</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.value.map((row) => {
						if (hiddenRows.has(row.id!)) return html``;

						const isNameRow =
							row.type.toLowerCase().includes("name") || row.isHeader;
						const nestingLevel = this._getNestingLevel(row.indent);
						const formattedType = this._formatTypeWithIndents(
							row.type,
							row.indent,
						);
						const isCollapsed = collapsedSet.has(row.id!);
						const isChecked = checkedSet.has(row.id!);

						return html`
              <tr 
                data-change="${row.change}" 
                data-level="${nestingLevel}"
                data-prop="${row.prop}"
                data-header="${row.isHeader || false}"
                class="${isChecked ? "checked-row" : ""}"
              >
                <td class="col-check">
                   <input 
                    type="checkbox" 
                    .checked=${isChecked}
                    @change=${() => toggleCheck(row.id!)}
                   />
                </td>
                <td class="row-type">
                  <div class="name-cell">
                    <span class="type-text">
                        ${
													row.isHeader
														? html`
                            <span 
                                class="collapse-toggle ${isCollapsed ? "collapsed" : ""}" 
                                @click=${() => toggleCollapse(row.id!)}
                            ></span>
                        `
														: ""
												}
                        ${formattedType}
                    </span>
                    ${
											isNameRow
												? html`
                      <button 
                        class="btn btn-default btn-xs copy-btn" 
                        title="Copiar nome" 
                        @click=${() => this._copyToClipboard(row.type)}
                      >${icons.copy}</button>
                    `
												: ""
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
