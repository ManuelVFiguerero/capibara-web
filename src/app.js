(function () {
  'use strict';

  const { formatPrice, discountPercent, filterByCategory, withLook, createCart, buildWhatsappOrderUrl } = window.CapibaraStore;
  const { PRODUCTS, CATEGORIES, CAMPAIGN, WHATSAPP, EMAIL, INSTAGRAM, SHOP } = window.CapibaraData;

  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const byId = id => PRODUCTS.find(p => p.id === id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cart = createCart();
  let category = 'todo';

  /* ---------- Utilidades ---------- */
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    }
    [].concat(children).forEach(c => c != null && node.append(c));
    return node;
  }

  function image(src, alt, lazy = true) {
    const img = el('img', { src, alt, decoding: 'async' });
    if (lazy) img.loading = 'lazy';
    img.addEventListener('error', () => {
      const holder = img.closest('.card-media, .line-thumb');
      // Si falla la foto secundaria (la del hover) se quita sola; la principal sigue visible.
      if (holder && holder.querySelector('img') !== img) { img.remove(); return; }
      holder?.classList.add('no-img');
    });
    return img;
  }

  const primaryPhoto = p => p.look;

  let toastTimer;
  function toast(message) {
    const t = $('#toast');
    t.textContent = message;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- Enlaces de contacto ---------- */
  const links = {
    instagram: INSTAGRAM,
    whatsapp: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('¡Hola Capibara! Tengo una consulta.')}`,
    email: `mailto:${EMAIL}`,
    returns: `${SHOP}/cambio-y-devoluciones`,
  };
  $$('[data-link]').forEach(a => { a.href = links[a.dataset.link]; });

  /* ---------- Header y logo ---------- */
  const header = $('#header');
  const wordmark = $('#wordmark');
  const hero = $('.hero');
  const SMALL_WORDMARK_PX = 26;

  function updateHeader() {
    const heroH = hero.offsetHeight;
    const headerH = header.offsetHeight;
    const bigPx = parseFloat(getComputedStyle(wordmark).fontSize);
    const startY = Math.max(headerH + 16, heroH * 0.13);
    const endY = (headerH - SMALL_WORDMARK_PX * 1.02) / 2;
    // En pantallas chicas el logo gigante taparía a la modelo: arranca ya en el header.
    const compact = window.matchMedia('(max-width: 760px)').matches;
    const p = reducedMotion || compact ? 1 : Math.min(1, Math.max(0, window.scrollY / (heroH * 0.45)));
    const eased = 1 - Math.pow(1 - p, 3);
    const scale = 1 + (SMALL_WORDMARK_PX / bigPx - 1) * eased;
    wordmark.style.setProperty('--wm-s', scale.toFixed(4));
    wordmark.style.setProperty('--wm-y', (startY + (endY - startY) * eased).toFixed(1) + 'px');
    // El header se vuelve sólido cuando el logo termina de achicarse.
    header.classList.toggle('solid', compact ? window.scrollY > heroH * 0.6 : p >= 1);
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateHeader(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', updateHeader);

  /* ---------- Campaña ---------- */
  const heroImg = $('#heroImg');
  heroImg.alt = CAMPAIGN.hero.alt;
  heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  heroImg.src = CAMPAIGN.hero.src;
  if (heroImg.complete) heroImg.classList.add('loaded');

  const tallerImg = $('#tallerImg');
  tallerImg.src = CAMPAIGN.taller.src;
  tallerImg.alt = CAMPAIGN.taller.alt;

  $('#categories').append(...['chalecos', 'polleras', 'conjuntos'].map(key => {
    const item = CAMPAIGN[key];
    return el('a', { class: 'cat-tile', href: '#coleccion', 'data-cat': item.category }, [
      el('img', { src: item.src, alt: item.alt, loading: 'lazy' }),
      el('span', { class: 'cat-label' }, [el('strong', { text: item.title }), el('span', { class: 'text-link light', text: 'Ver' })]),
    ]);
  }));

  /* ---------- Película ---------- */
  const { FILM } = window.CapibaraData;
  const loop = $('#filmLoop');
  loop.poster = FILM.loopPoster;
  // El loop solo se descarga y reproduce cuando la sección está a la vista.
  if (!reducedMotion && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!loop.src) loop.src = FILM.loop;
          loop.play().catch(() => {});
        } else {
          loop.pause();
        }
      }
    }, { threshold: 0.25 }).observe(loop);
  }

  const player = $('#player');
  const full = $('#filmFull');
  full.poster = FILM.poster;
  function openPlayer() {
    if (!full.src) full.src = FILM.src;
    loop.pause();
    player.classList.add('open');
    player.setAttribute('aria-hidden', 'false');
    $('#playerClose').focus();
    full.play().catch(() => {});
  }
  function closePlayer() {
    full.pause();
    player.classList.remove('open');
    player.setAttribute('aria-hidden', 'true');
    $('#filmPlay').focus();
  }
  $('#filmPlay').addEventListener('click', openPlayer);
  $('#playerClose').addEventListener('click', closePlayer);
  full.addEventListener('ended', closePlayer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && player.classList.contains('open')) closePlayer(); });

  /* ---------- Categorías ---------- */
  $('#filters').append(...CATEGORIES.map(c =>
    el('button', { class: 'filter', 'data-cat': c.id, 'aria-pressed': String(c.id === category), text: c.name })));
  $('#menuCats').append(...CATEGORIES.map(c =>
    el('a', { href: '#coleccion', 'data-cat': c.id, 'data-close': '', text: c.name })));

  function setCategory(id) {
    category = id;
    $$('.filter').forEach(f => f.setAttribute('aria-pressed', String(f.dataset.cat === id)));
    $$('.hnav [data-cat]').forEach(a => a.setAttribute('aria-current', String(a.dataset.cat === id)));
    renderGrid();
  }

  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-cat]');
    if (trigger) setCategory(trigger.dataset.cat);
  });

  /* ---------- Colección ---------- */
  function addToCart(product, size, button) {
    try {
      cart.add(product, size);
    } catch (err) {
      toast(err.message);
      return;
    }
    renderCart();
    toast(`Agregaste ${product.name}${size ? `, talle ${size}` : ''}`);
    if (button) {
      button.classList.add('added');
      setTimeout(() => button.classList.remove('added'), 1200);
    }
  }

  function card(product, i) {
    const off = discountPercent(product.previousPrice, product.price);
    const media = el('div', { class: 'card-media' }, [
      image(product.look, product.name),
      el('span', { class: 'img-fallback', text: product.name }),
    ]);
    if (!product.inStock) media.append(el('span', { class: 'badge', text: 'Agotado' }));
    else if (off) media.append(el('span', { class: 'badge sale', text: `-${off}%` }));

    if (product.inStock) {
      const quick = el('div', { class: 'quick', role: 'group', 'aria-label': `Agregar ${product.name}` });
      if (product.sizes.length) {
        quick.append(el('span', { class: 'quick-label', text: 'Agregar talle' }));
        for (const s of product.sizes) {
          const b = el('button', { class: 'size', text: s, 'aria-label': `Agregar ${product.name} talle ${s}` });
          b.addEventListener('click', () => addToCart(product, s, b));
          quick.append(b);
        }
      } else {
        const b = el('button', { class: 'size', text: 'Agregar', 'aria-label': `Agregar ${product.name}` });
        b.addEventListener('click', () => addToCart(product, undefined, b));
        quick.append(el('span', { class: 'quick-label', text: 'Talle único' }), b);
      }
      media.append(quick);
    }

    const price = el('span', { class: 'card-price' });
    if (off) price.append(el('s', { text: formatPrice(product.previousPrice) }), el('span', { class: 'now', text: formatPrice(product.price) }));
    else price.append(formatPrice(product.price));

    const node = el('article', { class: `card is-entering${product.inStock ? '' : ' sold-out'}` }, [
      media,
      el('div', { class: 'card-info' }, [
        el('h3', { class: 'card-name' }, el('a', { href: product.url, target: '_blank', rel: 'noopener', text: product.name })),
        price,
      ]),
    ]);
    if (!product.inStock) {
      const ask = el('a', { target: '_blank', rel: 'noopener', text: 'Pedilo por WhatsApp',
        href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`¡Hola! ¿Se puede hacer a pedido "${product.name}"?`)}` });
      node.append(el('p', { class: 'card-status' }, ['Sin stock. ', ask]));
    }
    node.style.setProperty('--i', i);
    return node;
  }

  function renderGrid() {
    const items = filterByCategory(withLook(PRODUCTS), category).sort((a, b) => Number(b.inStock) - Number(a.inStock));
    $('#grid').replaceChildren(...items.map(card));
    $('#count').textContent = `${items.length} ${items.length === 1 ? 'pieza' : 'piezas'}`;
  }

  /* ---------- Pedido ---------- */
  function renderCart() {
    const count = cart.count();
    $('#cartCount').textContent = count;
    $('#total').textContent = formatPrice(cart.total());
    const list = $('#lines');
    list.replaceChildren();
    const checkout = $('#checkout');
    const lines = cart.lines();

    if (!lines.length) {
      list.append(el('li', { class: 'empty' }, [
        el('p', { text: 'Todavía no agregaste nada. Elegí una prenda y su talle para empezar el pedido.' }),
        el('a', { class: 'btn outline', href: '#coleccion', 'data-close': '', text: 'Ver la colección' }),
      ]));
      checkout.setAttribute('aria-disabled', 'true');
      checkout.removeAttribute('href');
      return;
    }
    for (const line of lines) {
      const remove = el('button', { class: 'line-remove', text: 'Quitar' });
      remove.addEventListener('click', () => { cart.remove(line.id, line.size); renderCart(); });
      list.append(el('li', { class: 'line' }, [
        el('div', { class: 'line-thumb' }, image(primaryPhoto(byId(line.id)), '')),
        el('div', {}, [
          el('div', { class: 'line-name', text: line.name }),
          el('div', { class: 'line-meta', text: `Talle ${line.size}, cantidad ${line.qty}` }),
          remove,
        ]),
        el('div', { class: 'line-price', text: formatPrice(line.price * line.qty) }),
      ]));
    }
    checkout.setAttribute('aria-disabled', 'false');
    checkout.href = buildWhatsappOrderUrl(WHATSAPP, lines);
  }

  /* ---------- Paneles ---------- */
  let openPanel = null;
  let lastFocus = null;
  function open(panelId, trigger) {
    close();
    lastFocus = trigger || document.activeElement;
    openPanel = $(panelId);
    openPanel.classList.add('open');
    openPanel.setAttribute('aria-hidden', 'false');
    trigger?.setAttribute('aria-expanded', 'true');
    $('#scrim').classList.add('open');
    openPanel.querySelector('[data-close]')?.focus();
  }
  function close() {
    if (!openPanel) return;
    openPanel.classList.remove('open');
    openPanel.setAttribute('aria-hidden', 'true');
    $$('[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    $('#scrim').classList.remove('open');
    openPanel = null;
    lastFocus?.focus?.();
  }
  $('#menuButton').addEventListener('click', e => open('#menu', e.currentTarget));
  $('#cartButton').addEventListener('click', e => open('#drawer', e.currentTarget));
  $('#scrim').addEventListener('click', close);
  document.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* ---------- Inicio ---------- */
  renderGrid();
  renderCart();
  updateHeader();
})();
