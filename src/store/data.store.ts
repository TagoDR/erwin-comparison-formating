import { atom, computed } from 'nanostores';

export interface ErwinRow {
  id?: string;
  parentId?: string;
  type: string;
  originalType?: string;
  prop: string;
  change: 'I' | 'A' | 'E' | '';
  view: string;
  indent: number;
  rawIndent: number;
  isHeader?: boolean;
  isGrouping?: boolean;
  isCalculated?: boolean;
  isUnderHiddenHeader?: boolean;
  isUDP?: boolean;
  leftModel: string;
  rightModel: string;
  attributeCount?: number;
  hasProperties?: boolean;
  hasSubObjects?: boolean;
}

/** Internal type used during data enrichment to ensure ID presence */
interface EnrichedRow extends ErwinRow {
  id: string;
  isHeader: boolean;
  isGrouping: boolean;
  isHeaderHidden: boolean;
}

export interface StatsSummary {
  type: string;
  total: number;
  inclusion: number;
  alteration: number;
  exclusion: number;
  calculated: number;
  largeTablesCount?: number;
}

export const rawData$ = atom<ErwinRow[]>([]);
export const isLoading$ = atom(false);
export const fileName$ = atom<string | null>(null);
export const isUserscript$ = atom<boolean>(false);

// Filters State
export const filterChange$ = atom<string>('');
export const filterName$ = atom<string>('');
export const hideAllProperties$ = atom<boolean>(false);
export const onlyEntities$ = atom<boolean>(false);
export const onlyEntitiesAndAttributes$ = atom<boolean>(false);
export const hideCalculated$ = atom<boolean>(true);

// Interaction State
export const showProperties$ = atom<boolean>(false);
export const toggledPropertiesIds$ = atom<Set<string>>(new Set());
export const hiddenSubObjectsIds$ = atom<Set<string>>(new Set());
export const checkedIds$ = atom<Set<string>>(new Set());
export const isFlipped$ = atom<boolean>(false);

// Useless rows must be removed/ignored/hidden
const GROUPING_KEYWORDS = [
  'Annotations',
  'Attribute Storage Objects',
  'Attributes',
  'Attributes/Columns',
  'Collections',
  'Columns',
  'Default Constraint Usages',
  'Default Values',
  'Domains',
  'ER Diagrams',
  'Entities',
  'Entities/Tables',
  'Fields',
  'Indexes',
  'Keys Groups',
  'Keys Groups/Indexes',
  'Partition Description Objects',
  'Physical Storage Objects',
  'Range Partitions Info Objects',
  'Range Partitions',
  'Relationships',
  'Sequences',
  'Subject Areas',
  'Subtype Symbols',
  'Tables',
  'Tablespaces',
  'Views',
];

// Object Identifier rows, will group properties
export const HEADERS_CONFIG = [
  { prop: 'O', object: 'Annotation', indentation: [3 * 3] },
  { prop: 'Atr', object: 'Attribute', indentation: [5 * 3] },
  { prop: 'Atr', object: 'Attribute/Column', indentation: [5 * 3] },
  { prop: 'Ent', object: 'Collection', indentation: [3 * 3] },
  { prop: 'Atr', object: 'Column', indentation: [5 * 3] },
  { prop: 'O', object: 'Default Constrain Usage', indentation: [7 * 3] },
  { prop: 'O', object: 'Default Value', indentation: [3 * 3] },
  { prop: 'O', object: 'Domain', indentation: [3 * 3] },
  { prop: 'M', object: 'ER Diagram', indentation: [3 * 3, 4 * 3], hide: true },
  { prop: 'Ent', object: 'Entity', indentation: [3 * 3] },
  { prop: 'Ent', object: 'Entity/Table', indentation: [3 * 3] },
  { prop: 'Atr', object: 'Field', indentation: [5 * 3, 6 * 3, 7 * 3, 8 * 3, 9 * 3, 10 * 3] },
  { prop: 'IX', object: 'Index', indentation: [5 * 3] },
  { prop: 'IX', object: 'Key Group/Index', indentation: [5 * 3] },
  { prop: 'O', object: 'Model', indentation: [3] },
  { prop: 'O', object: 'Physical Storage Object', indentation: [5 * 3, 7 * 3] },
  { prop: 'O', object: 'Range Partition', indentation: [6 * 3] },
  { prop: 'FK', object: 'Relationship', indentation: [5 * 3] },
  { prop: 'O', object: 'Sequence', indentation: [3 * 3] },
  { prop: 'M', object: 'Subject Area', indentation: [3 * 3], hide: true },
  { prop: 'FK', object: 'Subtype Symbol', indentation: [5 * 3] },
  { prop: 'Ent', object: 'Table', indentation: [3 * 3] },
  { prop: 'O', object: 'Tablespace', indentation: [3 * 3] },
  { prop: 'O', object: 'Theme', indentation: [3 * 3] },
  { prop: 'Ent', object: 'View', indentation: [3 * 3] },
];

/**
 * Computed store that process raw rows to add recursive parenting, status hoisting and filtering.
 * Optimized for performance with large data sets (50MB+).
 */
export const enrichedData$ = computed(rawData$, data => {
  const rowCount = data.length;
  if (rowCount === 0) return [];

  const rowsById = new Map<string, EnrichedRow>();
  const childrenMap = new Map<string, string[]>();

  // 1. Initial Pass: ID assignment, Classification, and Parentage (Top-Down)
  const headerStack: { id: string; indent: number; isGrouping: boolean; isHidden: boolean }[] = [];

  const processed: EnrichedRow[] = data.map((row, index) => {
    const cleanedType = row.type.trim();
    const isGrouping = GROUPING_KEYWORDS.some(kw => cleanedType === kw);
    const headerMatch = HEADERS_CONFIG.find(
      h => h.object === cleanedType && h.indentation.includes(row.rawIndent),
    );

    const enriched: EnrichedRow = {
      ...row,
      id: `row-${index}`,
      isHeader: isGrouping || !!headerMatch,
      isGrouping,
      isHeaderHidden: headerMatch?.hide || false,
      prop: headerMatch?.prop || '',
      isCalculated:
        row.leftModel === row.rightModel ||
        (row.leftModel.endsWith('[Calculated]') && row.rightModel.endsWith('[Calculated]')),
    };

    if (!enriched.view) {
      const type = enriched.type;
      if (type === 'Entity/Table' || type === 'Attribute/Column') enriched.view = 'L/P';
      else if (type === 'Entity' || type === 'Attribute') enriched.view = 'L';
      else if (type === 'Table' || type === 'Column') enriched.view = 'P';
    }

    // Stack management for parentId
    while (
      headerStack.length > 0 &&
      headerStack[headerStack.length - 1].indent >= enriched.indent
    ) {
      headerStack.pop();
    }

    let parentId = '';
    let isUnderHiddenHeader = enriched.isHeaderHidden || false;

    for (let j = headerStack.length - 1; j >= 0; j--) {
      const stackItem = headerStack[j];
      if (!stackItem.isGrouping && !parentId) parentId = stackItem.id;
      if (stackItem.isHidden) isUnderHiddenHeader = true;
    }

    enriched.parentId = parentId;
    enriched.isUnderHiddenHeader = isUnderHiddenHeader;

    if (parentId) {
      const list = childrenMap.get(parentId) || [];
      list.push(enriched.id);
      childrenMap.set(parentId, list);
    }

    if (enriched.isHeader) {
      headerStack.push({
        id: enriched.id,
        indent: enriched.indent,
        isGrouping: enriched.isGrouping,
        isHidden: enriched.isHeaderHidden,
      });
    }

    rowsById.set(enriched.id, enriched);
    return enriched;
  });

  // 2. Status Hoisting (Bottom-Up)
  for (let i = rowCount - 1; i >= 0; i--) {
    const row = processed[i];

    if (row.isHeader && !row.isGrouping) {
      const childrenIds = childrenMap.get(row.id) || [];
      if (childrenIds.length > 0) {
        let allCalculated = true;
        let hasProps = false;
        let hasSubs = false;
        let attrCount = 0;

        for (const cid of childrenIds) {
          const child = rowsById.get(cid);
          if (!child || child.isGrouping) continue;

          if (!child.isCalculated) allCalculated = false;
          if (!child.isHeader) hasProps = true;
          if (child.isHeader) hasSubs = true;

          if (
            child.isHeader &&
            (child.type === 'Attribute/Column' ||
              child.type === 'Attribute' ||
              child.type === 'Column')
          ) {
            attrCount++;
          }
        }
        row.isCalculated = allCalculated;
        row.hasProperties = hasProps;
        row.hasSubObjects = hasSubs;

        if (row.type === 'Entity/Table' || row.type === 'Entity' || row.type === 'Table') {
          for (const cid of childrenIds) {
            const child = rowsById.get(cid);
            if (child?.type === 'Column Order List' || child?.type === 'Attribute Order List') {
              const count = Math.max(
                child.leftModel ? child.leftModel.split(',').length : 0,
                child.rightModel ? child.rightModel.split(',').length : 0,
              );
              attrCount = Math.max(attrCount, count);
            }
          }
        }
        if (attrCount > 0) row.attributeCount = attrCount;
      }
    }

    if (row.parentId && !row.isHeader) {
      const parent = rowsById.get(row.parentId);
      if (parent) {
        if (row.type === 'Logical Only' && row.leftModel === 'true') parent.view = 'L';
        else if (row.type === 'Physical Only' && row.leftModel === 'true') parent.view = 'P';
      }
    }
  }

  // 3. Final polish and filter
  let currentPropCode = 'O';
  return processed
    .map(row => {
      if (row.isHeader && row.prop) currentPropCode = row.prop;
      return { ...row, prop: row.isHeader ? row.prop : currentPropCode };
    })
    .filter(row => {
      const isEmpty = !row.leftModel.trim() && !row.rightModel.trim();
      return !row.isGrouping && !isEmpty && !row.isUnderHiddenHeader;
    });
});

export const filteredData$ = computed(
  [
    enrichedData$,
    filterChange$,
    filterName$,
    onlyEntities$,
    onlyEntitiesAndAttributes$,
    showProperties$,
    hideCalculated$,
  ],
  (
    data,
    change,
    name,
    onlyEntities,
    onlyEntitiesAndAttributes,
    _showProperties,
    hideCalculated,
  ) => {
    const rowCount = data.length;
    if (rowCount === 0) return [];

    const rowsById = new Map<string, ErwinRow>();
    const childrenMap = new Map<string, string[]>();
    for (const r of data) {
      const id = r.id;
      if (!id) continue;
      rowsById.set(id, r);
      if (r.parentId) {
        const list = childrenMap.get(r.parentId) || [];
        list.push(id);
        childrenMap.set(r.parentId, list);
      }
    }

    let result = data;

    // 1. Strong Filter: Hide Calculated
    if (hideCalculated) {
      const familyOfCalculatedIds = new Set<string>();

      const addFamily = (id: string) => {
        if (familyOfCalculatedIds.has(id)) return;
        familyOfCalculatedIds.add(id);
        const children = childrenMap.get(id);
        if (children) {
          for (const cid of children) addFamily(cid);
        }
      };

      for (const r of data) {
        if (r.isCalculated && r.id) addFamily(r.id);
      }
      result = result.filter(r => r.id && !familyOfCalculatedIds.has(r.id));
    }

    // 2. Entity Filters (Drill-down mode)
    if (onlyEntities || onlyEntitiesAndAttributes) {
      const familyIds = new Set<string>();

      const addWithAncestors = (id: string) => {
        let currId: string | undefined = id;
        while (currId) {
          if (familyIds.has(currId)) break;
          familyIds.add(currId);
          currId = rowsById.get(currId)?.parentId;
        }
      };

      const addDescendants = (id: string) => {
        const children = childrenMap.get(id);
        if (children) {
          for (const cid of children) {
            if (!familyIds.has(cid)) {
              familyIds.add(cid);
              addDescendants(cid);
            }
          }
        }
      };

      for (const r of result) {
        const isTarget = onlyEntities
          ? r.isHeader && r.prop === 'Ent'
          : r.isHeader && (r.prop === 'Ent' || r.prop === 'Atr');

        if (isTarget && r.id) {
          addWithAncestors(r.id);
          addDescendants(r.id);
        }
      }
      // Filter out 'Model' node when onlyEntities is active, as requested.
      result = result.filter(r => r.id && familyIds.has(r.id) && r.type !== 'Model');
    }

    // 3. Change Filter
    if (change) {
      const matches = new Set<string>();

      const addDescendants = (id: string) => {
        matches.add(id);
        const children = childrenMap.get(id);
        if (children) {
          for (const cid of children) addDescendants(cid);
        }
      };

      for (const r of result) {
        if (r.isHeader && r.prop === 'Ent' && r.change === change && r.id) {
          addDescendants(r.id);
        }
      }
      result = result.filter(r => r.id && matches.has(r.id));
    }

    // 4. Name Filter
    if (name) {
      const search = name.toLowerCase();
      const hits = new Set<string>();

      for (const r of result) {
        const typeMatch = (r.originalType || r.type).toLowerCase().includes(search);
        const leftMatch = r.leftModel.toLowerCase().includes(search);
        const rightMatch = r.rightModel.toLowerCase().includes(search);

        if (r.isHeader && (typeMatch || leftMatch || rightMatch) && r.id) {
          hits.add(r.id);
        } else if (
          (r.type === 'Name' || r.type === 'Physical Name') &&
          (leftMatch || rightMatch) &&
          r.id
        ) {
          hits.add(r.id);
        }
      }

      const finalIds = new Set<string>();
      const addDescendants = (id: string) => {
        if (finalIds.has(id)) return;
        finalIds.add(id);
        const children = childrenMap.get(id);
        if (children) {
          for (const cid of children) addDescendants(cid);
        }
      };

      const addAncestors = (id: string) => {
        let currId: string | undefined = id;
        while (currId) {
          if (finalIds.has(currId)) break;
          finalIds.add(currId);
          currId = rowsById.get(currId)?.parentId;
        }
      };

      for (const id of hits) {
        const row = rowsById.get(id);
        if (!row) continue;
        const objectId = !row.isHeader && row.parentId ? row.parentId : id;
        addDescendants(objectId);
        addAncestors(objectId);
      }
      result = result.filter(r => r.id && finalIds.has(r.id));
    }

    return result;
  },
);

// Toggle functions
export const togglePropertiesGlobal = () => {
  const nextValue = !showProperties$.get();
  showProperties$.set(nextValue);
  toggledPropertiesIds$.set(new Set());
};

export const togglePropertiesIndividual = (id: string) => {
  const current = new Set(toggledPropertiesIds$.get());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  toggledPropertiesIds$.set(current);
};

export const toggleSubObjects = (id: string) => {
  const current = new Set(hiddenSubObjectsIds$.get());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  hiddenSubObjectsIds$.set(current);
};

export const toggleCheck = (id: string) => {
  const currentChecked = new Set(checkedIds$.get());
  const willBeChecked = !currentChecked.has(id);

  if (willBeChecked) {
    currentChecked.add(id);
    const currentHiddenSubs = new Set(hiddenSubObjectsIds$.get());
    currentHiddenSubs.add(id);
    hiddenSubObjectsIds$.set(currentHiddenSubs);

    const globalShow = showProperties$.get();
    const currentToggled = new Set(toggledPropertiesIds$.get());
    if (globalShow) currentToggled.add(id);
    else currentToggled.delete(id);
    toggledPropertiesIds$.set(currentToggled);
  } else {
    currentChecked.delete(id);
  }
  checkedIds$.set(currentChecked);
};

export const initializeVisibility = () => {
  showProperties$.set(false);
  toggledPropertiesIds$.set(new Set());
  hiddenSubObjectsIds$.set(new Set());
  isFlipped$.set(false);
};

export const toggleFlip = () => {
  isFlipped$.set(!isFlipped$.get());
};

export const statsSummary$ = computed([enrichedData$, isFlipped$], (data, isFlipped) => {
  const summary: Record<string, StatsSummary> = {
    Tables: {
      type: 'Tables',
      total: 0,
      inclusion: 0,
      alteration: 0,
      exclusion: 0,
      calculated: 0,
      largeTablesCount: 0,
    },
    Columns: {
      type: 'Columns',
      total: 0,
      inclusion: 0,
      alteration: 0,
      exclusion: 0,
      calculated: 0,
    },
  };

  for (const row of data) {
    if (!row.isHeader || row.isGrouping || !row.change) continue;
    const isTable = row.prop === 'Ent';
    const isColumn = row.prop === 'Atr';

    const increment = (key: string) => {
      const stats = summary[key];
      stats.total++;
      if (row.isCalculated) {
        stats.calculated++;
      } else {
        let change = row.change;
        if (isFlipped) {
          if (change === 'I') change = 'E';
          else if (change === 'E') change = 'I';
        }
        if (change === 'I') stats.inclusion++;
        if (change === 'A') stats.alteration++;
        if (change === 'E') stats.exclusion++;
      }
      if (isTable && row.attributeCount && row.attributeCount > 11) {
        stats.largeTablesCount = (stats.largeTablesCount || 0) + 1;
      }
    };

    if (isTable) increment('Tables');
    if (isColumn) increment('Columns');
  }
  return Object.values(summary);
});

if (typeof window !== 'undefined') {
  (window as unknown as { erwinData: Record<string, unknown> }).erwinData = {
    rawData$,
    enrichedData$,
    filteredData$,
    filterChange$,
    filterName$,
    showProperties$,
    hideCalculated$,
    onlyEntities$,
    onlyEntitiesAndAttributes$,
  };
}
