/**
 * Number of spaces representing a single indentation level in Erwin reports.
 */
export const INDENT_SIZE = 3;

/**
 * Keywords used by Erwin to group multiple objects of the same type.
 */
export type GroupingKeyword =
  | 'Annotations'
  | 'Attribute Storage Objects'
  | 'Attributes'
  | 'Attributes/Columns'
  | 'Collections'
  | 'Columns'
  | 'Default Constraint Usages'
  | 'Default Values'
  | 'Domains'
  | 'ER Diagrams'
  | 'Entities'
  | 'Entities/Tables'
  | 'Fields'
  | 'Indexes'
  | 'Keys Groups'
  | 'Keys Groups/Indexes'
  | 'Partition Description Objects'
  | 'Physical Storage Objects'
  | 'Range Partitions Info Objects'
  | 'Range Partitions'
  | 'Relationships'
  | 'Sequences'
  | 'Subject Areas'
  | 'Subtype Symbols'
  | 'Tables'
  | 'Tablespaces'
  | 'Themes'
  | 'Views';

/**
 * Keywords representing individual object headers in Erwin reports.
 */
export type HeaderKeyword =
  | 'Annotation'
  | 'Attribute'
  | 'Attribute/Column'
  | 'Collection'
  | 'Column'
  | 'Default Constraint Usage'
  | 'Default Value'
  | 'Domain'
  | 'ER Diagram'
  | 'Entity'
  | 'Entity/Table'
  | 'Field'
  | 'Index'
  | 'Key Group/Index'
  | 'Model'
  | 'Physical Storage Object'
  | 'Range Partition'
  | 'Relationship'
  | 'Sequence'
  | 'Subject Area'
  | 'Subtype Symbol'
  | 'Table'
  | 'Tablespace'
  | 'Theme'
  | 'View';

/**
 * Property classification codes.
 * Ent: Entity/Table, Atr: Attribute/Column, IX: Index, FK: Relationship, O: Other, M: Metadata.
 */
export type Prop = 'Ent' | 'Atr' | 'IX' | 'FK' | 'O' | 'M' | '';

/**
 * Change status codes.
 * I: Inclusion (Added), A: Alteration (Changed), E: Exclusion (Deleted).
 */
export type Change = 'I' | 'A' | 'E' | '';

/**
 * View type codes.
 * L: Logical, P: Physical, L/P: Both.
 */
export type View = 'L' | 'P' | 'L/P' | '';

/**
 * Represents a raw row from the Erwin HTML difference report.
 */
export interface DiffRow<T extends string = string> {
  level: number;
  spaces: number;
  type: T;
  left: string;
  right: string;
}

/**
 * Specialized DiffRow for object headers.
 */
export interface HeaderRow extends DiffRow<HeaderKeyword> {}

/**
 * A DiffRow enriched with metadata during processing.
 */
export interface EnrichedDiffRow extends DiffRow<string> {
  id: string;
  parentId?: string;
  parentType?: string;
  prop: Prop;
  change: Change;
  view: View;
  isHeader?: boolean;
  isGrouping?: boolean;
  isCalculated?: boolean;
  isUnderHiddenHeader?: boolean;
  isUDP?: boolean;
  attributeCount?: number;
  hasProperties?: boolean;
  hasSubObjects?: boolean;
}

/**
 * Specialized EnrichedDiffRow for headers.
 */
export interface EnrichedHeaderRow extends EnrichedDiffRow {
  type: HeaderKeyword;
}

/**
 * Configuration for identifying and classifying object headers based on indentation and type.
 */
export interface HeaderConfig {
  prop: Prop;
  object: HeaderKeyword;
  indentation: number[]; // space counts (level * INDENT_SIZE)
  levels: number[]; // corresponding levels (1-based)
  hide?: boolean;
}

/**
 * Recursive structure representing an object and its properties/children.
 * Used primarily for sample data generation and structured modeling.
 */
export interface ModelObject {
  id: HeaderRow | EnrichedHeaderRow;
  properties?: (DiffRow | EnrichedDiffRow)[];
  children?: Partial<Record<GroupingKeyword, ModelObject[]>>;
}

/**
 * Statistical summary for a specific object category.
 */
export interface StatsSummary {
  type: string;
  total: number;
  inclusion: number;
  alteration: number;
  exclusion: number;
  calculated: number;
  largeTablesCount?: number;
}

export interface PropertyDefinition {
  key: string;
  type: string;
  spaces: number;
  parentType: string;
}

export interface PropertyTree {
  parentType: string;
  children: PropertyDefinition[];
}

/**
 * Global configuration mapping for all supported Erwin object headers.
 */
export const HEADERS_CONFIG: readonly HeaderConfig[] = [
  { prop: 'O', object: 'Annotation', indentation: [3 * INDENT_SIZE], levels: [3] },
  { prop: 'Atr', object: 'Attribute', indentation: [5 * INDENT_SIZE], levels: [5] },
  { prop: 'Atr', object: 'Attribute/Column', indentation: [5 * INDENT_SIZE], levels: [5] },
  { prop: 'Ent', object: 'Collection', indentation: [3 * INDENT_SIZE], levels: [3] },
  { prop: 'Atr', object: 'Column', indentation: [5 * INDENT_SIZE], levels: [5] },
  { prop: 'O', object: 'Default Constraint Usage', indentation: [7 * INDENT_SIZE], levels: [7] },
  { prop: 'O', object: 'Default Value', indentation: [3 * INDENT_SIZE], levels: [3] },
  { prop: 'O', object: 'Domain', indentation: [3 * INDENT_SIZE], levels: [3] },
  {
    prop: 'O',
    object: 'ER Diagram',
    indentation: [3 * INDENT_SIZE, 4 * INDENT_SIZE],
    levels: [3, 4],
    hide: true,
  },
  { prop: 'Ent', object: 'Entity', indentation: [3 * INDENT_SIZE], levels: [3] },
  { prop: 'Ent', object: 'Entity/Table', indentation: [3 * INDENT_SIZE], levels: [3] },
  {
    prop: 'Atr',
    object: 'Field',
    indentation: [
      5 * INDENT_SIZE,
      6 * INDENT_SIZE,
      7 * INDENT_SIZE,
      8 * INDENT_SIZE,
      9 * INDENT_SIZE,
      10 * INDENT_SIZE,
    ],
    levels: [5, 6, 7, 8, 9, 10],
  },
  { prop: 'IX', object: 'Index', indentation: [5 * INDENT_SIZE], levels: [5] },
  { prop: 'IX', object: 'Key Group/Index', indentation: [5 * INDENT_SIZE], levels: [5] },
  { prop: 'O', object: 'Model', indentation: [1 * INDENT_SIZE], levels: [1] },
  {
    prop: 'O',
    object: 'Physical Storage Object',
    indentation: [5 * INDENT_SIZE, 7 * INDENT_SIZE],
    levels: [5, 7],
  },
  { prop: 'O', object: 'Range Partition', indentation: [6 * INDENT_SIZE], levels: [6] },
  { prop: 'FK', object: 'Relationship', indentation: [5 * INDENT_SIZE], levels: [5] },
  { prop: 'O', object: 'Sequence', indentation: [3 * INDENT_SIZE], levels: [3] },
  { prop: 'O', object: 'Subject Area', indentation: [3 * INDENT_SIZE], levels: [3], hide: true },
  { prop: 'FK', object: 'Subtype Symbol', indentation: [5 * INDENT_SIZE], levels: [5] },
  { prop: 'Ent', object: 'Table', indentation: [3 * INDENT_SIZE], levels: [3] },
  { prop: 'O', object: 'Tablespace', indentation: [3 * INDENT_SIZE], levels: [3] },
  { prop: 'O', object: 'Theme', indentation: [3 * INDENT_SIZE], levels: [3] },
  { prop: 'Ent', object: 'View', indentation: [3 * INDENT_SIZE], levels: [3] },
] as const;

/**
 * List of grouping keywords used to filter out grouping rows during data processing.
 */
export const GROUPING_KEYWORDS: GroupingKeyword[] = [
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
  'Themes',
  'Views',
];
