const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createCart, buildWhatsappOrderUrl } = require('../src/store.js');

const chaleco = { id: 'chaleco-plumas', name: 'Chaleco Plumas', price: 280000, inStock: true, sizes: ['S', 'M', 'L'] };
const pulsera = { id: 'pulsera', name: 'Pulsera Caracoles', price: 60000, inStock: true, sizes: [] };
const agotado = { id: 'sastreros', name: 'Sastreros Cápsulas', price: 180000, inStock: false, sizes: ['M'] };

test('un carrito nuevo está vacío y su total es cero', () => {
  const cart = createCart();
  assert.equal(cart.count(), 0);
  assert.equal(cart.total(), 0);
});

test('agrega un producto con talle y suma al total', () => {
  const cart = createCart();
  cart.add(chaleco, 'M');
  assert.equal(cart.count(), 1);
  assert.equal(cart.total(), 280000);
});

test('agregar el mismo producto y talle incrementa la cantidad en vez de duplicar la línea', () => {
  const cart = createCart();
  cart.add(chaleco, 'M');
  cart.add(chaleco, 'M');
  assert.equal(cart.lines().length, 1);
  assert.equal(cart.lines()[0].qty, 2);
});

test('el mismo producto en otro talle es una línea distinta', () => {
  const cart = createCart();
  cart.add(chaleco, 'M');
  cart.add(chaleco, 'L');
  assert.equal(cart.lines().length, 2);
});

test('rechaza productos sin stock', () => {
  const cart = createCart();
  assert.throws(() => cart.add(agotado, 'M'), /sin stock/i);
  assert.equal(cart.count(), 0);
});

test('exige elegir talle si el producto tiene talles', () => {
  const cart = createCart();
  assert.throws(() => cart.add(chaleco), /talle/i);
});

test('rechaza un talle que el producto no ofrece', () => {
  const cart = createCart();
  assert.throws(() => cart.add(chaleco, 'XXL'), /talle/i);
});

test('los accesorios sin talles se agregan como talle único', () => {
  const cart = createCart();
  cart.add(pulsera);
  assert.equal(cart.lines()[0].size, 'Único');
});

test('quitar una línea la elimina del carrito', () => {
  const cart = createCart();
  cart.add(chaleco, 'M');
  cart.add(pulsera);
  cart.remove('chaleco-plumas', 'M');
  assert.equal(cart.total(), 60000);
});

test('arma el link de WhatsApp con el detalle del pedido y el total', () => {
  const cart = createCart();
  cart.add(chaleco, 'M');
  cart.add(chaleco, 'M');
  cart.add(pulsera);
  const url = buildWhatsappOrderUrl('5492216611806', cart.lines());
  assert.ok(url.startsWith('https://wa.me/5492216611806?text='));
  const text = decodeURIComponent(url.split('text=')[1]);
  assert.match(text, /2 x Chaleco Plumas \(talle M\) — \$560\.000/);
  assert.match(text, /1 x Pulsera Caracoles \(talle Único\) — \$60\.000/);
  assert.match(text, /Total: \$620\.000/);
});

test('no arma pedido de WhatsApp con el carrito vacío', () => {
  assert.throws(() => buildWhatsappOrderUrl('5492216611806', []), /vac[ií]o/i);
});
