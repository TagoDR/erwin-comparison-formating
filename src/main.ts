import { StoreController } from "@nanostores/lit";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import {
	fileName$,
	filteredData$,
	isLoading$,
	rawData$,
} from "./store/data.store";
import { MOCK_ERWIN_DATA } from "./store/mock-data";

// Import Global CSS
import "./index.css";
import mainStyles from "./main.css?inline";

// Importing components
import "./components/app-header";
import "./components/app-stats";
import "./components/app-table";

// FLAG TO ENABLE MOCK DATA IN DEV MODE
const USE_MOCK = import.meta.env.DEV && true;

@customElement("app-root")
export class AppRoot extends LitElement {
	private isLoading = new StoreController(this, isLoading$);
	private fileName = new StoreController(this, fileName$);

	static styles = unsafeCSS(mainStyles);

	firstUpdated() {
		if (USE_MOCK) {
			this._loadMockData();
		}
	}

	private _loadMockData() {
		fileName$.set("mock-erwin-report.html");
		isLoading$.set(true);

		// Simulate parsing delay for visual verification
		setTimeout(() => {
			rawData$.set(MOCK_ERWIN_DATA);
			filteredData$.set(MOCK_ERWIN_DATA);
			isLoading$.set(false);
		}, 800);
	}

	private _onFileLoaded(e: CustomEvent<{ content: string }>) {
		const { content } = e.detail;
		console.log(
			"File content loaded, starting parser...",
			content.substring(0, 100),
		);

		// TODO: Implement actual parser logic in src/parser/
		isLoading$.set(false);
	}

	render() {
		const showData = !!this.fileName.value && !this.isLoading.value;

		return html`
      <div class="main-content" @file-loaded=${this._onFileLoaded}>
        <app-header></app-header>
        
        <div class="display-area">
          ${
						showData
							? html`
            <app-stats></app-stats>
            <app-table></app-table>
          `
							: ""
					}

          ${
						!this.fileName.value && !this.isLoading.value
							? html`
            <div class="empty-state">
              <span class="empty-icon">📂</span>
              <span>Nenhum arquivo carregado. Use a área superior para iniciar.</span>
            </div>
          `
							: ""
					}
        </div>
        
        ${
					this.isLoading.value
						? html`
          <div class="loading-overlay">
            <div class="spinner"></div>
            <span class="loading-text">Processando arquivo Erwin...</span>
          </div>
        `
						: ""
				}
      </div>
    `;
	}
}
