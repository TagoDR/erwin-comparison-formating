import { StoreController } from "@nanostores/lit";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { icons } from "../assets/icons";
import { enrichedData$ } from "../store/data.store";
import tableStyles from "./app-table.css?inline";

@customElement("app-table")
export class AppTable extends LitElement {
	private data = new StoreController(this, enrichedData$);

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
	 * Replaces the leading spaces with a visible indentation symbol.
	 */
	private _formatTypeWithIndents(type: string, indent: number) {
		const level = this._getNestingLevel(indent);
		if (level === 0) return type.trim();

		// Using a subtle middle dot (·) for each level without spaces
		const symbol = "·".repeat(level);
		return `${symbol} ${type.trim()}`;
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

		return html`
      <table class="table table-condensed table-hover table-container">
        <thead>
          <tr>
            <th>Tipo / Objeto</th>
            <th>Modelo Trabalhando (Left)</th>
            <th>Modelo Referência (Right)</th>
            <th>Prop</th>
            <th>Alteração</th>
            <th>Visão</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.value.map((row) => {
						const isNameRow =
							row.type.toLowerCase().includes("name") || row.isHeader;
						const nestingLevel = this._getNestingLevel(row.indent);
						const formattedType = this._formatTypeWithIndents(
							row.type,
							row.indent,
						);

						return html`
              <tr 
                data-change="${row.change}" 
                data-level="${nestingLevel}"
                data-prop="${row.prop}"
                data-header="${row.isHeader || false}"
              >
                <td class="row-type">
                  <div class="name-cell">
                    <span>${formattedType}</span>
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
                <td class="row-change" style="text-align: center;">${row.change}</td>
                <td class="row-view" style="text-align: center;">${row.view}</td>
              </tr>
            `;
					})}
        </tbody>
      </table>
    `;
	}
}
