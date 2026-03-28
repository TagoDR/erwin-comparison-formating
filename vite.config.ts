import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import svgLoader from "vite-svg-loader";
import fs from "node:fs";
import path from "node:path";

function renameIndex() {
	return {
		name: "rename-index",
		writeBundle() {
			const oldPath = path.resolve("dist/index.html");
			const newPath = path.resolve("dist/Erwin_Formatar_CompleteCompare.html");
			if (fs.existsSync(oldPath)) {
				fs.renameSync(oldPath, newPath);
				console.log(`Renamed: dist/index.html -> dist/Erwin_Formatar_CompleteCompare.html`);
			}
		},
	};
}

export default defineConfig({
	plugins: [
		svgLoader({
			defaultImport: "raw",
		}),
		viteSingleFile(),
		renameIndex(),
	],
	build: {
		cssMinify: false,
		assetsInlineLimit: 100000000,
		chunkSizeWarningLimit: 100000000,
		cssCodeSplit: false,
		reportCompressedSize: false,
	},
});
