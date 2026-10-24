const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('../src/products.js');
const { PRODUCTS, CAMPAIGN, CATEGORIES } = globalThis.CapibaraData;

const exists = rel => fs.existsSync(path.join(__dirname, '..', rel));

test('cada producto tiene un id único', () => {
  const ids = PRODUCTS.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('cada producto tiene precio positivo y al menos una imagen', () => {
  for (const p of PRODUCTS) {
    assert.ok(p.price > 0, p.id);
    assert.ok(p.images.length >= 1, p.id);
  }
});

test('cada foto local de producto existe como archivo', () => {
  for (const p of PRODUCTS.filter(p => p.photo)) {
    assert.ok(exists(p.photo), `falta ${p.photo}`);
  }
});

test('cada producto pertenece a una categoría del menú', () => {
  const ids = CATEGORIES.map(c => c.id);
  for (const p of PRODUCTS) assert.ok(ids.includes(p.category), `${p.id}: ${p.category}`);
});

test('cada imagen de campaña existe y tiene texto alternativo', () => {
  for (const [key, item] of Object.entries(CAMPAIGN)) {
    assert.ok(exists(item.src), `falta ${item.src}`);
    assert.ok(item.alt && item.alt.length > 10, `${key} sin alt`);
  }
});

test('los bloques de campaña que enlazan a una categoría apuntan a una que existe', () => {
  const ids = CATEGORIES.map(c => c.id);
  for (const item of Object.values(CAMPAIGN).filter(i => i.category)) {
    assert.ok(ids.includes(item.category), item.category);
  }
});

test('el video de marca tiene el archivo y su portada', () => {
  const { FILM } = globalThis.CapibaraData;
  for (const key of ['src', 'poster']) {
    assert.ok(FILM[key], `falta FILM.${key}`);
    assert.ok(exists(FILM[key]), `falta ${FILM[key]}`);
  }
});

test('el video se reproduce en la página: no queda un loop aparte ni un reproductor en ventana', () => {
  const { FILM } = globalThis.CapibaraData;
  assert.equal(FILM.loop, undefined);
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.doesNotMatch(html, /id="player"|Ver la película/);
});

test('la foto del taller es una foto real, no una imagen de campaña generada', () => {
  assert.equal(CAMPAIGN.taller.generated, false);
});

test('cada foto generada de producto existe como archivo', () => {
  for (const p of PRODUCTS.filter(p => p.look)) {
    assert.ok(exists(p.look), `falta ${p.look}`);
  }
});

test('la tienda no usa fotos reales de producto: solo imágenes generadas', () => {
  for (const p of PRODUCTS) assert.equal(p.photo, undefined, `${p.id} todavía tiene foto real`);
});

test('las 16 prendas del catálogo tienen su imagen generada', () => {
  const missing = PRODUCTS.filter(p => !p.look).map(p => p.id);
  assert.deepEqual(missing, [], `faltan: ${missing.join(', ')}`);
});

test('la hoja de estilos tiene las llaves balanceadas', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'styles.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  let depth = 0;
  for (const ch of css) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    assert.ok(depth >= 0, 'cierre de llave sin apertura');
  }
  assert.equal(depth, 0, 'quedó una regla o un @media sin cerrar');
});
