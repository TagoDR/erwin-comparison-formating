import { StoreController } from "@nanostores/lit";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
	fileName$,
	filteredData$,
	isLoading$,
	rawData$,
} from "../store/data.store";
import headerStyles from "./app-header.css?inline";

@customElement("app-header")
export class AppHeader extends LitElement {
	private isLoading = new StoreController(this, isLoading$);
	private fileName = new StoreController(this, fileName$);

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
	}

	render() {
		return html`
      <div class="header-layout">
        <div class="brand">Erwin Formatter</div>

        ${
					this.fileName.value
						? html`
          <div class="file-info">
            <span class="file-name">${this.fileName.value}</span>
            <button class="close-btn" @click=${this._closeFile}>FECHAR ARQUIVO</button>
          </div>
        `
						: html`
          <div 
            class="file-drop-zone ${this.isDragging ? "dragging" : ""}"
            @drop=${this._onDrop}
            @dragover=${this._onDragOver}
            @dragleave=${this._onDragLeave}
          >
            <span class="icon">📁</span>
            <span>Selecione ou arraste o arquivo HTML do Erwin aqui</span>
            <input type="file" @change=${(e: any) => this._handleFile(e.target.files[0])} />
          </div>
        `
				}

        <div style="width: 150px;"></div>
      </div>
    `;
	}
}
