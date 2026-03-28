import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StoreController } from '@nanostores/lit';
import { filteredData$ } from '../store/data.store';
import tableStyles from './app-table.css?inline';

@customElement('app-table')
export class AppTable extends LitElement {
  private data = new StoreController(this, filteredData$);

  static styles = unsafeCSS(tableStyles);

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
      <table class="pure-table pure-table-horizontal table-container">
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
