const { test } = require('node:test');
const assert = require('node:assert/strict');
const { filterByCategory, cycleIndex } = require('../src/store.js');

const products = [
  { id: 'a', category: 'tops' },
  { id: 'b', category: 'polleras' },
  { id: 'c', category: 'tops' },
];

test('filtra productos por categoría', () => {
  assert.deepEqual(filterByCategory(products, 'tops').map(p => p.id), ['a', 'c']);
});

test('la categoría "todo" devuelve el catálogo completo', () => {
  assert.equal(filterByCategory(products, 'todo').length, 3);
});

test('avanzar desde el último producto vuelve al primero', () => {
  assert.equal(cycleIndex(2, 1, 3), 0);
});

test('retroceder desde el primer producto va al último', () => {
  assert.equal(cycleIndex(0, -1, 3), 2);
});

const { withLook } = require('../src/store.js');

test('la colección muestra solo prendas que ya tienen imagen generada', () => {
  const items = [{ id: 'a', look: 'a.webp' }, { id: 'b' }, { id: 'c', look: 'c.webp' }];
  assert.deepEqual(withLook(items).map(p => p.id), ['a', 'c']);
});
