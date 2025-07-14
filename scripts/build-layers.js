import { readdirSync } from 'fs';
import { resolve, basename, extname } from 'path';
import { execSync } from 'child_process';

const layersDir = resolve('./src/layers');
const files = readdirSync(layersDir);

const layerFiles = files.filter(
  (file) => file.endsWith('.ts') && !file.endsWith('.d.ts') && !file.startsWith('.')
);

console.log(`Found ${layerFiles.length} layer files: ${layerFiles.join(', ')}`);

layerFiles.forEach((file) => {
  const layerName = basename(file, extname(file));
  console.log(`Building layer: ${layerName}`);

  try {
    execSync(`vite build --mode layer:${layerName}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    console.log(`✅ Successfully built ${layerName}`);
  } catch (error) {
    console.error(`❌ Failed to build ${layerName}:`, error.message);
    process.exit(1);
  }
});

console.log('🎉 All layers built successfully!');
