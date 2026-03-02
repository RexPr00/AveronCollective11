const body = document.body;

const lockScroll = (on) => body.classList.toggle('lock', on);

const trapFocus = (container, e) => {
  if (e.key !== 'Tab') return;
  const nodes = [...container.querySelectorAll('a,button,input,summary,[tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled);
  const first = nodes[0], last = nodes[nodes.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
};

document.querySelectorAll('[data-dropdown]').forEach((drop) => {
  const trigger = drop.querySelector('[data-dropdown-trigger]');
  trigger.addEventListener('click', () => {
    const open = drop.classList.toggle('open');
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});

document.addEventListener('click', (e) => {
  document.querySelectorAll('[data-dropdown]').forEach((drop) => {
    if (!drop.contains(e.target)) {
      drop.classList.remove('open');
      const t = drop.querySelector('[data-dropdown-trigger]');
      if (t) t.setAttribute('aria-expanded', 'false');
    }
  });
});

const drawer = document.querySelector('.mobile-drawer');
const burger = document.querySelector('.burger');
const backdrop = document.querySelector('.drawer-backdrop');
const closeDrawerBtn = document.querySelector('.drawer-close');

const closeDrawer = () => {
  drawer.classList.remove('open');
  backdrop.classList.remove('show');
  drawer.setAttribute('aria-hidden', 'true');
  burger.setAttribute('aria-expanded', 'false');
  lockScroll(false);
};
const openDrawer = () => {
  drawer.classList.add('open');
  backdrop.classList.add('show');
  drawer.setAttribute('aria-hidden', 'false');
  burger.setAttribute('aria-expanded', 'true');
  lockScroll(true);
  drawer.focus();
};
if (burger) burger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
closeDrawerBtn?.addEventListener('click', closeDrawer);
backdrop?.addEventListener('click', closeDrawer);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
    closeModal();
  }
  if (drawer.classList.contains('open')) trapFocus(drawer, e);
  if (modal.classList.contains('open')) trapFocus(modalContent, e);
});

drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

const faq = [...document.querySelectorAll('.faq-list details')];
faq.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faq.forEach((other) => { if (other !== item) other.open = false; });
  });
});

const modal = document.getElementById('privacy-modal');
const modalContent = modal.querySelector('.modal-content');
const openModalBtn = document.querySelector('[data-open-modal]');
const closeModalBtns = document.querySelectorAll('[data-close-modal]');

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  lockScroll(true);
  modalContent.focus();
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  lockScroll(false);
}
openModalBtn?.addEventListener('click', openModal);
closeModalBtns.forEach((btn) => btn.addEventListener('click', closeModal));
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section, .kpi-strip').forEach((el) => {
  el.setAttribute('data-animate', '');
  io.observe(el);
});
