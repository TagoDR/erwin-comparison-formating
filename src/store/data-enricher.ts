import {
  type Change,
  type DiffRow,
  type EnrichedDiffRow,
  type EnrichedHeaderRow,
  type EnrichedPropertyRow,
  HEADERS_CONFIG,
  type HeaderKeyword,
  LIST_TYPES,
  type ModelObject,
  type Prop,
  type View,
} from '../types.js';

/**
 * Transforms a hierarchical ModelObject tree into a flat array of EnrichedDiffRow objects.
 * Handles property formatting, UDP detection, and initial status calculation.
 *
 * @example
 * const model = parseErwinHtml(htmlString);
 * const flatData = flattenAndEnrichModel(model);
 *
 * @param model The root ModelObject to process.
 * @returns A flattened array of enriched rows.
 */
export function flattenAndEnrichModel(model: ModelObject): EnrichedDiffRow[] {
  const result: EnrichedDiffRow[] = [];

  function process(obj: ModelObject, parentId = '', indexInParent = 0) {
    const id = parentId
      ? `${parentId}|${obj.id.type}-${obj.id.left || obj.id.right || 'unnamed'}-${indexInParent}`
      : `root-${obj.id.type}`;

    const header = createEnrichedHeader(obj, id, parentId);
    const properties = (obj.properties || []).map((p, idx) =>
      createEnrichedProperty(p, id, obj.id.type, header.prop, idx),
    );

    // Side effects on header based on properties
    const attrCountFromOrderList = updateHeaderFromProperties(header, properties);

    result.push(header);
    result.push(...properties);

    // Process Children
    let childAttrCount = 0;
    let hasActualSubObjects = false;

    if (obj.children) {
      for (const children of Object.values(obj.children)) {
        if (!children || children.length === 0) continue;
        hasActualSubObjects = true;
        children.forEach((child, idx) => {
          process(child, id, idx);
          if (isAttributeType(child.id.type)) {
            childAttrCount++;
          }
        });
      }
    }

    header.hasSubObjects = hasActualSubObjects;
    header.hasProperties = properties.length > 0;

    // Final Attribute Count logic: prefers actual child objects, falls back to order list
    const finalAttrCount = Math.max(childAttrCount, attrCountFromOrderList);
    if (finalAttrCount > 0 && header.prop === 'Ent') {
      header.attributeCount = finalAttrCount;
    }
  }

  process(model);
  hoistCalculatedStatus(result);

  return result;
}

/**
 * Creates an EnrichedDiffRow for an object header.
 */
function createEnrichedHeader(obj: ModelObject, id: string, parentId: string): EnrichedHeaderRow {
  const headerMatch = HEADERS_CONFIG.find(
    h => h.object === obj.id.type && h.indentation.includes(obj.id.spaces),
  );

  return {
    ...obj.id,
    id,
    parentId,
    type: obj.id.type as HeaderKeyword,
    prop: (headerMatch?.prop as Prop) || '',
    change: determineChange(obj.id.left, obj.id.right),
    view: determineView(obj.id.type),
    isHeader: true,
    isGrouping: false,
    isUDP: false,
    isCalculated: obj.id.left === obj.id.right,
    hasSubObjects: false,
    hasProperties: false,
  };
}

/**
 * Creates an EnrichedDiffRow for a property.
 */
function createEnrichedProperty(
  p: DiffRow,
  parentId: string,
  parentType: string,
  parentProp: Prop,
  index: number,
): EnrichedPropertyRow {
  const isUDP = p.type.includes('.Physical.') || p.type.includes('.Logical.');
  const { left, right } = formatPropertyText(p.type, p.left, p.right);

  return {
    ...p,
    left,
    right,
    id: `${parentId}-p-${index}`,
    parentId,
    parentType,
    prop: parentProp,
    change: determineChange(p.left, p.right),
    view: '',
    isHeader: false,
    isGrouping: false,
    isUDP,
    isCalculated:
      p.left === p.right || (p.left.endsWith('[Calculated]') && p.right.endsWith('[Calculated]')),
    hasSubObjects: false,
    hasProperties: false,
  };
}

/**
 * Updates header metadata based on its properties (e.g., view overrides, attribute counts).
 * @returns The attribute count derived from order list properties.
 */
function updateHeaderFromProperties(
  header: EnrichedHeaderRow,
  properties: EnrichedPropertyRow[],
): number {
  let attrCountFromOrderList = 0;

  for (const p of properties) {
    if (p.type === 'Logical Only' && p.left === 'true') header.view = 'L';
    if (p.type === 'Physical Only' && p.left === 'true') header.view = 'P';

    if (LIST_TYPES.includes(p.type)) {
      const count = Math.max(
        p.left ? p.left.split(',').length : 0,
        p.right ? p.right.split(',').length : 0,
      );
      attrCountFromOrderList = Math.max(attrCountFromOrderList, count);
    }
  }

  return attrCountFromOrderList;
}

/**
 * Formats flattened text into readable HTML without language-specific keywords.
 * Uses structural markers (colons, lists, symbols) to determine breaks.
 */
function formatText(text: string): string {
  return (
    text
      // 1. Headers: Bold any capitalized phrase ending in a colon
      .replace(/(^|\s)([A-Z\u00C0-\u00FF][\w\s]{1,20}:)/g, '$1<br>$2<br>')

      // 2. Horizontal Rules: Replace ASCII dividers (***, ---, ===)
      .replace(/(\s*[*=-]{3,})\s*/g, '<br>$1<br>')

      // 3. Lists (Combined Rule 4 & 5):
      // Adds a break BEFORE "1.", "2 -", or "- "
      // Note: We use a lookahead to ensure the dash is followed by a space (bullet)
      // to avoid breaking negative numbers or hyphenated words.
      .replace(/(^|\s)(\d+\s*[-.)]|-\s+)/g, '<br>$2')

      // 4. Sentence Breaks (Rule 2 Refined):
      // Break after "." ONLY if followed by a space and a Capital letter,
      // AND ensure it isn't part of a list number (e.g., ignore " 2. ")
      // This uses a "negative lookbehind" logic to ignore digits before the period
      .replace(/([^0-9]\.{1,3}) (?=[A-Z\u00C0-\u00FF])/g, '$1<br>')

      // 5. Semicolons: Standard break for list-heavy text
      .replace(/;\s+/g, ';<br>')

      // 6. Cleanup: Remove duplicate breaks and trim
      .replace(/(<br>\s*){2,}/g, '<br>')
      .replace(/^<br>/, '')
      .trim()
  );
}

/**
 * Formats list of columns separated by commas text into readable HTML ordered list
 */
function formatList(text: string) {
  if (!text) return text;
  // make html ordered list with multicolumn to save vertical space

  return `<ol class="multi-column">
                 <li>${text.replaceAll(',', ',</li><li>')}</li>
              </ol>`;
}

/**
 * Formats long text properties with HTML line breaks for better readability.
 */
function formatPropertyText(type: string, left: string, right: string) {
  if (['Comments', 'Definition'].includes(type)) {
    return { left: formatText(left), right: formatText(right) };
  } else if (LIST_TYPES.includes(type)) {
    return { left: formatList(left), right: formatList(right) };
  } else {
    return { left, right };
  }
}

function determineChange(left: string, right: string): Change {
  if (left && right) return 'A';
  if (left) return 'I';
  if (right) return 'E';
  return '';
}

function determineView(type: string): View {
  if (type === 'Entity/Table' || type === 'Attribute/Column') return 'L/P';
  if (type === 'Entity' || type === 'Attribute') return 'L';
  if (type === 'Table' || type === 'Column') return 'P';
  return '';
}

function isAttributeType(type: string) {
  return ['Attribute/Column', 'Attribute', 'Column'].includes(type);
}

/**
 * Bottom-up pass to hoist "Calculated" status.
 * A parent is ONLY calculated if ALL its children and properties are calculated.
 */
function hoistCalculatedStatus(rows: EnrichedDiffRow[]) {
  const rowsById = new Map(rows.map(r => [r.id, r]));
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];
    if (row.parentId && !row.isCalculated) {
      const parent = rowsById.get(row.parentId);
      if (parent) parent.isCalculated = false;
    }
  }
}
