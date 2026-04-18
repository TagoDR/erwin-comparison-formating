import { atom, computed } from 'nanostores';
import {
  type EnrichedDiffRow,
  GROUPING_KEYWORDS,
  HEADERS_CONFIG,
  type Prop,
  type StatsSummary,
} from '../types.js';

/**
 * Store for the raw rows parsed from the HTML report.
 */
export const rawData$ = atom<EnrichedDiffRow[]>([]);

/**
 * Loading state indicator.
 */
export const isLoading$ = atom(false);

/**
 * Name of the currently loaded file.
 */
export const fileName$ = atom<string | null>(null);

/**
 * Flag indicating if the app is running as a Tampermonkey userscript.
 */
export const isUserscript$ = atom<boolean>(false);

// Filters State
/** Change status filter ('I', 'A', 'E'). */
export const filterChange$ = atom<string>('');
/** Name/Type text search filter. */
export const filterName$ = atom<string>('');
/** Flag to hide all property rows globally. */
export const hideAllProperties$ = atom<boolean>(false);
/** Drill-down mode: show only Entity-level families. */
export const onlyEntities$ = atom<boolean>(false);
/** Drill-down mode: show only Entity and Attribute-level families. */
export const onlyEntitiesAndAttributes$ = atom<boolean>(false);
/** Strong filter: remove all identical objects. */
export const hideCalculated$ = atom<boolean>(true);

// Interaction State
/** Global toggle for property visibility. */
export const showProperties$ = atom<boolean>(false);
/** Set of header IDs where property visibility has been manually toggled. */
export const toggledPropertiesIds$ = atom<Set<string>>(new Set());
/** Set of header IDs where sub-object visibility has been manually hidden. */
export const hiddenSubObjectsIds$ = atom<Set<string>>(new Set());
/** Set of checked row IDs for batch operations. */
export const checkedIds$ = atom<Set<string>>(new Set());
/** Flag for global side-swapping (Left <-> Right). */
export const isFlipped$ = atom<boolean>(false);

/**
 * Computed store that process raw rows to add recursive parenting, status hoisting and filtering.
 * Optimized for performance with large data sets (50MB+).
 *
 * Logic flow:
 * 1. Top-Down: Assign IDs, classify headers vs properties, and establish parent-child links.
 * 2. Bottom-Up: Hoist status (e.g., Calculated) and calculate child counts (e.g., Attribute Count).
 * 3. Final Polish: Apply property classification inheritance and filter out useless rows.
 */
export const enrichedData$ = computed(rawData$, data => {
  const rowCount = data.length;
  if (rowCount === 0) return [];

  const rowsById = new Map<string, EnrichedDiffRow>();
  const childrenMap = new Map<string, string[]>();

  // 1. Initial Pass: ID assignment, Classification, and Parentage (Top-Down)
  const headerStack: { id: string; level: number; isGrouping: boolean; isHidden: boolean }[] = [];

  const processed: EnrichedDiffRow[] = data.map((row, index) => {
    const cleanedType = row.type.trim();
    const isGrouping = GROUPING_KEYWORDS.some(kw => cleanedType === kw);
    const headerMatch = HEADERS_CONFIG.find(
      h => h.object === cleanedType && h.indentation.includes(row.spaces),
    );

    const enriched: EnrichedDiffRow = {
      ...row,
      id: row.id || `row-${index}`,
      isHeader: isGrouping || !!headerMatch,
      isGrouping,
      isUnderHiddenHeader: headerMatch?.hide || false,
      prop: (headerMatch?.prop as Prop) || '',
      isCalculated:
        row.left === row.right ||
        (row.left.endsWith('[Calculated]') && row.right.endsWith('[Calculated]')),
    };

    if (!enriched.view) {
      const type = enriched.type;
      if (type === 'Entity/Table' || type === 'Attribute/Column') enriched.view = 'L/P';
      else if (type === 'Entity' || type === 'Attribute') enriched.view = 'L';
      else if (type === 'Table' || type === 'Column') enriched.view = 'P';
    }

    // Stack management for parentId
    while (headerStack.length > 0 && headerStack[headerStack.length - 1].level >= enriched.level) {
      headerStack.pop();
    }

    let parentId = '';
    let isUnderHiddenHeader = enriched.isUnderHiddenHeader || false;

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
        level: enriched.level,
        isGrouping: enriched.isGrouping || false,
        isHidden: !!headerMatch?.hide,
      });
    }

    rowsById.set(enriched.id, enriched);
    return enriched;
  });

  // 2. Status Hoisting (Bottom-Up)
  for (let i = processed.length - 1; i >= 0; i--) {
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
                child.left ? child.left.split(',').length : 0,
                child.right ? child.right.split(',').length : 0,
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
        if (row.type === 'Logical Only' && row.left === 'true') parent.view = 'L';
        else if (row.type === 'Physical Only' && row.left === 'true') parent.view = 'P';
      }
    }
  }

  // 3. Final polish and filter
  let currentPropCode: Prop = 'O';
  return processed
    .map(row => {
      if (row.isHeader && row.prop) currentPropCode = row.prop;
      return { ...row, prop: row.isHeader ? row.prop : currentPropCode };
    })
    .filter(row => {
      const isEmpty = !row.left.trim() && !row.right.trim();
      return !row.isGrouping && !isEmpty && !row.isUnderHiddenHeader;
    });
});

/**
 * Computed store that applies all UI filters to the enriched dataset.
 */
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

    const rowsById = new Map<string, EnrichedDiffRow>();
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
        const typeMatch = r.type.toLowerCase().includes(search);
        const leftMatch = r.left.toLowerCase().includes(search);
        const rightMatch = r.right.toLowerCase().includes(search);

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

/** Toggles property visibility globally. */
export const togglePropertiesGlobal = () => {
  const nextValue = !showProperties$.get();
  showProperties$.set(nextValue);
  toggledPropertiesIds$.set(new Set());
};

/** Toggles property visibility for a specific object header. */
export const togglePropertiesIndividual = (id: string) => {
  const current = new Set(toggledPropertiesIds$.get());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  toggledPropertiesIds$.set(current);
};

/** Toggles sub-object (children) visibility for a specific object header. */
export const toggleSubObjects = (id: string) => {
  const current = new Set(hiddenSubObjectsIds$.get());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  hiddenSubObjectsIds$.set(current);
};

/** Toggles selection state for a specific row. */
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

/** Resets all interactive visibility states. */
export const initializeVisibility = () => {
  showProperties$.set(false);
  toggledPropertiesIds$.set(new Set());
  hiddenSubObjectsIds$.set(new Set());
  isFlipped$.set(false);
};

/** Resets all filters to their default values. */
export const resetFilters = () => {
  filterChange$.set('');
  filterName$.set('');
  onlyEntities$.set(false);
  onlyEntitiesAndAttributes$.set(false);
  hideCalculated$.set(true);
  showProperties$.set(false);
  toggledPropertiesIds$.set(new Set());
  hiddenSubObjectsIds$.set(new Set());
};

/** Swaps left and right models globally. */
export const toggleFlip = () => {
  isFlipped$.set(!isFlipped$.get());
};

/** Computed store providing summary statistics for Tables and Columns. */
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
