const { test } = require('node:test');
const assert = require('node:assert/strict');
const { CUSTOM_ORDERS, buildCustomOrderUrl } = require('../src/store.js');

const textOf = url => decodeURIComponent(url.split('text=')[1]);

test('ofrece tres tipos de pedido a medida: colección, diseño propio y novias', () => {
  assert.deepEqual(CUSTOM_ORDERS.map(o => o.id), ['coleccion', 'diseno', 'novias']);
});

test('cada tipo de pedido tiene título y una frase corta', () => {
  for (const o of CUSTOM_ORDERS) {
    assert.ok(o.title, `${o.id} sin título`);
    assert.ok(o.text && o.text.length <= 60, `${o.id}: la frase tiene que ser corta`);
  }
});

test('el pedido de novias abre WhatsApp mencionando el vestido', () => {
  const url = buildCustomOrderUrl('5492216611806', 'novias');
  assert.ok(url.startsWith('https://wa.me/5492216611806?text='));
  assert.match(textOf(url), /vestido de novia/i);
});

test('el pedido de una pieza de la colección pide talle y color', () => {
  assert.match(textOf(buildCustomOrderUrl('549', 'coleccion')), /talle.*color|color.*talle/i);
});

test('un tipo de pedido desconocido es un error, no un mensaje vacío', () => {
  assert.throws(() => buildCustomOrderUrl('549', 'otro'), /pedido/i);
});
