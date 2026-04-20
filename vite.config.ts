import * as fs from 'node:fs';
import * as path from 'node:path';
import userscript, { type Metadata } from 'userscript-metadata-generator';
import { defineConfig, type Plugin, type UserConfig, type ViteDevServer } from 'vite';
import viteBanner from 'vite-plugin-banner';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { viteSingleFile } from 'vite-plugin-singlefile';
import svgLoader from 'vite-svg-loader';

// Import generation logic
import { buildSampleHtml } from './scripts/generate-sample-html.js';

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

/**
 * Custom Vite Plugin to regenerate sample.html whenever sample.ts changes.
 */
function sampleGeneratorPlugin(): Plugin {
  const sampleTsPath = path.resolve(__dirname, 'src/store/sample.ts');
  const sampleHtmlPath = path.resolve(__dirname, 'src/store/sample.html');

  const updateHtml = async (server: ViteDevServer) => {
    try {
      // Use Vite's SSR module loader to handle TypeScript and imports correctly
      const { sampleData } = await server.ssrLoadModule(sampleTsPath);
      const html = buildSampleHtml(sampleData);
      fs.writeFileSync(sampleHtmlPath, html);
      console.log('[SampleGenerator] Hot-reloaded src/store/sample.html');
    } catch (err) {
      console.error('[SampleGenerator] Error during hot-reload:', err);
    }
  };

  return {
    name: 'sample-generator-plugin',
    configureServer(server) {
      // Initial update on server start (delayed slightly to ensure server is ready)
      updateHtml(server).then(_r => {
        // Watch for changes specifically in the sample data source
        server.watcher.on('change', async file => {
          if (file === sampleTsPath || file.endsWith('src/types.ts')) {
            await updateHtml(server);
            server.ws.send({ type: 'full-reload', path: '*' });
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }): UserConfig => {
  const baseConfig: UserConfig = {
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
    },
  };

  // DEVELOPMENT MODE (Vite Dev Server)
  if (mode === 'development') {
    return {
      ...baseConfig,
      plugins: [svgLoader({ svgo: false, defaultImport: 'raw' }), sampleGeneratorPlugin()],
    };
  }

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
        cssMinify: false,
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
      minify: false,
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
