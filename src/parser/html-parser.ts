import type { ErwinRow } from '../store/data.store';

/**
 * Parses the HTML content from Erwin's Complete Compare report.
 * @param html The raw HTML string.
 * @returns An array of ErwinRow.
 */
export function parseErwinHtml(html: string): ErwinRow[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const rows: ErwinRow[] = [];
  const trs = doc.querySelectorAll('tbody tr');

  trs.forEach(tr => {
    const tds = tr.querySelectorAll('td');
    if (tds.length < 4) return;

    const objectTd = tds[0];
    const rawLeft = tds[1].textContent?.trim() || '';
    const rawRight = tds[3].textContent?.trim() || '';

    // Strip [Calculated] for comparison
    const leftModel = rawLeft.replace(/\[Calculated\]/g, '').trim();
    const rightModel = rawRight.replace(/\[Calculated\]/g, '').trim();

    const rawTypeText = objectTd.textContent || '';
    const type = rawTypeText.trim();

    // Calculate indent: typically 6 spaces per level.
    // We count leading spaces or non-breaking spaces (\u00a0)
    const leadingWhitespace = rawTypeText.match(/^[\s\u00a0]*/)?.[0] || '';
    const indent = Math.floor(leadingWhitespace.length / 6);

    let change: 'I' | 'A' | 'E' | '' = '';
    if (leftModel && rightModel) {
      change = 'A';
    } else if (leftModel) {
      change = 'I';
    } else if (rightModel) {
      change = 'E';
    }

    rows.push({
      type,
      indent,
      leftModel: rawLeft, // Keep original for display
      rightModel: rawRight, // Keep original for display
      change,
      prop: '',
      view: '',
    });
  });

  return rows;
}
