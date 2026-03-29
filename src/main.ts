import { StoreController } from "@nanostores/lit";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { icons } from "./assets/icons";
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

		// Phase 2: Dynamic Page Title
		fileName$.subscribe((name) => {
			document.title = name ? `Erwin: ${name}` : "Erwin Compare Formatter";
		});

		// Phase 2: Global Drag & Drop Support
		this._setupGlobalDragDrop();
	}

	private _setupGlobalDragDrop() {
		window.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.stopPropagation();
		});

		window.addEventListener("drop", (e) => {
			e.preventDefault();
			e.stopPropagation();

			const file = e.dataTransfer?.files?.[0];
			if (file && file.name.toLowerCase().endsWith(".html")) {
				this._onFileLoadedFromDrop(file);
			}
		});
	}

	private _onFileLoadedFromDrop(file: File) {
		fileName$.set(file.name);
		isLoading$.set(true);

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			this._processFileContent(content);
		};
		reader.readAsText(file);
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
		this._processFileContent(content);
	}

	private _processFileContent(content: string) {
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
              <span class="empty-icon">${icons["file-diff"]}</span>
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
