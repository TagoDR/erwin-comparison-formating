import { StoreController } from "@nanostores/lit";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { icons } from "../assets/icons";
import {
	fileName$,
	filteredData$,
	isLoading$,
	rawData$,
    filterName$
} from "../store/data.store";
import { theme$, toggleTheme } from "../store/theme.store";
import headerStyles from "./app-header.css?inline";

@customElement("app-header")
export class AppHeader extends LitElement {
	private fileName = new StoreController(this, fileName$);
	private theme = new StoreController(this, theme$);

	@state() private isDragging = false;

	static styles = unsafeCSS(headerStyles);

	private _handleFile(file: File) {
		if (!file) return;
		fileName$.set(file.name);
		isLoading$.set(true);

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			this.dispatchEvent(
				new CustomEvent("file-loaded", {
					detail: { content },
					bubbles: true,
					composed: true,
				}),
			);
		};
		reader.readAsText(file);
	}

	private _onDrop(e: DragEvent) {
		e.preventDefault();
		this.isDragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) this._handleFile(file);
	}

	private _onDragOver(e: DragEvent) {
		e.preventDefault();
		this.isDragging = true;
	}

	private _onDragLeave() {
		this.isDragging = false;
	}

	private _closeFile() {
		fileName$.set(null);
		rawData$.set([]);
		filteredData$.set([]);
        filterName$.set("");
	}

	render() {
		return html`
      <div class="header-layout">
        <div class="brand">Erwin Complete Compare</div>

        ${
					this.fileName.value
						? html`
          <div class="file-info">
            <span class="file-name">${this.fileName.value}</span>
            <button class="btn btn-danger btn-xs close-btn" @click=${this._closeFile}>
               ${icons.x} <span>Fechar Arquivo</span>
            </button>
          </div>
        `
						: html`
          <div 
            class="file-drop-zone ${this.isDragging ? "dragging" : ""}"
            @drop=${this._onDrop}
            @dragover=${this._onDragOver}
            @dragleave=${this._onDragLeave}
          >
            <span class="icon">${icons["file-diff"]}</span>
            <span>Selecione ou arraste o arquivo HTML do Erwin aqui</span>
            <input type="file" @change=${(e: Event) => this._handleFile((e.target as HTMLInputElement).files?.[0] as File)} />
          </div>
        `
				}

        <div class="header-controls">
          <div class="version-tag">v5</div>
          <button class="theme-toggle" @click=${toggleTheme} title="Alternar Tema">
            ${this.theme.value === "dark" ? icons.sun : icons.moon}
          </button>
        </div>
      </div>
    `;
	}
}
