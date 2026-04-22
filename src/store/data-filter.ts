import type { EnrichedDiffRow } from '../types.js';

/**
 * Advanced filtering and visibility logic for enriched data.
 * Handles search, status filters, and hierarchical drill-down modes.
 */
export function filterAndApplyVisibility(
  data: EnrichedDiffRow[],
  filters: {
    change: string;
    name: string;
    onlyEntities: boolean;
    onlyEntitiesAndAttributes: boolean;
    hideCalculated: boolean;
    hiddenProps: Set<string>;
  },
  visibility: {
    globalShowProps: boolean;
    toggledProps: Set<string>;
    hiddenSubs: Set<string>;
    shownSubs: Set<string>;
  },
  rowsById: Map<string, EnrichedDiffRow>,
  childrenMap: Map<string, string[]>,
): EnrichedDiffRow[] {
  if (data.length === 0) return [];

  let current = data;

  // 1. Static Filters (Calculated, Hidden Properties)
  if (filters.hideCalculated) {
    current = current.filter(r => !r.isCalculated);
  }

  if (filters.hiddenProps.size > 0) {
    current = current.filter(row => {
      const key = row.isHeader
        ? `H|${row.type}|${row.spaces}`
        : `P|${row.type}|${row.spaces}|${row.parentType}`;
      return !filters.hiddenProps.has(key);
    });
  }

  // 2. Functional Filters (Drill-down, Change, Search)
  current = applyDrillDown(current, filters, rowsById, childrenMap);
  current = applyChangeFilter(current, filters, childrenMap);
  current = applySearchFilter(current, filters, rowsById, childrenMap);

  // 3. Dynamic Hierarchical Visibility (The "isRowHidden" logic moved here)
  return applyHierarchicalVisibility(
    current,
    {
      ...visibility,
      onlyEntities: filters.onlyEntities,
      onlyEntitiesAndAttributes: filters.onlyEntitiesAndAttributes,
      hiddenProps: filters.hiddenProps,
    },
    rowsById,
  );
}

function applyDrillDown(
  data: EnrichedDiffRow[],
  filters: { onlyEntities: boolean; onlyEntitiesAndAttributes: boolean },
  rowsById: Map<string, EnrichedDiffRow>,
  childrenMap: Map<string, string[]>,
): EnrichedDiffRow[] {
  if (!filters.onlyEntities && !filters.onlyEntitiesAndAttributes) return data;

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

  for (const r of data) {
    const isMatch = filters.onlyEntities
      ? r.prop === 'Ent' && r.isHeader
      : (r.prop === 'Ent' || r.prop === 'Atr') && r.isHeader;

    if (isMatch) {
      addAncestors(r.id);
      addDescendants(r.id);
    }
  }
  return data.filter(r => allowedIds.has(r.id) && r.type !== 'Model');
}

function applyChangeFilter(
  data: EnrichedDiffRow[],
  filters: { change: string },
  childrenMap: Map<string, string[]>,
): EnrichedDiffRow[] {
  if (!filters.change) return data;

  const matchingIds = new Set<string>();
  const addDescendants = (id: string) => {
    matchingIds.add(id);
    childrenMap.get(id)?.forEach(addDescendants);
  };

  for (const r of data) {
    if (r.isHeader && r.prop === 'Ent' && r.change === filters.change) {
      addDescendants(r.id);
    }
  }
  return data.filter(r => matchingIds.has(r.id));
}

function applySearchFilter(
  data: EnrichedDiffRow[],
  filters: { name: string },
  rowsById: Map<string, EnrichedDiffRow>,
  childrenMap: Map<string, string[]>,
): EnrichedDiffRow[] {
  if (!filters.name) return data;

  const search = filters.name.toLowerCase();
  const hits = new Set<string>();

  for (const r of data) {
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
  return data.filter(r => familyIds.has(r.id));
}

/**
 * Efficiently computes visibility for all rows in a single pass.
 * Replaces recursive "isRowHidden" checks during render.
 */
function applyHierarchicalVisibility(
  data: EnrichedDiffRow[],
  visibility: {
    globalShowProps: boolean;
    toggledProps: Set<string>;
    hiddenSubs: Set<string>;
    shownSubs: Set<string>;
    onlyEntities?: boolean;
    onlyEntitiesAndAttributes?: boolean;
    hiddenProps: Set<string>;
  },
  rowsById: Map<string, EnrichedDiffRow>,
): EnrichedDiffRow[] {
  const visibleRows: EnrichedDiffRow[] = [];
  const hiddenAncestors = new Set<string>();

  for (const row of data) {
    // 0. Static Filter for Header Types (Cascade to children)
    if (row.isHeader) {
      const headerKey = `H|${row.type}|${row.spaces}`;
      if (visibility.hiddenProps.has(headerKey)) {
        hiddenAncestors.add(row.id);
        continue;
      }
    }

    // If any ancestor is already hidden, this row is hidden too.
    if (row.parentId && hiddenAncestors.has(row.parentId)) {
      hiddenAncestors.add(row.id);
      continue;
    }

    // Check if this row itself should be hidden based on its parent's state
    if (row.parentId) {
      const parent = rowsById.get(row.parentId);
      if (parent) {
        let shouldHide = false;

        // 1. Property Visibility
        if (!row.isHeader) {
          const isParentToggled = visibility.toggledProps.has(row.parentId);
          const isVisible = visibility.globalShowProps ? !isParentToggled : isParentToggled;
          if (!isVisible) shouldHide = true;
        }

        // 2. Sub-Object Visibility
        if (row.isHeader && !shouldHide) {
          // Determine Default Visibility for this row based on mode
          let isDefaultHidden = false;

          if (visibility.onlyEntities && parent.prop === 'Ent' && row.prop !== 'Ent') {
            isDefaultHidden = true;
          }
          if (visibility.onlyEntitiesAndAttributes) {
            if (parent.prop === 'Ent' && row.prop !== 'Atr') isDefaultHidden = true;
            if (parent.prop === 'Atr' && row.type !== 'Field') isDefaultHidden = true;
          }

          // Special Rule: Model's direct Entity/Attribute children are always visible by default
          if (parent.type === 'Model' && (row.prop === 'Ent' || row.prop === 'Atr')) {
            isDefaultHidden = false;
          }

          // Apply Manual Overrides
          if (isDefaultHidden) {
            // If hidden by default, it's only shown if explicitly in shownSubs
            if (!visibility.shownSubs.has(row.parentId)) {
              shouldHide = true;
            }
          } else {
            // If visible by default, it's hidden if explicitly in hiddenSubs
            if (visibility.hiddenSubs.has(row.parentId)) {
              shouldHide = true;
            }
          }
        }

        if (shouldHide) {
          hiddenAncestors.add(row.id);
          continue;
        }
      }
    }

    visibleRows.push(row);
  }

  return visibleRows;
}
