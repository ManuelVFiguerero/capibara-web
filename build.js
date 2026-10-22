// Genera dist/: index.html con CSS, JS e imágenes embebidos, y los videos como archivos aparte.
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const dist = path.join(root, 'dist');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

// Las imágenes (.webp) van embebidas; los videos y sus portadas se copian (son pesados para embeber).
const inlineImages = code => code.replace(/'(assets\/[^']+\.webp)'/g, (_, file) =>
  `'data:image/webp;base64,${fs.readFileSync(path.join(root, file)).toString('base64')}'`);

let html = read('index.html');
html = html.replace('<link rel="stylesheet" href="src/styles.css">', () => `<style>\n${read('src/styles.css')}</style>`);
for (const file of ['src/store.js', 'src/products.js', 'src/app.js']) {
  html = html.replace(`<script src="${file}"></script>`, () => `<script>\n${inlineImages(read(file))}</script>`);
}
if (/src="src\/|href="src\//.test(html)) throw new Error('Quedó un recurso local sin embeber');
if (/'assets\/[^']+\.webp'/.test(html)) throw new Error('Quedó una imagen sin embeber');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const copied = new Set(html.match(/assets\/[^'"]+\.(mp4|jpg)/g) || []);
for (const file of copied) {
  const from = path.join(root, file);
  if (!fs.existsSync(from)) throw new Error(`Falta ${file}`);
  fs.mkdirSync(path.dirname(path.join(dist, file)), { recursive: true });
  fs.copyFileSync(from, path.join(dist, file));
}

fs.writeFileSync(path.join(dist, 'index.html'), html);
const size = f => (fs.statSync(f).size / 1024 / 1024).toFixed(1) + ' MB';
console.log('dist/index.html', size(path.join(dist, 'index.html')));
for (const file of copied) console.log('dist/' + file, size(path.join(dist, file)));
