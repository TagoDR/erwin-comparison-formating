import { atom, computed } from 'nanostores';

export interface ErwinRow {
  type: string;
  prop: string;
  change: 'I' | 'A' | 'E' | '';
  view: string;
  leftModel: string;
  rightModel: string;
  indent: number;
  isHeader?: boolean;
}

export interface StatsSummary {
  type: string;
  total: number;
  inclusion: number;
  alteration: number;
  exclusion: number;
}

export const rawData$ = atom<ErwinRow[]>([]);
export const filteredData$ = atom<ErwinRow[]>([]);
export const isLoading$ = atom(false);
export const fileName$ = atom<string | null>(null);

// Filters State
export const filterChange$ = atom<string>('');
export const filterObject$ = atom<string>('');

// Computed stats for the stats panel
export const statsSummary$ = computed(rawData$, (data) => {
  const summary: Record<string, StatsSummary> = {
    'Tabelas': { type: 'Tabelas', total: 0, inclusion: 0, alteration: 0, exclusion: 0 },
    'Colunas': { type: 'Colunas', total: 0, inclusion: 0, alteration: 0, exclusion: 0 },
  };

  data.forEach(row => {
    if (!row.isHeader) return;

    const isTable = row.type.toLowerCase().includes('table');
    const isColumn = row.type.toLowerCase().includes('attribute') || row.type.toLowerCase().includes('column');
    
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
