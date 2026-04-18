import { html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import IconCheck from './check.svg';
import IconChevronDown from './chevron-down.svg';
import IconClipboardCopy from './clipboard-copy.svg';
import IconClipboardList from './clipboard-list.svg';
import IconCopy from './copy.svg';
import IconFileDiff from './file-diff.svg';
import IconFileUpload from './file-upload.svg';
import IconFilter from './filter.svg';
import IconFilterOff from './filter-off.svg';
import IconListSearch from './list-search.svg';
import IconMoon from './moon.svg';
import IconSchema from './schema.svg';
import IconSchemaOff from './schema-off.svg';
import IconSquareCheck from './square-check.svg';
import IconSun from './sun.svg';
import IconSwitchHorizontal from './switch-horizontal.svg';
import IconX from './x.svg';

const icons = {
  check: html`${unsafeSVG(IconCheck)}`,
  'chevron-down': html`${unsafeSVG(IconChevronDown)}`,
  'clipboard-copy': html`${unsafeSVG(IconClipboardCopy)}`,
  'clipboard-list': html`${unsafeSVG(IconClipboardList)}`,
  copy: html`${unsafeSVG(IconCopy)}`,
  'file-diff': html`${unsafeSVG(IconFileDiff)}`,
  'file-upload': html`${unsafeSVG(IconFileUpload)}`,
  filter: html`${unsafeSVG(IconFilter)}`,
  'filter-off': html`${unsafeSVG(IconFilterOff)}`,
  'list-search': html`${unsafeSVG(IconListSearch)}`,
  moon: html`${unsafeSVG(IconMoon)}`,
  schema: html`${unsafeSVG(IconSchema)}`,
  'schema-off': html`${unsafeSVG(IconSchemaOff)}`,
  'square-check': html`${unsafeSVG(IconSquareCheck)}`,
  sun: html`${unsafeSVG(IconSun)}`,
  'switch-horizontal': html`${unsafeSVG(IconSwitchHorizontal)}`,
  x: html`${unsafeSVG(IconX)}`,
};
export default icons;
