import { StoreController } from '@nanostores/lit';
import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { translate } from 'lit-translate';
import icons from '../icons';
import {
  hiddenProperties$,
  hideAllProperties,
  isPropertyDrawerOpen$,
  resetHiddenProperties,
  toggleProperty,
  uniqueProperties$,
} from '../store/data.store.js';
import drawerStyles from './property-drawer.css?inline';

/**
 * Left-side drawer component for managing property visibility by name.
 * Allows users to permanently hide specific metadata fields (e.g., 'Physical Name', 'Logical Datatype').
 */
@customElement('property-drawer')
export class PropertyDrawer extends LitElement {
  static styles = unsafeCSS(drawerStyles);
  private _isOpenStore = new StoreController(this, isPropertyDrawerOpen$);
  private _propertiesStore = new StoreController(this, uniqueProperties$);
  private _hiddenStore = new StoreController(this, hiddenProperties$);

  render() {
    const open = this._isOpenStore.value;
    const hiddenSet = this._hiddenStore.value;
    const groups = this._propertiesStore.value;

    return html`
      <div class="drawer-overlay ${open ? 'active' : ''}" @click=${this._close}></div>
      <aside class="property-drawer ${open ? 'open' : ''}">
        <header class="drawer-header">
          <div class="header-main">
            <h3>${translate('drawer.title')}</h3>
            <button class="btn btn-default btn-xs close-btn" @click=${this._close}>
              ${icons.x}
            </button>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary btn-xs" @click=${hideAllProperties}>
              ${translate('drawer.hide_all')}
            </button>
            <button class="btn btn-default btn-xs" @click=${resetHiddenProperties}>
              ${translate('drawer.show_all')}
            </button>
          </div>
        </header>

        <div class="drawer-content">
          ${
            groups.length === 0
              ? html`<div class="empty-state">${translate('drawer.no_props')}</div>`
              : groups.map(
                  group => html`
            <div class="property-group">
              <div class="group-header">
                <span class="group-label">${group.parentType}</span>
              </div>
              <ul class="property-list">
                ${group.children.map(p => {
                  const isVisible = !hiddenSet.has(p.key);
                  return html`
                    <li class="property-item" @click=${() => toggleProperty(p.key)}>
                      <label class="item-label">
                        <input type="checkbox" .checked=${isVisible} readonly>
                        <div class="item-info">
                          <span class="prop-type">${p.type}</span>
                          <span class="prop-meta">
                             <span class="indent-indicator">${'·'.repeat(p.spaces / 3)}</span>
                          </span>
                        </div>
                      </label>
                    </li>
                  `;
                })}
              </ul>
            </div>
          `,
                )
          }
        </div>
      </aside>
    `;
  }

  private _close() {
    isPropertyDrawerOpen$.set(false);
  }
}
