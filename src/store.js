(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CapibaraStore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  function formatPrice(amount) {
    const digits = String(Math.round(amount));
    return '$' + digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function discountPercent(previousPrice, price) {
    if (!previousPrice || previousPrice <= price) return 0;
    return Math.round((1 - price / previousPrice) * 100);
  }

  function filterByCategory(products, category) {
    if (category === 'todo') return products.slice();
    return products.filter(p => p.category === category);
  }

  function cycleIndex(current, step, length) {
    return (((current + step) % length) + length) % length;
  }

  function withLook(products) {
    return products.filter(p => Boolean(p.look));
  }

  const UNIQUE_SIZE = 'Único';

  function linesTotal(lines) {
    return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  }

  function resolveSize(product, size) {
    const sizes = product.sizes || [];
    if (sizes.length === 0) return UNIQUE_SIZE;
    if (!size) throw new Error('Elegí un talle para ' + product.name);
    if (!sizes.includes(size)) throw new Error('El talle ' + size + ' no está disponible');
    return size;
  }

  function createCart() {
    let lines = [];

    function add(product, size) {
      if (!product.inStock) throw new Error(product.name + ' está sin stock');
      const chosen = resolveSize(product, size);
      const existing = lines.find(l => l.id === product.id && l.size === chosen);
      if (existing) existing.qty += 1;
      else lines.push({ id: product.id, name: product.name, price: product.price, size: chosen, qty: 1 });
    }

    function remove(id, size) {
      lines = lines.filter(l => !(l.id === id && l.size === size));
    }

    return {
      add,
      remove,
      lines: () => lines.map(l => ({ ...l })),
      count: () => lines.reduce((n, l) => n + l.qty, 0),
      total: () => linesTotal(lines),
    };
  }

  function buildWhatsappOrderUrl(phone, lines) {
    if (!lines.length) throw new Error('El carrito está vacío');
    const detail = lines
      .map(l => `${l.qty} x ${l.name} (talle ${l.size}) — ${formatPrice(l.price * l.qty)}`)
      .join('\n');
    const text = `¡Hola Capibara! Quiero hacer este pedido:\n\n${detail}\n\nTotal: ${formatPrice(linesTotal(lines))}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  return {
    formatPrice,
    discountPercent,
    filterByCategory,
    withLook,
    cycleIndex,
    createCart,
    buildWhatsappOrderUrl,
  };
});
