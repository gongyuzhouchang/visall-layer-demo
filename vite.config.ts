import { defineConfig } from 'vite';
import path from 'path';
import { readdirSync } from 'fs';

// Helper to get layer entries
function getLayerEntries() {
  const layersDir = path.resolve(__dirname, 'src/layers');
  const files = readdirSync(layersDir);
  return Object.fromEntries(
    files
      .filter((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'))
      .map((file) => {
        const name = path.basename(file, '.ts');
        return [name, path.resolve(layersDir, file)];
      })
  );
}

export default defineConfig(({ mode }) => {
  const layerEntries = getLayerEntries();

  const commonConfig = {
    test: {
      environment: 'jsdom',
      coverage: {
        reporter: ['text', 'json', 'html'],
        all: true,
        include: ['src/**/*.ts'],
        exclude: ['src/main.ts'],
      },
    },
  };

  // Build a single layer
  // Command: vite build --mode layer:simpleBarLayer
  if (mode.startsWith('layer:')) {
    const entryName = mode.split(':')[1];
    const entryPath = layerEntries[entryName];

    if (!entryPath) {
      console.error(`❌ Layer "${entryName}" not found.`);
      console.log(`Available layers: ${Object.keys(layerEntries).join(', ')}`);
      process.exit(1);
    }

    const libName = entryName.charAt(0).toUpperCase() + entryName.slice(1);

    return {
      ...commonConfig,
      build: {
        outDir: `dist/layers/${entryName}`,
        emptyOutDir: true,
        lib: {
          entry: entryPath,
          name: libName,
          formats: ['umd', 'es'],
          fileName: (format, entryName) => `${entryName}.${format}.js`,
        },
      },
    };
  }

  // Build all layers
  // Command: vite build --mode layers
  if (mode === 'layers') {
    const entries = Object.entries(layerEntries);
    // 输出到 dist/layers/all，不会覆盖单独 layer 的产物
    return {
      ...commonConfig,
      build: {
        outDir: 'dist/layers/all',
        rollupOptions: {
          input: Object.fromEntries(entries.map(([name, path]) => [name, path])),
          output: {
            format: 'es',
            entryFileNames: '[name].es.js',
            globals: {},
          },
        },
      },
    };
  }

  // Default build for the application
  return {
    ...commonConfig,
    build: {
      outDir: 'dist/app',
    },
  };
});
