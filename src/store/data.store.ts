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
  isUDP?: boolean;
  leftModel: string;
  rightModel: string;
  attributeCount?: number;
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

// Interaction State
export const showProperties$ = atom<boolean>(false);
export const toggledPropertiesIds$ = atom<Set<string>>(new Set());
export const hiddenSubObjectsIds$ = atom<Set<string>>(new Set());
export const checkedIds$ = atom<Set<string>>(new Set());
export const isFlipped$ = atom<boolean>(false);

// Useless rows must be removed/ignored/hidden
const GROUPING_KEYWORDS = [
  // 'model',
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
  { prop: 'Atr', object: 'Attribute', indentation: [15] },
  { prop: 'Atr', object: 'Attribute/Column', indentation: [15] },
  { prop: 'Ent', object: 'Collection', indentation: [9] },
  { prop: 'Atr', object: 'Column', indentation: [15] },
  { prop: 'O', object: 'Default Constrain Usage', indentation: [18] },
  { prop: 'O', object: 'Default Value', indentation: [6] },
  { prop: 'O', object: 'Domain', indentation: [6] },
  { prop: 'M', object: 'ER Diagram', indentation: [6, 9] },
  { prop: 'Ent', object: 'Entity', indentation: [9] },
  { prop: 'Ent', object: 'Entity/Table', indentation: [9] },
  { prop: 'Atr', object: 'Field', indentation: [15, 18, 21, 24, 27, 32] },
  { prop: 'IX', object: 'Index', indentation: [15] },
  { prop: 'IX', object: 'Key Group/Index', indentation: [15] },
  { prop: 'O', object: 'Model', indentation: [3] },
  { prop: 'O', object: 'Physical Storage Object', indentation: [15, 18] },
  { prop: 'O', object: 'Range Partition', indentation: [18] },
  { prop: 'FK', object: 'Relationship', indentation: [15] },
  { prop: 'O', object: 'Sequence', indentation: [3] },
  { prop: 'M', object: 'Subject Area', indentation: [6] },
  { prop: 'FK', object: 'Subtype Symbol', indentation: [15] },
  { prop: 'Ent', object: 'Table', indentation: [9] },
  { prop: 'O', object: 'Tablespace', indentation: [6] },
  { prop: 'O', object: 'Theme', indentation: [6] },
  { prop: 'Ent', object: 'View', indentation: [9] },
];

/**
 * Computed store that process raw rows to add recursive parenting, status hoisting and filtering.
 */
export const enrichedData$ = computed(rawData$, data => {
  // 1. Assign IDs and Parentage based on indentation
  const withInitialState = data.map((row, index) => {
    // Clean type for matching and headers: remove name if present (e.g. "Entity/Table: CLI" -> "Entity/Table")
    const cleanedType = row.type.split(':')[0].trim();
    const isGrouping = GROUPING_KEYWORDS.some(kw => cleanedType === kw);

    const headerMatch = HEADERS_CONFIG.find(
      h => h.object === cleanedType && h.indentation.includes(row.rawIndent),
    );
    const isHeader = isGrouping || !!headerMatch;

    let type = row.type;
    const originalType = type;
    if (isHeader && !isGrouping && type.includes(':')) {
      type = cleanedType;
    }

    // Initial View Classification based on keywords
    let view = row.view;
    if (!view) {
      if (type === 'Entity/Table') view = 'L/P';
      else if (type === 'Attribute/Column') view = 'L/P';
      else if (type === 'Entity' || type === 'Attribute') view = 'L';
      else if (type === 'Table' || type === 'Column') view = 'P';
    }

    return {
      ...row,
      type,
      originalType,
      id: `row-${index}`,
      isHeader,
      isGrouping,
      view,
      prop: headerMatch?.prop || '',
      // A property is calculated if it's exactly the same AND ends with [Calculated] both sides
      isCalculated:
        row.leftModel === row.rightModel &&
        row.leftModel.endsWith('[Calculated]') &&
        row.rightModel.endsWith('[Calculated]'),
    };
  });

  const headerStack: { id: string; indent: number; isGrouping: boolean }[] = [];
  const withParents = withInitialState.map(row => {
    while (headerStack.length > 0 && headerStack[headerStack.length - 1].indent >= row.indent) {
      headerStack.pop();
    }

    // Find the nearest non-grouping parent
    let parentId = '';
    for (let i = headerStack.length - 1; i >= 0; i--) {
      if (!headerStack[i].isGrouping) {
        parentId = headerStack[i].id;
        break;
      }
    }

    if (row.isHeader) {
      headerStack.push({ id: row.id, indent: row.indent, isGrouping: row.isGrouping || false });
    }

    return { ...row, parentId };
  });

  // 2. Hoisting (Bottom-Up)
  // We hoist View classification and also determine if a Header is "fully calculated"
  // A header is fully calculated if ALL its descendants (properties and sub-headers) are calculated.
  const hoisted = [...withParents];

  // Track children for each header to verify "all descendants" rule
  const childrenMap = new Map<string, string[]>();
  hoisted.forEach(r => {
    if (r.parentId) {
      const list = childrenMap.get(r.parentId) || [];
      list.push(r.id);
      childrenMap.set(r.parentId, list);
    }
  });

  for (let i = hoisted.length - 1; i >= 0; i--) {
    const row = hoisted[i];

    if (row.isHeader && !row.isGrouping) {
      const childrenIds = childrenMap.get(row.id) || [];
      const nonGroupingChildren = childrenIds.filter(cid => {
        const child = hoisted.find(r => r.id === cid);
        return !child?.isGrouping;
      });

      if (nonGroupingChildren.length > 0) {
        // A header is calculated if all its non-grouping children are calculated
        row.isCalculated = nonGroupingChildren.every(cid => {
          const child = hoisted.find(r => r.id === cid);
          return child?.isCalculated;
        });
      }

      // Attribute Counting Logic for Entities/Tables
      const isEntity = row.type === 'Entity/Table' || row.type === 'Entity' || row.type === 'Table';
      if (isEntity) {
        let leftMaxOrder = 0;
        let rightMaxOrder = 0;

        // Method A: Check for Order properties
        const orderRows = hoisted.filter(
          c =>
            c.parentId === row.id &&
            (c.type === 'Column Order List' || c.type === 'Attribute Order List'),
        );

        const getCommaCount = (val: string) => {
          if (!val || val.trim() === '') return 0;
          return val.split(',').length;
        };

        orderRows.forEach(or => {
          leftMaxOrder = Math.max(leftMaxOrder, getCommaCount(or.leftModel));
          rightMaxOrder = Math.max(rightMaxOrder, getCommaCount(or.rightModel));
        });

        // Method B: Manual count of Attribute/Column rows under this Entity
        const childAttributes = childrenIds
          .map(cid => hoisted.find(r => r.id === cid))
          .filter(
            r =>
              r?.isHeader &&
              !r.isGrouping &&
              (r.type === 'Attribute/Column' || r.type === 'Attribute' || r.type === 'Column'),
          );

        const totalManualCount = childAttributes.length;

        const finalCount = Math.max(leftMaxOrder, rightMaxOrder, totalManualCount);
        if (finalCount > 0) {
          row.attributeCount = finalCount;
        }
      }
    }

    // Properties that are not headers contribute to parent view classification
    if (row.parentId) {
      const parentIndex = hoisted.findIndex(p => p.id === row.parentId);
      if (parentIndex !== -1) {
        const parent = hoisted[parentIndex];

        // Hoist View classification
        if (row.type === 'Logical Only' && row.leftModel === 'true') {
          parent.view = 'L';
        } else if (row.type === 'Physical Only' && row.leftModel === 'true') {
          parent.view = 'P';
        }
      }
    }
  }

  // 3. Final polish: Prop code propagation and Filter out grouping rows
  let currentPropCode = 'O';
  const result = hoisted
    .map(row => {
      if (row.isHeader && row.prop) {
        currentPropCode = row.prop;
      }
      return { ...row, prop: row.isHeader ? row.prop : currentPropCode };
    })
    .filter(row => !row.isGrouping);

  return result;
});

/**
 * Filtered data based on search, type and change filters.
 */
export const filteredData$ = computed(
  [enrichedData$, filterChange$, filterName$, onlyEntities$, onlyEntitiesAndAttributes$],
  (data, change, name, onlyEntities, onlyEntitiesAndAttributes) => {
    let result = data;

    // 1. Entity Filters
    if (onlyEntities) {
      result = result.filter(r => r.isHeader && r.prop === 'Ent');
    } else if (onlyEntitiesAndAttributes) {
      result = result.filter(r => r.isHeader && (r.prop === 'Ent' || r.prop === 'Atr'));
    }

    // 2. Change Filter (Rule 1: observe at table level only)
    if (change) {
      const matches = new Set<string>();
      const searchData = onlyEntities || onlyEntitiesAndAttributes ? result : data;

      searchData.forEach(r => {
        // Only apply filter to entities (prop === 'Ent')
        if (r.isHeader && r.prop === 'Ent' && r.change === change) {
          // Show header and all its descendants
          const addWithDescendants = (id: string) => {
            matches.add(id);
            data.forEach(child => {
              if (child.parentId === id) addWithDescendants(child.id);
            });
          };
          addWithDescendants(r.id);
        }
      });

      result = result.filter(r => matches.has(r.id));
    }

    // 3. Name Filter (Rule 3)
    if (name) {
      const search = name.toLowerCase();
      const hits = new Set<string>();
      const searchData = onlyEntities || onlyEntitiesAndAttributes ? result : data;

      searchData.forEach(r => {
        const typeMatch = (r.originalType || r.type).toLowerCase().includes(search);
        const leftMatch = r.leftModel.toLowerCase().includes(search);
        const rightMatch = r.rightModel.toLowerCase().includes(search);

        // Match on identifier line (header) or Name/Physical Name properties
        if (r.isHeader && (typeMatch || leftMatch || rightMatch)) {
          hits.add(r.id);
        } else if ((r.type === 'Name' || r.type === 'Physical Name') && (leftMatch || rightMatch)) {
          hits.add(r.id);
        }
      });

      // Expanded results: full object (header + descendants) + all ancestors
      const finalIds = new Set<string>();

      const addWithDescendants = (id: string) => {
        if (finalIds.has(id)) return;
        finalIds.add(id);
        data.forEach(r => {
          if (r.parentId === id) addWithDescendants(r.id);
        });
      };

      const addAncestors = (id: string) => {
        let curr = data.find(r => r.id === id);
        while (curr?.parentId) {
          finalIds.add(curr.parentId);
          curr = data.find(r => r.id === curr?.parentId);
        }
      };

      hits.forEach(id => {
        const row = data.find(r => r.id === id);
        if (!row) return;

        // If it's a property (like Name), start from its parent header
        const objectId = !row.isHeader && row.parentId ? row.parentId : id;
        addWithDescendants(objectId);
        addAncestors(objectId);
      });

      result = result.filter(r => finalIds.has(r.id));
    }

    return result;
  },
);

// Toggle functions
export const togglePropertiesGlobal = () => {
  const nextValue = !showProperties$.get();
  showProperties$.set(nextValue);
  // Reset individual toggles when global toggle is used
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
    // When checking, ensure its sub-objects are hidden
    const currentHiddenSubs = new Set(hiddenSubObjectsIds$.get());
    currentHiddenSubs.add(id);
    hiddenSubObjectsIds$.set(currentHiddenSubs);

    // For properties, we want them hidden.
    // If global showProperties is true, we must add to toggled set to hide it.
    // If global showProperties is false, we must remove from toggled set to hide it.
    const globalShow = showProperties$.get();
    const currentToggled = new Set(toggledPropertiesIds$.get());
    if (globalShow) {
      currentToggled.add(id);
    } else {
      currentToggled.delete(id);
    }
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

// Computed stats for the stats panel
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

  data.forEach(row => {
    if (!row.isHeader || row.isGrouping || !row.change) return;

    const isTable = row.prop === 'Ent';
    const isColumn = row.prop === 'Atr';

    const increment = (key: string) => {
      summary[key].total++;
      if (row.isCalculated) {
        summary[key].calculated++;
      } else {
        let change = row.change;
        if (isFlipped) {
          if (change === 'I') change = 'E';
          else if (change === 'E') change = 'I';
        }

        if (change === 'I') summary[key].inclusion++;
        if (change === 'A') summary[key].alteration++;
        if (change === 'E') summary[key].exclusion++;
      }

      // Track tables with > 11 attributes
      if (isTable && row.attributeCount && row.attributeCount > 11) {
        summary.Tables.largeTablesCount = (summary.Tables.largeTablesCount || 0) + 1;
      }
    };

    if (isTable) increment('Tables');
    if (isColumn) increment('Columns');
  });

  return Object.values(summary);
});

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).erwinData = {
    rawData$,
    enrichedData$,
    filteredData$,
    filterChange$,
    filterName$,
    showProperties$,
    onlyEntities$,
    onlyEntitiesAndAttributes$,
  };
}
