import { atom, computed } from 'nanostores';

export interface ErwinRow {
  id?: string;
  parentId?: string;
  type: string;
  prop: string;
  change: 'I' | 'A' | 'E' | '';
  view: string;
  leftModel: string;
  rightModel: string;
  indent: number;
  isHeader?: boolean;
  isCalculated?: boolean;
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
export const filterObject$ = atom<string>('');
export const filterName$ = atom<string>('');

// Interaction State
export const collapsedIds$ = atom<Set<string>>(new Set());
export const checkedIds$ = atom<Set<string>>(new Set());
export const showProperties$ = atom<boolean>(true);

const IGNORED_GROUPS = [
  'Atributes/Columns',
  'Foreign Keys',
  'Keys/Indexes',
  'Relationships',
  'Tablespaces',
  'Columns',
];

const HEADER_KEYWORDS = [
  'Entity/Table',
  'Entity',
  'Table',
  'Atribute/Column',
  'Attribute',
  'Column',
  'Foreign Key',
  'Relationship',
  'Key/Index',
  'Index',
  'Model',
];

export const getObjectShortCode = (type: string): string => {
  const t = type.toLowerCase();
  if (t.includes('entity') || t.includes('table')) return 'Ent';
  if (t.includes('attribute') || t.includes('column')) return 'Atr';
  if (t.includes('foreignkey') || t.includes('relationship')) return 'FK';
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
  const filtered = data.filter(row => !IGNORED_GROUPS.includes(row.type));

  // 1. Assign IDs and Parentage based on indentation
  const withInitialState = filtered.map((row, index) => {
    const isHeader = row.isHeader || HEADER_KEYWORDS.some(kw => row.type.includes(kw));

    // Clean type for headers: remove name if present (e.g. "Entity/Table: CLI" -> "Entity/Table")
    let type = row.type;
    if (isHeader && type.includes(':')) {
      type = type.split(':')[0].trim();
    }

    // Initial View Classification based on keywords
    let view = row.view;
    if (!view) {
      if (type.includes('Entity') && type.includes('Table')) view = 'L/P';
      else if (type.includes('Atribute') && type.includes('Column')) view = 'L/P';
      else if (type.includes('Entity') || type.includes('Atribute')) view = 'L';
      else if (type.includes('Table') || type.includes('Column')) view = 'P';
    }

    return {
      ...row,
      type,
      id: `row-${index}`,
      isHeader,
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
        } else if (parent.change && row.change) {
          // If both have status, we keep the parent's status as it is the definitive existence status.
          // No action needed, parent.change remains.
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

  // 3. Final polish: Prop code
  let lastPropCode = 'O';
  return hoisted.map(row => {
    const code = getObjectShortCode(row.type);
    if (code) lastPropCode = code;
    return { ...row, prop: lastPropCode };
  });
});

/**
 * Filtered data based on search, type, change filters and showProperties.
 */
export const filteredData$ = computed(
  [enrichedData$, filterChange$, filterObject$, filterName$, showProperties$],
  (data, change, obj, name, showProps) => {
    let result = data;

    if (!showProps) {
      result = result.filter(r => r.isHeader);
    }

    if (change) {
      result = result.filter(r => r.change === change);
    }

    if (obj) {
      if (obj === 'table') result = result.filter(r => r.prop === 'Ent' || r.isHeader);
      else if (obj === 'column') result = result.filter(r => r.prop === 'Atr' || r.isHeader);
    }

    if (name) {
      const search = name.toLowerCase();
      result = result.filter(r => r.type.toLowerCase().includes(search));
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
    if (!row.isHeader) return;

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
