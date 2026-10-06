"use strict";
const PRODUCTS = {
  "cp4": {
    "name": "iONprime CP4 KNX",
    "kind": "Room controller KNX",
    "description": "Panel sentuh 4 inci untuk kontrol ruang KNX.",
    "spec": "4 inci · 48 fungsi",
    "size": "Item no. 4969300"
  },
  "pb": {
    "name": "iONprime PB KNX",
    "kind": "Touch sensor KNX",
    "description": "Keypad KNX dengan LED RGB dan pilihan finishing.",
    "spec": "8 tombol · LED RGB",
    "size": "Item no. 4969301 (tanpa rocker)"
  },
  "sul": {
    "name": "SUL 181 d",
    "kind": "Analogue time switch",
    "description": "Timer harian dengan terminal DuoFix.",
    "spec": "15 menit · DuoFix",
    "size": "Item no. 1810011"
  },
  "sul-sk": {
    "name": "SUL 181 d SK",
    "kind": "Analogue time switch",
    "description": "Timer harian dengan screw terminals.",
    "spec": "15 menit · Screw terminals",
    "size": "Item no. 1810021"
  },
  "tr030": {
    "name": "TR 030 top3 UP",
    "kind": "Digital flush-mounted time switch",
    "description": "Timer mingguan untuk pemasangan di dinding.",
    "spec": "Flush-mounted · 84 memori",
    "size": "Item no. 0300130"
  },
  "tr610": {
    "name": "TR 610 top3",
    "kind": "Digital time switch",
    "description": "Timer mingguan dengan dukungan pemrograman aplikasi.",
    "spec": "56 memori · 10 tahun",
    "size": "Item no. 6100130"
  },
  "simplexa": {
    "name": "SIMPLEXA 601 top",
    "kind": "Digital time switch",
    "description": "Timer digital satu kanal yang mudah diatur.",
    "spec": "1 kanal · 42 memori",
    "size": "Item no. 6010130"
  }
};

// Navigation: mobile menu and section state.
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#nav-menu');
const mobileView = window.matchMedia('(max-width: 960px)');
function setMenu(open) {
  menu.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  toggle.querySelector('span').textContent = open ? '✕' : '☰';
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('click', event => { if (!event.target.closest('.navbar')) setMenu(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
});
mobileView.addEventListener('change', () => setMenu(false));
const navLinks = [...menu.querySelectorAll('a')];
navLinks.forEach(link => {
  if (new URL(link.href).pathname === location.pathname || (link.href.endsWith('/produk.html') && document.querySelector('.detail-hero'))) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
});

// Product search and category filtering.
let category = 'all';
const search = document.querySelector('#product-search');
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.product-card')];
function filterProducts() {
  const query = search.value.trim().toLocaleLowerCase('id');
  let count = 0;
  cards.forEach(card => {
    const matches = (category === 'all' || card.dataset.category === category) && card.textContent.toLocaleLowerCase('id').includes(query);
    card.hidden = !matches;
    if (matches) count++;
  });
  document.querySelector('#product-count').textContent = `${count} produk tersedia`;
  document.querySelector('#empty-products').hidden = count > 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter;
  filters.forEach(filter => { const active = filter === button; filter.setAttribute('aria-pressed', String(active)); filter.classList.toggle('is-active', active); });
  filterProducts();
}));
search?.addEventListener('input', filterProducts);

// Product details. Native dialog supports focus trapping and Escape.
const dialog = document.querySelector('#product-dialog');
if (dialog) {
let selectedProduct;
document.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => {
  selectedProduct = PRODUCTS[button.dataset.product];
  document.querySelector('#dialog-full').href = button.dataset.product + '.html';
  document.querySelector('#dialog-title').textContent = selectedProduct.name;
  document.querySelector('#dialog-kind').textContent = selectedProduct.kind;
  document.querySelector('#dialog-description').textContent = selectedProduct.description;
  document.querySelector('#dialog-spec').textContent = selectedProduct.spec;
  document.querySelector('#dialog-size').textContent = selectedProduct.size;
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
document.querySelector('#dialog-contact').addEventListener('click', () => {
  const url = new URL('konsultasi.html', location.href);
  url.searchParams.set('product', selectedProduct.name);
  document.querySelector('#dialog-contact').href = url.href;
  dialog.close();
});
}

// Illustrative scenes, not a connection to real equipment.
const scenes = {
  morning: [['Pencahayaan', 'Terang untuk aktivitas'], ['Tirai', 'Terbuka'], ['Iklim ruang', 'Mode nyaman']],
  relax: [['Pencahayaan', 'Redup & hangat'], ['Tirai', 'Tertutup'], ['Iklim ruang', 'Mode nyaman']],
  away: [['Pencahayaan', 'Nonaktif sesuai zona'], ['Tirai', 'Sesuai jadwal'], ['Iklim ruang', 'Mode hemat']]
};
function setScene(name) {
  document.querySelectorAll('[data-scene]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scene === name)));
  const output = document.querySelector('#scene-output');
  output.replaceChildren(...scenes[name].map(([label, value]) => {
    const row = document.createElement('div');
    const title = document.createElement('span'); title.textContent = label;
    const detail = document.createElement('strong'); detail.textContent = value;
    row.append(title, detail); return row;
  }));
}
document.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => setScene(button.dataset.scene)));
if (document.querySelector('#scene-output')) setScene('morning');

// Prepare a WhatsApp draft. No automatic send and no server storage.
const form = document.querySelector('#consultation-form');
form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = `Halo PT Klik Hiro Optima, saya ingin berkonsultasi tentang Theben.\n\nNama: ${data.get('name').trim()}\nPerusahaan: ${data.get('company').trim() || '-'}\nEmail: ${data.get('email').trim() || '-'}\nWhatsApp: ${data.get('phone').trim()}\nMinat: ${data.get('interest')}\n\nInformasi proyek:\n${data.get('project').trim()}`;
  const link = document.createElement('a');
  link.href = 'https://wa.me/6285122188879?text=' + encodeURIComponent(message);
  link.target = '_blank'; link.rel = 'noopener';
  link.className = 'text-link'; link.textContent = 'Buka pesan di WhatsApp ↗';
  const status = document.querySelector('#form-status');
  status.replaceChildren(document.createTextNode('Pesan siap ditinjau. '), link);
  link.focus();
});

if (form) {
  const requested = new URLSearchParams(location.search).get('product');
  const select = form.querySelector('[name=interest]');
  if ([...select.options].some(option => option.value === requested)) select.value = requested;
}

// Drop an image into the documented path; it replaces its placeholder automatically.
document.querySelectorAll('[data-image]').forEach(slot => {
  const image = new Image();
  image.alt = slot.dataset.alt;
  image.decoding = 'async';
  image.onload = () => {
    slot.replaceChildren(image); slot.classList.add('is-loaded');
    slot.removeAttribute('role'); slot.removeAttribute('aria-label');
  };
  image.onerror = () => { /* Keep the labeled placeholder when no photo has been supplied. */ };
  image.src = slot.dataset.image;
});
document.querySelector('#year').textContent = new Date().getFullYear();

// One active information panel prevents mismatched columns on product pages.
document.querySelectorAll('[data-tabs]').forEach(group => {
  const tabs = [...group.querySelectorAll('[data-tab]')];
  const panels = [...group.querySelectorAll('[data-tab-panel]')];
  const list = group.querySelector('.information-tabs');
  list.setAttribute('role', 'tablist');
  tabs.forEach(tab => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', tab.dataset.tab);
  });
  panels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabs.find(tab => tab.dataset.tab === panel.id).id);
    panel.tabIndex = 0;
  });
  function selectTab(selected, focus = false) {
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.id !== selected.dataset.tab; });
    if (focus) selected.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
    });
  });
  selectTab(tabs[0]);
});
