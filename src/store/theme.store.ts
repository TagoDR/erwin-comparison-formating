import { atom } from "nanostores";

export type Theme = "dark" | "light";

export const theme$ = atom<Theme>("dark");

export const toggleTheme = () => {
	const newTheme = theme$.get() === "dark" ? "light" : "dark";
	theme$.set(newTheme);
	document.documentElement.setAttribute("data-theme", newTheme);
};

// Initialize theme on load
document.documentElement.setAttribute("data-theme", theme$.get());
