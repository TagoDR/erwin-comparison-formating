import { atom, computed } from "nanostores";

export interface ErwinRow {
	type: string;
	prop: string;
	change: "I" | "A" | "E" | "";
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
export const filterChange$ = atom<string>("");
export const filterObject$ = atom<string>("");

/**
 * Helper to determine the short code for an object type.
 */
export const getObjectShortCode = (type: string): string => {
	const t = type.toLowerCase();
	if (t.includes("entity") || t.includes("table")) return "Ent";
	if (t.includes("attribute") || t.includes("column")) return "Atr";
	if (t.includes("foreignkey") || t.includes("relationship")) return "FK";
	if (t.includes("tablespace")) return "TB";
	if (t.includes("index")) return "IX";
	if (t.includes("view")) return "VW";
	if (t.includes("model")) return "M";
	return "";
};

/**
 * Computed store that process raw rows to add inherited property short codes.
 */
export const enrichedData$ = computed(rawData$, (data) => {
	let currentPropCode = "O";

	return data.map((row) => {
		// If it's a header, determine new prop code
		const newCode = getObjectShortCode(row.type);
		if (newCode) {
			currentPropCode = newCode;
		}

		return {
			...row,
			prop: currentPropCode, // Prop column is now the inherited short code
		};
	});
});

// Computed stats for the stats panel
export const statsSummary$ = computed(enrichedData$, (data) => {
	const summary: Record<string, StatsSummary> = {
		Tabelas: {
			type: "Tabelas",
			total: 0,
			inclusion: 0,
			alteration: 0,
			exclusion: 0,
		},
		Colunas: {
			type: "Colunas",
			total: 0,
			inclusion: 0,
			alteration: 0,
			exclusion: 0,
		},
	};

	data.forEach((row) => {
		if (!row.isHeader) return;

		const isTable = row.prop === "Ent";
		const isColumn = row.prop === "Atr";

		const increment = (key: string) => {
			summary[key].total++;
			if (row.change === "I") summary[key].inclusion++;
			if (row.change === "A") summary[key].alteration++;
			if (row.change === "E") summary[key].exclusion++;
		};

		if (isTable) increment("Tabelas");
		if (isColumn) increment("Colunas");
	});

	return Object.values(summary);
});
