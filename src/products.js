(function (root) {
  const CDN = 'https://d22fxaf9t8d39k.cloudfront.net/';
  const img = hash => CDN + hash + '316276.jpg';
  const webp = hash => CDN + hash + '316276.webp';
  const CLOTHING_SIZES = ['S', 'M', 'L'];
  const SHOP = 'https://capibaraoficial.empretienda.com.ar';

  const PRODUCTS = [
    { id: 'chaleco-plumas', look: 'assets/looks/chaleco-plumas.webp', name: 'Chaleco Plumas', category: 'tops', price: 280000, inStock: true,
      images: [img('5a705dd192e7ce84fbe43813168ca2acf92aa46223402163604b54ae9e26d6df'), img('008109daf5f83bff9b9b5169fec8de10beec7a11bb6c71c863a9175c97326282')],
      url: SHOP + '/chalecos-tops/chaleco-plumas' },
    { id: 'top-volado-grande', look: 'assets/looks/top-volado-grande.webp', name: 'Top volado grande', category: 'tops', price: 280000, inStock: true,
      images: [img('96b7db416bba790c0ebcee8adb83d2de743bcd8b23de1f88512cb6555c9101e7'), img('0dcf55bbb98cebc3e5a4265c30dd2474e9733126258e8b7d87b1adbbe29c16c8')],
      url: SHOP + '/chalecos-tops/top-volado-grande' },
    { id: 'pollera', look: 'assets/looks/pollera.webp', name: 'Pollera', category: 'polleras', price: 250000, previousPrice: 380000, inStock: true,
      images: [img('4fe37801db9b345c03b8a7386b2569945c0623c470cb0ba6c6a05225efb64c1b'), img('bcfdd825832749d4e816b5952f78ee5781d58a8e0c3e235f60f9a9489fb889da')],
      url: SHOP + '/vestidos-polleras/pollera' },
    { id: 'conjunto-cuero-gamuzado', look: 'assets/looks/conjunto-cuero-gamuzado.webp', name: 'Conjunto cuero gamuzado', category: 'conjuntos', price: 680000, inStock: true,
      images: [img('410991f88241925d50ee1efebec5120c2907fcd30c97c8c576eb98c3a75416dd'), img('1803428dd559d9ababb013d1d13021194815268540e3d99743593fd199ac8dfa')],
      url: SHOP + '/chalecos-tops/conjunto-cuero-gamuzado' },
    { id: 'capsula-metalizada', name: 'Cápsula metalizada', category: 'tops', price: 320000, inStock: true,
      images: [img('6a701a93ce131d0b987998f061241eb404318aac083637ff7c7499057b3716ae'), img('8b24f337a10642e4f02a0e75b751cd6de5c93151958ea6b299e612b69bee2764')],
      url: SHOP + '/chalecos-tops/capsula-metalizada' },
    { id: 'napalan', name: 'Napalan', category: 'tops', price: 340000, inStock: true,
      images: [img('1087e3911689ac981d821ad79d8faeff82512a004ad3081cb9e9c4a91e1e0233'), img('d24b141e30aafb4813bd9a9ee9a895ebca51f7bf6e2dbea21c3c5373512ed341')],
      url: SHOP + '/chalecos-tops/napalan' },
    { id: 'top-flecos-corto', name: 'Top flecos corto', category: 'tops', price: 250000, inStock: true,
      images: [img('0ca74553c22897f904d23bb94b8820df71b381efa7b88a18a0489125fc060b0a'), img('ceb50baf10d3b66ffd99cd1b521e1eefe2ac7bb8cb3befcb661b1a9509f86fb6')],
      url: SHOP + '/chalecos-tops/top-flecos-corto' },
    { id: 'top-filas-de-flecos', name: 'Top filas de flecos', category: 'tops', price: 260000, inStock: true,
      images: [img('49c28c011681ebeb6bbc9007bcb654ee437ebe9e759816268cde437b0955e5d9'), img('1110ef9a4afa39ffa2b857f311bd5d8baca80efa557c771dfe4e5ea9c88d56b5')],
      url: SHOP + '/chalecos-tops/top-filas-de-flecos' },
    { id: 'pollera-volados', name: 'Pollera volados', category: 'polleras', price: 380000, inStock: true,
      images: [img('9e9864df2c57f9befc478cb37cde7381def45265d7517f762287a5f58cb90588'), img('ef18f2ec51fce5a78abf7e958d6a8c54e51a9c1a9338c92174b79905d3da3e1a')],
      url: SHOP + '/vestidos-polleras/pollera-volados' },
    { id: 'pulsera-caracoles', name: 'Pulsera caracoles', category: 'accesorios', price: 60000, inStock: true, sizes: [],
      images: [img('7dddd4afa75c3c13100374763a979a471af751cc90bfa0f6be88af2a2eb2c3c2'), img('b4570a0b3da7763f0a0cf210bf0b41dcc173584a330ab092009cb09dc47919ba')],
      url: SHOP + '/accesorios/pulsera-caracoles' },
    { id: 'conjunto-de-pelo', name: 'Conjunto de pelo, top y pollera', category: 'conjuntos', price: 580000, inStock: false,
      images: [webp('b69c0e94a179afbf67141b32fa27db9f3e3f61b225a948b1ae3cfd2457759603')],
      url: SHOP + '/chalecos-tops/conjunto-de-pelo-top-y-pollera' },
    { id: 'conjunto-flecos', name: 'Conjunto flecos, top y pollera', category: 'conjuntos', price: 650000, inStock: false,
      images: [webp('412c5529e94d0502c94e4270226310e517188db909fbd9373451f01b3219d4fb')],
      url: SHOP + '/chalecos-tops/conjunto-flecos-top-y-pollera' },
    { id: 'top-y-pollera-gajos', name: 'Top y pollera gajos', category: 'conjuntos', price: 620000, inStock: false,
      images: [img('cd70fa05d8c5669805ce3db1eff60f4c3330d46268fac1da8751782253093600')],
      url: SHOP + '/chalecos-tops/top-y-pollera-gajos' },
    { id: 'conjunto-argollas', name: 'Conjunto argollas, top y pollera', category: 'conjuntos', price: 500000, inStock: false,
      images: [img('f97fd346761bb1992d653e1277c58e05f26a6664f480330092f707a6a9e800ec')],
      url: SHOP + '/chalecos-tops/conjunto-argollas-de-top-y-pollera' },
    { id: 'polleras-largas', name: 'Polleras largas', category: 'polleras', price: 580000, inStock: false,
      images: [img('6db991f5f0ce5fe5913db550625f6798e9beb384ac8ca9b5e65eb7c4bc6f0f1b')],
      url: SHOP + '/vestidos-polleras/polleras-largas' },
    { id: 'sastreros-capsulas', name: 'Sastreros cápsulas', category: 'tops', price: 180000, inStock: false,
      images: [img('c90c200a562e85fd641f8689d4077dbe8081e70a221f53b6d70247f2ce774ecf')],
      url: SHOP + '/chalecos-tops/sastreros-capsulas' },
  ].map(p => ({ sizes: CLOTHING_SIZES, ...p }));

  const CATEGORIES = [
    { id: 'todo', name: 'Ver todo' },
    { id: 'tops', name: 'Chalecos y tops' },
    { id: 'polleras', name: 'Polleras' },
    { id: 'conjuntos', name: 'Conjuntos' },
    { id: 'accesorios', name: 'Accesorios' },
  ];

  // Imágenes de campaña: las generadas son ilustrativas; Las tarjetas de producto usan siempre la foto real.
  const CAMPAIGN = {
    hero: { generated: true, src: 'assets/campana/hero.webp', alt: 'Modelo con top de flecos de cuero metalizado y pollera negra con volado, en un estudio con luz natural' },
    chalecos: { generated: true, src: 'assets/campana/chaleco.webp', category: 'tops', title: 'Chalecos y tops',
      alt: 'Modelo con chaleco de cuero metalizado con plumas en los hombros y laterales trenzados' },
    polleras: { generated: true, src: 'assets/campana/pollera.webp', category: 'polleras', title: 'Polleras',
      alt: 'Pollera de cuero negro con volado al ruedo, en movimiento' },
    conjuntos: { generated: true, src: 'assets/campana/gamuzado.webp', category: 'conjuntos', title: 'Conjuntos',
      alt: 'Modelo con conjunto de top y pollera de gamuza color suela en el campo, al atardecer' },
    taller: { generated: false, src: 'assets/taller/artesana.webp', alt: 'María Eugenia Mantilla trabajando el cuero en su taller, rodeada de cueros colgados' },
  };

  // Video de marca: un loop corto y mudo para la portada de la sección, y la película completa con sonido.
  const FILM = {
    loop: 'assets/video/loop.mp4',
    loopPoster: 'assets/video/loop-poster.jpg',
    src: 'assets/video/capibara-film.mp4',
    poster: 'assets/video/film-poster.jpg',
  };

  root.CapibaraData = {
    PRODUCTS, CATEGORIES, CAMPAIGN, FILM,
    WHATSAPP: '5492216611806',
    EMAIL: 'capibarabyeuge@gmail.com',
    INSTAGRAM: 'https://www.instagram.com/capibara__oficial/',
    SHOP,
  };
})(globalThis);
