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
  isHeader?: boolean;
  isGrouping?: boolean;
  isCalculated?: boolean;
  leftModel: string;
  rightModel: string;
}

export interface StatsSummary {
  type: string;
  total: number;
  inclusion: number;
  alteration: number;
  exclusion: number;
}

export const rawData$ = atom<ErwinRow[]>([]);
export const isLoading$ = atom(false);
export const fileName$ = atom<string | null>(null);

// Filters State
export const filterChange$ = atom<string>('');
export const filterName$ = atom<string>('');

// Interaction State
export const collapsedIds$ = atom<Set<string>>(new Set());
export const checkedIds$ = atom<Set<string>>(new Set());
export const showProperties$ = atom<boolean>(true);

const GROUPING_KEYWORDS = [
  'Entities/Tables',
  'Entities',
  'Tables',
  'Attributes/Columns',
  'Attributes',
  'Columns',
  'Foreign Keys',
  'Keys/Indexes',
  'Keys',
  'Indexes',
  'Tablespaces',
  'Relationships',
  'Subject Areas',
];

const HEADER_KEYWORDS = [
  'Entity/Table',
  'Entity',
  'Table',
  'Attribute/Column',
  'Attribute',
  'Column',
  'Foreign Key',
  'Relationship',
  'Key/Index',
  'Index',
  'Key',
  'Model',
  'Subject Area',
  'View',
  'Sequence',
];

export const getObjectShortCode = (type: string): string => {
  const t = type.toLowerCase();
  if (t.includes('entity') || t.includes('table')) return 'Ent';
  if (t.includes('attribute') || t.includes('column')) return 'Atr';
  if (t.includes('foreign key') || t.includes('relationship')) return 'FK';
  if (t.includes('tablespace')) return 'TB';
  if (t.includes('index')) return 'IX';
  if (t.includes('view')) return 'VW';
  if (t.includes('model')) return 'M';
  return '';
};

/**
 * Computed store that process raw rows to add recursive parenting, status hoisting and filtering.
 */
export const enrichedData$ = computed(rawData$, data => {
  // 1. Assign IDs and Parentage based on indentation
  const withInitialState = data.map((row, index) => {
    // Clean type for matching and headers: remove name if present (e.g. "Entity/Table: CLI" -> "Entity/Table")
    const cleanedType = row.type.split(':')[0].trim();
    const isGrouping = GROUPING_KEYWORDS.some(kw => cleanedType === kw);
    const isHeader = isGrouping || row.isHeader || HEADER_KEYWORDS.some(kw => cleanedType === kw);

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
      isCalculated:
        row.leftModel.includes('[Calculated]') && row.rightModel.includes('[Calculated]'),
    };
  });

  const headerStack: { id: string; indent: number }[] = [];
  const withParents = withInitialState.map(row => {
    while (headerStack.length > 0 && headerStack[headerStack.length - 1].indent >= row.indent) {
      headerStack.pop();
    }

    const parentId = headerStack.length > 0 ? headerStack[headerStack.length - 1].id : '';

    if (row.isHeader) {
      headerStack.push({ id: row.id, indent: row.indent });
    }

    return { ...row, parentId };
  });

  // 2. Status & View Hoisting (Bottom-Up)
  const hoisted = [...withParents];

  for (let i = hoisted.length - 1; i >= 0; i--) {
    const row = hoisted[i];
    if (row.parentId) {
      const parentIndex = hoisted.findIndex(p => p.id === row.parentId);
      if (parentIndex !== -1) {
        const parent = hoisted[parentIndex];

        // Hoist Change Status ONLY if parent doesn't have its own status from presence.
        // This ensures the object identifier line's status is preserved.
        if (!parent.change && row.change) {
          parent.change = row.change;
        }

        // Hoist View classification
        if (row.type === 'Logical Only' && row.leftModel === 'true') {
          parent.view = 'L';
        } else if (row.type === 'Physical Only' && row.leftModel === 'true') {
          parent.view = 'P';
        }
      }
    }
  }

  // 3. Final polish: Prop code and Filter out empty grouping rows
  let lastPropCode = 'O';
  return hoisted
    .map(row => {
      const code = row.isHeader ? getObjectShortCode(row.type) : '';
      if (code) lastPropCode = code;
      return { ...row, prop: lastPropCode };
    })
    .filter(row => {
      // Omit grouping rows that have no change (meaning all children are unchanged)
      // and have no model data.
      return !(row.isGrouping && !row.change && !row.leftModel && !row.rightModel);
    });
});

/**
 * Filtered data based on search, type, change filters and showProperties.
 */
export const filteredData$ = computed(
  [enrichedData$, filterChange$, filterName$, showProperties$],
  (data, change, name, showProps) => {
    let result = data;

    // 1. Change Filter (Rule 1: observe at table level)
    if (change) {
      const validTableIds = new Set<string>();
      data.forEach(r => {
        // Find tables (Ent) that have the requested change status
        if (r.prop === 'Ent' && r.isHeader && r.change === change) {
          validTableIds.add(r.id);
        }
      });

      // Show table and all its contents
      const matches = new Set<string>();
      const addRowAndChildren = (id: string) => {
        matches.add(id);
        data.forEach(r => {
          if (r.parentId === id) addRowAndChildren(r.id);
        });
      };

      validTableIds.forEach(id => {
        addRowAndChildren(id);
      });
      result = result.filter(r => matches.has(r.id));
    }

    // 2. Name Filter (Rule 3)
    if (name) {
      const search = name.toLowerCase();
      const hits = new Set<string>();

      data.forEach(r => {
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

    if (!showProps) {
      result = result.filter(r => r.isHeader);
    }

    return result;
  },
);

// Toggle functions
export const toggleCollapse = (id: string) => {
  const current = new Set(collapsedIds$.get());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  collapsedIds$.set(current);
};

export const toggleCheck = (id: string) => {
  const currentChecked = new Set(checkedIds$.get());
  const willBeChecked = !currentChecked.has(id);

  if (willBeChecked) {
    currentChecked.add(id);
    // When checking, ensure it's collapsed (add to set, don't toggle)
    const currentCollapsed = new Set(collapsedIds$.get());
    currentCollapsed.add(id);
    collapsedIds$.set(currentCollapsed);
  } else {
    currentChecked.delete(id);
    // Optional: should we expand when unchecking?
    // For now, following "keep closed" philosophy, we leave collapse state alone.
  }

  checkedIds$.set(currentChecked);
};

export const toggleProperties = () => {
  showProperties$.set(!showProperties$.get());
};

// Computed stats for the stats panel
export const statsSummary$ = computed(enrichedData$, data => {
  const summary: Record<string, StatsSummary> = {
    Tabelas: {
      type: 'Tabelas',
      total: 0,
      inclusion: 0,
      alteration: 0,
      exclusion: 0,
    },
    Colunas: {
      type: 'Colunas',
      total: 0,
      inclusion: 0,
      alteration: 0,
      exclusion: 0,
    },
  };

  // Track which headers have real (non-calculated) changes
  const hasRealChange = new Set<string>();
  data.forEach(row => {
    if (!row.isHeader && row.change && !row.isCalculated) {
      let currentParentId: string | undefined = row.parentId;
      while (currentParentId) {
        hasRealChange.add(currentParentId);
        const parent = data.find(r => r.id === currentParentId);
        currentParentId = parent?.parentId;
      }
    }
  });

  data.forEach(row => {
    if (!row.isHeader || row.isGrouping) return;

    const isTable = row.prop === 'Ent';
    const isColumn = row.prop === 'Atr';

    if (row.change === 'A' && !hasRealChange.has(row.id)) {
      return;
    }

    const increment = (key: string) => {
      summary[key].total++;
      if (row.change === 'I') summary[key].inclusion++;
      if (row.change === 'A') summary[key].alteration++;
      if (row.change === 'E') summary[key].exclusion++;
    };

    if (isTable) increment('Tabelas');
    if (isColumn) increment('Colunas');
  });

  return Object.values(summary);
});
