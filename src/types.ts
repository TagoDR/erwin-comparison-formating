export const INDENT_SIZE = 3;

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

export type Prop = 'Ent' | 'Atr' | 'IX' | 'FK' | 'O' | 'M' | '';
export type Change = 'I' | 'A' | 'E' | '';
export type View = 'L' | 'P' | 'L/P' | '';

export interface DiffRow<T extends string = string> {
  level: number;
  spaces: number;
  type: T;
  left: string;
  right: string;
}

export interface HeaderRow extends DiffRow<HeaderKeyword> {}

export interface EnrichedDiffRow extends DiffRow<string> {
  id: string;
  parentId?: string;
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

export interface EnrichedHeaderRow extends EnrichedDiffRow {
  type: HeaderKeyword;
}

export interface HeaderConfig {
  prop: Prop;
  object: HeaderKeyword;
  indentation: number[]; // space counts (level * INDENT_SIZE)
  levels: number[]; // corresponding levels (1-based)
  hide?: boolean;
}

export interface ModelObject {
  id: HeaderRow | EnrichedHeaderRow;
  properties?: (DiffRow | EnrichedDiffRow)[];
  children?: Partial<Record<GroupingKeyword, ModelObject[]>>;
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
    prop: 'M',
    object: 'ER Diagram',
    indentation: [3 * INDENT_SIZE, 4 * INDENT_SIZE],
    levels: [3, 4],
    hide: false,
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
  { prop: 'M', object: 'Subject Area', indentation: [3 * INDENT_SIZE], levels: [3], hide: false },
  { prop: 'FK', object: 'Subtype Symbol', indentation: [5 * INDENT_SIZE], levels: [5] },
  { prop: 'Ent', object: 'Table', indentation: [3 * INDENT_SIZE], levels: [3] },
  { prop: 'O', object: 'Tablespace', indentation: [3 * INDENT_SIZE], levels: [3] },
  { prop: 'O', object: 'Theme', indentation: [3 * INDENT_SIZE], levels: [3] },
  { prop: 'Ent', object: 'View', indentation: [3 * INDENT_SIZE], levels: [3] },
] as const;

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
