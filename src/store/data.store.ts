import { atom } from 'nanostores';

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

export const rawData$ = atom<ErwinRow[]>([]);
export const filteredData$ = atom<ErwinRow[]>([]);
export const isLoading$ = atom(false);
