import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import svgLoader from "vite-svg-loader";

export default defineConfig({
	plugins: [
		svgLoader({
			defaultImport: "raw",
		}),
		viteSingleFile(),
	],
	build: {
		cssMinify: false,
		assetsInlineLimit: 100000000,
		chunkSizeWarningLimit: 100000000,
		cssCodeSplit: false,
		reportCompressedSize: false,
	},
});
