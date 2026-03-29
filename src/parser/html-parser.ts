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
    const leftModel = tds[1].textContent?.trim() || '';
    // tds[2] is Match/Difference, usually ignored
    const rightModel = tds[3].textContent?.trim() || '';

    const rawTypeText = objectTd.textContent || '';
    const type = rawTypeText.trim();

    // Calculate indent based on non-breaking spaces or regular spaces
    // In DOM, &nbsp; becomes \u00a0 (160)
    const leadingWhitespace = rawTypeText.match(/^[\s\u00a0]*/)?.[0] || '';
    const indent = Math.floor(leadingWhitespace.length / 4);

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
      leftModel,
      rightModel,
      change,
      prop: '', // Will be filled by enrichment in store
      view: '', // Will be filled by enrichment in store
    });
  });

  return rows;
}
