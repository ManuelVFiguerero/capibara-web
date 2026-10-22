const { test } = require('node:test');
const assert = require('node:assert/strict');
const { formatPrice, discountPercent } = require('../src/store.js');

test('formatea precios en pesos argentinos sin decimales', () => {
  assert.equal(formatPrice(280000), '$280.000');
});

test('formatea precios de más de un millón con separadores de miles', () => {
  assert.equal(formatPrice(1250000), '$1.250.000');
});

test('calcula el porcentaje de descuento redondeado', () => {
  assert.equal(discountPercent(380000, 250000), 34);
});

test('devuelve 0 de descuento si no hay precio anterior', () => {
  assert.equal(discountPercent(null, 250000), 0);
});
