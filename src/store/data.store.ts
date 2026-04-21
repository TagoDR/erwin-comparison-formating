import { atom, computed } from 'nanostores';
import type { EnrichedDiffRow, ModelObject, PropertyDefinition, StatsSummary } from '../types.js';
import { flattenAndEnrichModel } from './data-enricher.js';
import { filterAndApplyVisibility } from './data-filter.js';

declare global {
  interface Window {
    erwinData: Record<string, unknown>;
  }
}

/**
 * Root store for the parsed structured model.
 * @internal Used only during initial ingestion to avoid holding two large trees in memory.
 */
const modelData$ = atom<ModelObject | null>(null);

/** Loading state indicator. */
export const isLoading$ = atom(false);
/** Name of the currently loaded file. */
export const fileName$ = atom<string | null>(null);
/** Flag indicating if the app is running as a Tampermonkey userscript. */
export const isUserscript$ = atom<boolean>(false);

// --- Filters State ---
export const filterChange$ = atom<string>('');
export const filterName$ = atom<string>('');
export const onlyEntities$ = atom<boolean>(false);
export const onlyEntitiesAndAttributes$ = atom<boolean>(false);
export const hideCalculated$ = atom<boolean>(true);
export const hiddenProperties$ = atom<Set<string>>(new Set());

// --- Interaction State ---
export const showProperties$ = atom<boolean>(false);
export const toggledPropertiesIds$ = atom<Set<string>>(new Set());
export const hiddenSubObjectsIds$ = atom<Set<string>>(new Set());
export const checkedIds$ = atom<Set<string>>(new Set());
export const isFlipped$ = atom<boolean>(false);
export const isPropertyDrawerOpen$ = atom<boolean>(false);

/**
 * Flattened and enriched data.
 * This is the primary data source for the application.
 */
export const enrichedData$ = atom<EnrichedDiffRow[]>([]);

/**
 * Pre-calculated Map of rows by ID for O(1) lookups during filtering.
 */
export const rowsById$ = computed(enrichedData$, data => {
  const map = new Map<string, EnrichedDiffRow>();
  for (const r of data) map.set(r.id, r);
  return map;
});

/**
 * Pre-calculated Map of parent-child relationships for O(1) traversal during filtering.
 */
export const childrenMap$ = computed(enrichedData$, data => {
  const map = new Map<string, string[]>();
  for (const r of data) {
    if (r.parentId) {
      const list = map.get(r.parentId) || [];
      list.push(r.id);
      map.set(r.parentId, list);
    }
  }
  return map;
});

/**
 * Filtered data optimized for rendering.
 * Combines search, change filters, and hierarchical visibility in a single pass.
 */
export const filteredData$ = computed(
  [
    enrichedData$,
    rowsById$,
    childrenMap$,
    filterChange$,
    filterName$,
    onlyEntities$,
    onlyEntitiesAndAttributes$,
    hideCalculated$,
    hiddenProperties$,
    showProperties$,
    toggledPropertiesIds$,
    hiddenSubObjectsIds$,
  ],
  (
    data,
    rowsById,
    childrenMap,
    change,
    name,
    onlyEnt,
    onlyEntAtr,
    hideCalc,
    hiddenProps,
    globalShowProps,
    toggledProps,
    hiddenSubs,
  ) => {
    return filterAndApplyVisibility(
      data,
      {
        change,
        name,
        onlyEntities: onlyEnt,
        onlyEntitiesAndAttributes: onlyEntAtr,
        hideCalculated: hideCalc,
        hiddenProps,
      },
      {
        globalShowProps,
        toggledProps,
        hiddenSubs,
      },
      rowsById,
      childrenMap,
    );
  },
);

/**
 * Extracts unique property definitions organized as a tree (grouped by Parent Type).
 */
export const uniqueProperties$ = computed(enrichedData$, data => {
  const parentTypeOrder: string[] = [];
  const propertyMap = new Map<string, PropertyDefinition[]>();
  const seenPropertyKeys = new Set<string>();

  for (const r of data) {
    if (r.isHeader || !r.parentType) continue;

    const parentType = r.parentType;
    const key = `${r.type}|${r.spaces}|${parentType}`;

    if (!parentTypeOrder.includes(parentType)) {
      parentTypeOrder.push(parentType);
    }

    if (!seenPropertyKeys.has(key)) {
      seenPropertyKeys.add(key);
      const list = propertyMap.get(parentType) || [];
      list.push({ key, type: r.type, spaces: r.spaces, parentType });
      propertyMap.set(parentType, list);
    }
  }

  return parentTypeOrder.map(parentType => ({
    parentType,
    children: propertyMap.get(parentType) || [],
  }));
});

/**
 * Processes and loads raw model data into the enriched store.
 * Immediately clears the hierarchical model to free up memory.
 */
export function setModelData(model: ModelObject | null) {
  if (!model) {
    enrichedData$.set([]);
    modelData$.set(null);
    return;
  }

  // Flatten and enrich (CPU intensive)
  const enriched = flattenAndEnrichModel(model);
  enrichedData$.set(enriched);

  // Clear initial tree to free memory (The 50MB Rule)
  modelData$.set(null);
}

/**
 * Toggles all properties in a specific parent group.
 * If at least one is visible, it hides all. If all are hidden, it shows all.
 */
export const togglePropertyGroup = (parentType: string) => {
  const groups = uniqueProperties$.get();
  const group = groups.find(g => g.parentType === parentType);
  if (!group) return;

  const currentHidden = new Set(hiddenProperties$.get());
  const allKeys = group.children.map(p => p.key);
  const anyVisible = allKeys.some(k => !currentHidden.has(k));

  if (anyVisible) {
    // Hide all in this group
    for (const k of allKeys) currentHidden.add(k);
  } else {
    // Show all in this group
    for (const k of allKeys) currentHidden.delete(k);
  }
  hiddenProperties$.set(currentHidden);
};

/**
 * Toggles a property visibility in the hidden set by its unique key.
 * @param key Format: `${type}|${spaces}|${parentType}`
 */
export const toggleProperty = (key: string) => {
  const current = new Set(hiddenProperties$.get());
  if (current.has(key)) current.delete(key);
  else current.add(key);
  hiddenProperties$.set(current);
};

/**
 * Permanently hides all discovered properties across all object types.
 */
export const hideAllProperties = () => {
  const allKeys = new Set<string>();
  uniqueProperties$.get().forEach(group => {
    group.children.forEach(p => {
      allKeys.add(p.key);
    });
  });
  hiddenProperties$.set(allKeys);
};

/**
 * Shows all properties that were previously hidden by name.
 */
export const resetHiddenProperties = () => hiddenProperties$.set(new Set());

/**
 * Toggles property visibility for a specific object instance (Left Click interaction).
 * @param id The unique ID of the header row.
 */
export const togglePropertiesIndividual = (id: string) => {
  const current = new Set(toggledPropertiesIds$.get());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  toggledPropertiesIds$.set(current);
};

/**
 * Toggles sub-object (children) visibility for a specific object instance (Right Click interaction).
 * @param id The unique ID of the header row.
 */
export const toggleSubObjects = (id: string) => {
  const current = new Set(hiddenSubObjectsIds$.get());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  hiddenSubObjectsIds$.set(current);
};

/**
 * Toggles row selection for batch operations.
 * Also handles automatic hiding of descendants when checked.
 * @param id The unique ID of the row.
 */
export const toggleCheck = (id: string) => {
  const currentChecked = new Set(checkedIds$.get());
  const becomingChecked = !currentChecked.has(id);

  const propsToggled = new Set(toggledPropertiesIds$.get());
  const subsHidden = new Set(hiddenSubObjectsIds$.get());

  if (becomingChecked) {
    currentChecked.add(id);
    const globalShow = showProperties$.get();
    if (globalShow) propsToggled.add(id);
    else propsToggled.delete(id);

    const row = enrichedData$.get().find(r => r.id === id);
    if (row) {
      const onlyEnt = onlyEntities$.get();
      const onlyEntAtr = onlyEntitiesAndAttributes$.get();
      let baseSubHidden = false;
      if (onlyEnt && row.prop === 'Ent' && row.hasSubObjects) baseSubHidden = true;
      if (onlyEntAtr && row.prop === 'Atr' && row.hasSubObjects) baseSubHidden = true;

      if (baseSubHidden) subsHidden.delete(id);
      else subsHidden.add(id);
    }
  } else {
    currentChecked.delete(id);
    propsToggled.delete(id);
    subsHidden.delete(id);
  }

  toggledPropertiesIds$.set(propsToggled);
  hiddenSubObjectsIds$.set(subsHidden);
  checkedIds$.set(currentChecked);
};

export const initializeVisibility = () => {
  showProperties$.set(false);
  toggledPropertiesIds$.set(new Set());
  hiddenSubObjectsIds$.set(new Set());
  isFlipped$.set(false);
  resetHiddenProperties();
};

export const resetFilters = () => {
  filterChange$.set('');
  filterName$.set('');
  onlyEntities$.set(false);
  onlyEntitiesAndAttributes$.set(false);
  hideCalculated$.set(true);
  initializeVisibility();
};

export const setOnlyEntities = (val: boolean) => {
  onlyEntities$.set(val);
  if (val) {
    onlyEntitiesAndAttributes$.set(false);
    hiddenSubObjectsIds$.set(new Set());
    toggledPropertiesIds$.set(new Set());
  }
};

export const setOnlyEntitiesAndAttributes = (val: boolean) => {
  onlyEntitiesAndAttributes$.set(val);
  if (val) {
    onlyEntities$.set(false);
    hiddenSubObjectsIds$.set(new Set());
    toggledPropertiesIds$.set(new Set());
  }
};

export const toggleFlip = () => isFlipped$.set(!isFlipped$.get());
export const togglePropertiesGlobal = () => {
  showProperties$.set(!showProperties$.get());
  toggledPropertiesIds$.set(new Set());
};

/** Statistics summary used by the app-stats component. */
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
    if (!row.isHeader || !row.change) continue;
    const isTable = row.prop === 'Ent';
    const isColumn = row.prop === 'Atr';
    const key = isTable ? 'Tables' : isColumn ? 'Columns' : null;
    if (!key) continue;

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
  }
  return Object.values(summary);
});

export const isLongNamingConvention$ = computed(enrichedData$, data => {
  const modelRow = data[0];
  if (!modelRow) return false;
  const sgbds = ['oracle', 'mysql', 'mongo', 'postgres', 'hive'];
  const modelName = `${modelRow.left} ${modelRow.right}`.toLowerCase();
  return sgbds.some(sgbd => modelName.includes(sgbd));
});

/** Copies the names of all identified tables to the clipboard. */
export const copyTablesToClipboard = () => {
  const tables = enrichedData$
    .get()
    .filter(row => row.isHeader && row.prop === 'Ent' && (row.left || row.right))
    .map(row => row.left || row.right)
    .filter((v, i, a) => v && a.indexOf(v) === i)
    .join('\n');

  if (tables) {
    navigator.clipboard.writeText(tables);
    return true;
  }
  return false;
};

// Global export for debugging/userscript access
if (typeof window !== 'undefined') {
  window.erwinData = {
    modelData$,
    enrichedData$,
    filteredData$,
    filterChange$,
    filterName$,
    showProperties$,
    hideCalculated$,
    onlyEntities$,
    onlyEntitiesAndAttributes$,
    uniqueProperties$,
    hiddenProperties$,
    isPropertyDrawerOpen$,
    isLongNamingConvention$,
  };
}
