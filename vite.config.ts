import * as fs from 'node:fs';
import userscript, { type Metadata } from 'userscript-metadata-generator';
import { defineConfig, type UserConfig } from 'vite';
import viteBanner from 'vite-plugin-banner';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { viteSingleFile } from 'vite-plugin-singlefile';
import svgLoader from 'vite-svg-loader';

const metadata: Metadata = {
  name: 'Erwin Compare Formatter',
  namespace: 'npm/erwin-compare-formatter',
  version: '5.0.0',
  description:
    'Color code and format Erwin Data Modeler HTML difference reports into a searchable interface.',
  author: 'TagoDR',
  match: ['file:///*.html', 'file:///*.htm'],
  grant: ['none'],
  runAt: 'document-end',
};

export default defineConfig(({ mode }): UserConfig => {
  const baseConfig: UserConfig = {
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
      __IS_PUBLIC__: JSON.stringify(true),
    },
  };

  // STANDALONE BUILD (Single HTML File)
  if (mode === 'standalone' || mode === 'production') {
    return {
      ...baseConfig,
      plugins: [
        svgLoader({ svgo: false, defaultImport: 'raw' }),
        viteSingleFile({ removeViteModuleLoader: true }),
        {
          name: 'rename-index',
          closeBundle() {
            if (fs.existsSync('./dist/index.html')) {
              fs.renameSync('./dist/index.html', './dist/Erwin_Complete_Compare_Formatter.html');
            }
          },
        },
      ],
      build: {
        minify: true,
        cssMinify: false, // Avoid star hack errors
        target: 'esnext',
        emptyOutDir: false,
        outDir: 'dist',
      },
    };
  }

  // USERSCRIPT BUILD (Tampermonkey)
  return {
    ...baseConfig,
    plugins: [
      svgLoader({ svgo: false, defaultImport: 'raw' }),
      cssInjectedByJsPlugin(),
      viteBanner({ content: userscript(metadata), verify: false }),
    ],
    build: {
      target: 'esnext',
      minify: false, // Never minify userscript as requested
      cssMinify: false,
      emptyOutDir: false,
      outDir: 'dist',
      cssCodeSplit: false,
      lib: {
        entry: 'src/index.ts',
        name: 'ErwinCompareFormatter',
        formats: ['iife'],
        fileName: () => 'erwin_complete_compare_formatter.user.js',
      },
      rollupOptions: {
        output: {
          extend: true,
        },
      },
    },
  };
});
