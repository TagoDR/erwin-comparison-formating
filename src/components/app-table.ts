import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StoreController } from '@nanostores/lit';
import { filteredData$ } from '../store/data.store';

@customElement('app-table')
export class AppTable extends LitElement {
  private data = new StoreController(this, filteredData$);

  static styles = css`
    :host {
      display: block;
      padding: 1.5rem;
    }

    .pure-table {
      width: 100%;
      background: #0f172a;
      border: 1px solid #334155;
      color: #f8fafc;
      border-collapse: collapse;
      border-radius: 4px;
      overflow: hidden;
    }

    th {
      position: sticky;
      top: 4.5rem; /* Header height offset */
      background: #1e293b !important;
      padding: 0.8rem 1rem !important;
      text-align: left;
      border-bottom: 2px solid #334155 !important;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      z-index: 50;
    }

    td {
      padding: 0.6rem 1rem !important;
      border-bottom: 1px solid #334155 !important;
      vertical-align: top;
      font-size: 0.85rem;
    }

    tr:last-child td {
      border-bottom: none !important;
    }

    .row-type {
      white-space: pre;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      color: #3b82f6;
    }

    /* Status Coloring (Hoisted) */
    tr[data-change="I"] { background-color: rgba(6, 78, 59, 0.4); border-left: 4px solid #10b981; }
    tr[data-change="A"] { background-color: rgba(76, 29, 149, 0.4); border-left: 4px solid #8b5cf6; }
    tr[data-change="E"] { background-color: rgba(127, 29, 29, 0.4); border-left: 4px solid #ef4444; }

    .callout {
      background: #1e293b;
      border: 1px solid #334155;
      padding: 3rem;
      text-align: center;
      border-radius: 8px;
      color: #94a3b8;
      margin-top: 2rem;
    }

    .callout-icon {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      display: block;
    }
  `;

  render() {
    if (this.data.value.length === 0) {
      return html`
        <div class="callout">
          <span class="callout-icon">📊</span>
          Selecione o arquivo HTML gerado pelo Erwin Modeler para análise comparativa.
        </div>
      `;
    }

    return html`
      <table class="pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th>Tipo / Objeto</th>
            <th>Propriedade</th>
            <th>Alteração</th>
            <th>Visão</th>
            <th>Modelo Trabalhando (Left)</th>
            <th>Modelo Referência (Right)</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.value.map(row => html`
            <tr data-change="${row.change}">
              <td class="row-type">${row.type}</td>
              <td class="row-prop">${row.prop}</td>
              <td class="row-change" style="text-align: center;">${row.change}</td>
              <td class="row-view" style="text-align: center;">${row.view}</td>
              <td class="row-left">${row.leftModel}</td>
              <td class="row-right">${row.rightModel}</td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }
}
