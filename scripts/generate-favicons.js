import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');
const svgPath = join(publicDir, 'favicon.svg');

const svgBuffer = readFileSync(svgPath);

// Generate favicon PNGs
const faviconSizes = [16, 32, 192, 512];
for (const size of faviconSizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, `favicon-${size}x${size}.png`));
  console.log(`✓ Generated favicon-${size}x${size}.png`);
}

// Generate favicon.ico (32x32)
await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(join(publicDir, 'favicon.ico'));
console.log('✓ Generated favicon.ico');

// Generate Apple touch icons
const appleSizes = [120, 152, 180];
for (const size of appleSizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, `apple-touch-icon-${size}x${size}.png`));
  console.log(`✓ Generated apple-touch-icon-${size}x${size}.png`);
}

// Generate default apple-touch-icon.png (180x180)
await sharp(svgBuffer)
  .resize(180, 180)
  .png()
  .toFile(join(publicDir, 'apple-touch-icon.png'));
console.log('✓ Generated apple-touch-icon.png');

console.log('\n✅ All favicon files generated successfully!');

