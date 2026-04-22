import {
  type Change,
  type DiffRow,
  type EnrichedDiffRow,
  type EnrichedHeaderRow,
  type EnrichedPropertyRow,
  HEADERS_CONFIG,
  type HeaderKeyword,
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

  function process(obj: ModelObject, parentId = '') {
    const id = parentId
      ? `${parentId}|${obj.id.type}-${obj.id.left || obj.id.right}`
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
        for (const child of children) {
          process(child, id);
          if (isAttributeType(child.id.type)) {
            childAttrCount++;
          }
        }
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

    if (['Column Order List', 'Attribute Order List', 'Field Order'].includes(p.type)) {
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
 * Formats long text properties with HTML line breaks for better readability.
 */
function formatPropertyText(type: string, left: string, right: string) {
  if (['Comments', 'Definition'].includes(type)) {
    const format = (text: string) => {
      if (!text) return text;
      return text
        .replace(/ ([0-9]+\. \w+)/g, '<br> $1')
        .replace(/\.(^<br>) ([A-Z])/g, '.<br> $1')
        .replace(/;(^<br>) /g, ';<br> ')
        .replace(/ (\d* ?[-•] )/g, '<br> $1')
        .replace(/<br> *<br>/g, '<br>');
    };
    return { left: format(left), right: format(right) };
  } else if (['Column Order List', 'Attribute Order List', 'Field Order'].includes(type)) {
    const format = (text: string) => {
      if (!text) return text;
      // make html ordered list with multicolumn to save vertical space

      return (
        '<ol class="multi-column">' +
        text
          .split(',')
          .map(item => `<li>${item.trim()},</li>`)
          .join('') +
        '</ol>'
      );
    };
    return { left: format(left), right: format(right) };
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
