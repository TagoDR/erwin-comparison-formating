import { atom, computed } from 'nanostores';
import {
  type EnrichedDiffRow,
  HEADERS_CONFIG,
  type ModelObject,
  type Prop,
  type PropertyDefinition,
  type StatsSummary,
} from '../types.js';

/**
 * Root store for the parsed structured model.
 */
export const modelData$ = atom<ModelObject | null>(null);

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
/** Drill-down mode: show only Entity-level families. */
export const onlyEntities$ = atom<boolean>(false);
/** Drill-down mode: show only Entity and Attribute-level families. */
export const onlyEntitiesAndAttributes$ = atom<boolean>(false);
/** Strong filter: remove all identical objects. */
export const hideCalculated$ = atom<boolean>(true);
/** Set of property keys to be permanently hidden. Key format: `${type}|${spaces}|${parentType}` */
export const hiddenProperties$ = atom<Set<string>>(new Set());

// Interaction State
/** Global toggle for property visibility. */
export const showProperties$ = atom<boolean>(false);
/** Set of header IDs where property visibility has been manually toggled. */
export const toggledPropertiesIds$ = atom<Set<string>>(new Set());
/** Set of header IDs where sub-object visibility has been manually hidden. */
export const hiddenSubObjectsIds$ = atom<Set<string>>(new Set());
/** Set of checked row IDs for batch operations. */
export const checkedIds$ = atom<Set<string>>(new Set());
/** Flag for global side-swapping (Work <-> Reference). */
export const isFlipped$ = atom<boolean>(false);
/** Controls the visibility of the left-side property drawer. */
export const isPropertyDrawerOpen$ = atom<boolean>(false);

/**
 * Flattened and enriched data derived from the hierarchical modelData$.
 */
export const enrichedData$ = computed(modelData$, model => {
  if (!model) return [];

  const result: EnrichedDiffRow[] = [];

  function process(obj: ModelObject, parentId: string = '') {
    const headerMatch = HEADERS_CONFIG.find(
      h => h.object === obj.id.type && h.indentation.includes(obj.id.spaces),
    );

    const id = parentId
      ? `${parentId}|${obj.id.type}-${obj.id.left || obj.id.right}`
      : `root-${obj.id.type}`;

    // 1. Enrich Header
    const enrichedHeader: EnrichedDiffRow = {
      ...obj.id,
      id,
      parentId,
      prop: (headerMatch?.prop as Prop) || '',
      change: '',
      view: '',
      isHeader: true,
      isGrouping: false,
      isUDP: false,
      // A header is calculated ONLY if its own identifier matches AND all descendants match (hoisted later)
      isCalculated: obj.id.left === obj.id.right,
    };

    if (obj.id.type === 'Entity/Table' || obj.id.type === 'Attribute/Column')
      enrichedHeader.view = 'L/P';
    else if (obj.id.type === 'Entity' || obj.id.type === 'Attribute') enrichedHeader.view = 'L';
    else if (obj.id.type === 'Table' || obj.id.type === 'Column') enrichedHeader.view = 'P';

    // Presence-based change detection
    if (obj.id.left && obj.id.right) enrichedHeader.change = 'A';
    else if (obj.id.left) enrichedHeader.change = 'I';
    else if (obj.id.right) enrichedHeader.change = 'E';

    // 2. Process Properties
    let attrCountFromOrderList = 0;
    const enrichedProperties: EnrichedDiffRow[] = (obj.properties || []).map((p, idx) => {
      // UDP Highlighting logic
      const isUDP = p.type.includes('.Physical.') || p.type.includes('.Logical.');

      // Support for attribute/column counting via Erwin's order list properties
      if (['Column Order List', 'Attribute Order List', 'Field Order'].includes(p.type)) {
        const count = Math.max(
          p.left ? p.left.split(',').length : 0,
          p.right ? p.right.split(',').length : 0,
        );
        attrCountFromOrderList = Math.max(attrCountFromOrderList, count);
      }

      const prop: EnrichedDiffRow = {
        ...p,
        id: `${id}-p-${idx}`,
        parentId: id,
        parentType: obj.id.type,
        prop: enrichedHeader.prop,
        change: p.left && p.right ? 'A' : p.left ? 'I' : 'E',
        view: '',
        isHeader: false,
        isGrouping: false,
        isUDP,
        isCalculated:
          p.left === p.right ||
          (p.left.endsWith('[Calculated]') && p.right.endsWith('[Calculated]')),
      };

      // special view overrides via property values
      if (p.type === 'Logical Only' && p.left === 'true') enrichedHeader.view = 'L';
      if (p.type === 'Physical Only' && p.left === 'true') enrichedHeader.view = 'P';

      return prop;
    });

    result.push(enrichedHeader);
    result.push(...enrichedProperties);

    // 3. Process Children
    let childAttrCount = 0;
    let hasActualSubObjects = false;
    if (obj.children) {
      for (const children of Object.values(obj.children)) {
        if (!children || children.length === 0) continue;
        hasActualSubObjects = true;
        for (const child of children) {
          process(child, id);
          if (['Attribute/Column', 'Attribute', 'Column'].includes(child.id.type)) {
            childAttrCount++;
          }
        }
      }
    }

    enrichedHeader.hasSubObjects = hasActualSubObjects;
    enrichedHeader.hasProperties = enrichedProperties.length > 0;

    // Final Attribute Count logic: prefers actual child objects, falls back to order list
    const finalAttrCount = Math.max(childAttrCount, attrCountFromOrderList);
    if (finalAttrCount > 0 && enrichedHeader.prop === 'Ent') {
      enrichedHeader.attributeCount = finalAttrCount;
    }
  }

  process(model);

  // Status Hoisting Post-Pass (Bottom-Up)
  const rowsById = new Map(result.map(r => [r.id, r]));
  for (let i = result.length - 1; i >= 0; i--) {
    const row = result[i];
    if (row.parentId && !row.isCalculated) {
      const parent = rowsById.get(row.parentId);
      if (parent) parent.isCalculated = false;
    }
  }

  return result;
});

/**
 * Filter logic optimized for structured data.
 */
export const filteredData$ = computed(
  [
    enrichedData$,
    filterChange$,
    filterName$,
    onlyEntities$,
    onlyEntitiesAndAttributes$,
    hideCalculated$,
    hiddenProperties$,
  ],
  (data, change, name, onlyEntities, onlyEntitiesAndAttributes, hideCalculated, hiddenProps) => {
    if (data.length === 0) return [];

    const rowsById = new Map<string, EnrichedDiffRow>();
    const childrenMap = new Map<string, string[]>();
    for (const r of data) {
      rowsById.set(r.id, r);
      if (r.parentId) {
        const list = childrenMap.get(r.parentId) || [];
        list.push(r.id);
        childrenMap.set(r.parentId, list);
      }
    }

    let current = data;

    // 1. Hide Calculated Filter
    // If active, we hide any row that is calculated.
    if (hideCalculated) {
      current = current.filter(r => !r.isCalculated);
    }

    // 2. Hide Specific Properties Filter
    if (hiddenProps.size > 0) {
      current = current.filter(r => {
        if (r.isHeader) return true;
        const key = `${r.type}|${r.spaces}|${r.parentType}`;
        return !hiddenProps.has(key);
      });
    }

    // 3. Entity / Drill-down Filters
    if (onlyEntities || onlyEntitiesAndAttributes) {
      const allowedIds = new Set<string>();

      const addAncestors = (id: string) => {
        let curr: string | undefined = id;
        while (curr) {
          allowedIds.add(curr);
          curr = rowsById.get(curr)?.parentId;
        }
      };

      const addDescendants = (id: string) => {
        allowedIds.add(id);
        childrenMap.get(id)?.forEach(addDescendants);
      };

      for (const r of current) {
        const isMatch = onlyEntities
          ? r.prop === 'Ent' && r.isHeader
          : (r.prop === 'Ent' || r.prop === 'Atr') && r.isHeader;

        if (isMatch) {
          addAncestors(r.id);
          addDescendants(r.id);
        }
      }
      current = current.filter(r => allowedIds.has(r.id));
    }

    // 4. Change Filter
    if (change) {
      const matchingIds = new Set<string>();
      const addDescendants = (id: string) => {
        matchingIds.add(id);
        childrenMap.get(id)?.forEach(addDescendants);
      };

      for (const r of current) {
        if (r.isHeader && r.prop === 'Ent' && r.change === change) {
          addDescendants(r.id);
        }
      }
      current = current.filter(r => matchingIds.has(r.id));
    }

    // 5. Search Filter (Name/Type)
    if (name) {
      const search = name.toLowerCase();
      const hits = new Set<string>();

      for (const r of current) {
        const textMatch =
          r.type.toLowerCase().includes(search) ||
          r.left.toLowerCase().includes(search) ||
          r.right.toLowerCase().includes(search);
        if (textMatch) hits.add(r.id);
      }

      const familyIds = new Set<string>();
      const addAncestors = (id: string) => {
        let curr: string | undefined = id;
        while (curr) {
          familyIds.add(curr);
          curr = rowsById.get(curr)?.parentId;
        }
      };
      const addDescendants = (id: string) => {
        familyIds.add(id);
        childrenMap.get(id)?.forEach(addDescendants);
      };

      for (const id of hits) {
        const row = rowsById.get(id);
        if (!row) continue;
        const rootId = !row.isHeader && row.parentId ? row.parentId : id;
        addAncestors(rootId);
        addDescendants(rootId);
      }
      current = current.filter(r => familyIds.has(r.id));
    }

    return current;
  },
);

/**
 * Extracts unique property definitions organized as a tree (grouped by Parent Type).
 * Maintains the discovery order for Parent Types and their child properties.
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

/** Toggles a property visibility in the hidden set. */
export const toggleProperty = (key: string) => {
  const current = new Set(hiddenProperties$.get());
  if (current.has(key)) current.delete(key);
  else current.add(key);
  hiddenProperties$.set(current);
};

/** Hides all unique properties. */
export const hideAllProperties = () => {
  const allKeys = new Set<string>();
  uniqueProperties$.get().forEach(group => {
    group.children.forEach(p => {
      allKeys.add(p.key);
    });
  });
  hiddenProperties$.set(allKeys);
};

/** Resets all hidden properties (shows everything). */
export const resetHiddenProperties = () => {
  hiddenProperties$.set(new Set());
};

/** Toggles individual property visibility for a header. */
export const togglePropertiesIndividual = (id: string) => {
  const current = new Set(toggledPropertiesIds$.get());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  toggledPropertiesIds$.set(current);
};

/** Toggles sub-object (children) visibility for a header. */
export const toggleSubObjects = (id: string) => {
  const current = new Set(hiddenSubObjectsIds$.get());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  hiddenSubObjectsIds$.set(current);
};

/** Toggles row selection for batch operations. 
 * Automatically hides properties and sub-objects when checked, but allows manual toggle back.
 */
export const toggleCheck = (id: string) => {
  const currentChecked = new Set(checkedIds$.get());
  const becomingChecked = !currentChecked.has(id);
  
  const propsToggled = new Set(toggledPropertiesIds$.get());
  const subsHidden = new Set(hiddenSubObjectsIds$.get());

  if (becomingChecked) {
    currentChecked.add(id);
    
    // Hide Properties
    const globalShow = showProperties$.get();
    if (globalShow) propsToggled.add(id); // global ON -> toggle to HIDE
    else propsToggled.delete(id); // global OFF -> hidden by default, ensure NO toggle

    // Hide Sub-objects
    const onlyEnt = onlyEntities$.get();
    const onlyEntAtr = onlyEntitiesAndAttributes$.get();
    const row = enrichedData$.get().find(r => r.id === id);
    
    let baseSubHidden = false;
    if (row) {
        // Determine if it's hidden by mode default
        if (onlyEnt && row.prop === 'Ent' && row.hasSubObjects) baseSubHidden = true;
        if (onlyEntAtr && row.prop === 'Atr' && row.hasSubObjects) baseSubHidden = true;
    }
    
    if (baseSubHidden) subsHidden.delete(id); // If it's hidden by mode, untoggle it to KEEP it hidden
    else subsHidden.add(id); // If it's shown by default, toggle it to HIDE it
    
  } else {
    currentChecked.delete(id);
    // When unchecking, we return to the default (untoggled) state
    propsToggled.delete(id);
    subsHidden.delete(id);
  }
  
  toggledPropertiesIds$.set(propsToggled);
  hiddenSubObjectsIds$.set(subsHidden);
  checkedIds$.set(currentChecked);
};

/** Resets all visibility states. */
export const initializeVisibility = () => {
  showProperties$.set(false);
  toggledPropertiesIds$.set(new Set());
  hiddenSubObjectsIds$.set(new Set());
  isFlipped$.set(false);
  resetHiddenProperties();
};

/** Resets all user filters. */
export const resetFilters = () => {
  filterChange$.set('');
  filterName$.set('');
  onlyEntities$.set(false);
  onlyEntitiesAndAttributes$.set(false);
  hideCalculated$.set(true);
};

/** Global side-swap (Work <-> Reference). */
export const toggleFlip = () => isFlipped$.set(!isFlipped$.get());
/** Global property visibility toggle. */
export const togglePropertiesGlobal = () => showProperties$.set(!showProperties$.get());

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

    // Large Table detection (> 11 attributes)
    if (isTable && row.attributeCount && row.attributeCount > 11) {
      stats.largeTablesCount = (stats.largeTablesCount || 0) + 1;
    }
  }
  return Object.values(summary);
});

if (typeof window !== 'undefined') {
  (window as unknown as { erwinData: Record<string, unknown> }).erwinData = {
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
  };
}
