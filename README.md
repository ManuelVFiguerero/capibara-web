# Capibara — sitio web

Sitio para Capibara (cuero genuino hecho a mano). HTML, CSS y JavaScript sin dependencias.

## Deploy

Cada push a `main` corre los tests y, si pasan, publica el sitio en GitHub Pages (`.github/workflows/deploy.yml`). Si un test falla, no se publica.

Para publicarlo en otro hosting, subí la carpeta `dist/` completa: `index.html` necesita la carpeta `assets/video` al lado.

## Estructura

- `src/store.js` — lógica de negocio pura (precios, descuentos, filtros, carrito, pedido por WhatsApp y pedidos a medida: colección, diseño propio y novias). No toca el DOM.
- `src/products.js` — catálogo, categorías e imágenes de campaña.
- `assets/campana/` — imágenes de campaña generadas con IA (ilustrativas).
- `assets/looks/` — fotos de producto generadas con IA. Por decisión de la marca, la tienda muestra solo estas imágenes; una prenda aparece en la colección cuando tiene su foto generada.
- `assets/taller/` — foto real de María Eugenia Mantilla en el taller.
- `assets/video/` — video de marca (1080p con sonido) y su portada; se reproduce en la página en silencio, con botón de sonido.
- `src/app.js` — capa de interfaz: solo consume `store.js`.
- `src/styles.css` — estilos.
- `test/` — tests con el runner nativo de Node.

## Comandos

```bash
npm test        # corre los tests
node build.js   # genera dist/: index.html (con imágenes embebidas) + carpeta de videos
```

## Cargar productos

Editá `src/products.js`. Los tests de `test/products.test.js` verifican ids únicos, precio e imagen, que cada foto y cada imagen de campaña exista como archivo, y que cada producto pertenezca a una categoría del menú.

## Pendiente / supuestos

- Talles S, M y L para toda la ropa: es un supuesto, la tienda actual no los muestra. Ajustar en `products.js`.
- Todas las imágenes de producto son generadas con IA e ilustrativas (el pie de página lo aclara). Riesgo conocido: la foto puede no coincidir exactamente con la prenda real; conviene ofrecer fotos reales por WhatsApp a quien las pida.
- La compra se cierra por WhatsApp; no hay pasarela de pago.
