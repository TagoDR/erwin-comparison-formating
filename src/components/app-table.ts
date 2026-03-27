import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StoreController } from '@nanostores/lit';
import { filteredData$ } from '../store/data.store';

@customElement('app-table')
export class AppTable extends LitElement {
  private data = new StoreController(this, filteredData$);

  static styles = css`
    :host {
      display: block;
      padding: var(--wa-space-m);
    }

    .table-container {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--wa-font-family-sans);
      font-size: var(--wa-font-size-s);
    }

    th {
      position: sticky;
      top: 3.5rem; /* Approximation of header height */
      background: var(--wa-color-neutral-fill-faint);
      padding: var(--wa-space-xs) var(--wa-space-s);
      text-align: left;
      border-bottom: 1px solid var(--wa-color-neutral-border);
      font-weight: var(--wa-font-weight-bold);
      z-index: 50;
    }

    td {
      padding: var(--wa-space-xs) var(--wa-space-s);
      border-bottom: 1px solid var(--wa-color-neutral-border);
    }

    .row-type {
      white-space: pre;
    }
  `;

  render() {
    if (this.data.value.length === 0) {
      return html`
        <wa-callout variant="neutral">
          <wa-icon name="info-circle" slot="icon"></wa-icon>
          Selecione um arquivo HTML gerado pelo Erwin para começar a análise.
        </wa-callout>
      `;
    }

    return html`
      <table class="table-container">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Prop</th>
            <th>Change</th>
            <th>View</th>
            <th>Left Model</th>
            <th>Right Model</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.value.map(row => html`
            <tr class="row-data">
              <td class="row-type">${row.type}</td>
              <td class="row-prop">${row.prop}</td>
              <td class="row-change">${row.change}</td>
              <td class="row-view">${row.view}</td>
              <td class="row-left">${row.leftModel}</td>
              <td class="row-right">${row.rightModel}</td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }
}
