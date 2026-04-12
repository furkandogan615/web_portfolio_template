// ── CURSOR ────────────────────────────────────────────────
const cursor     = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
});

(function animRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  if (cursorRing) { cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; }
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .pill, .project-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursorRing) { cursorRing.style.width = '48px'; cursorRing.style.height = '48px'; cursorRing.style.opacity = '0.8'; }
  });
  el.addEventListener('mouseleave', () => {
    if (cursorRing) { cursorRing.style.width = '32px'; cursorRing.style.height = '32px'; cursorRing.style.opacity = '0.45'; }
  });
});

// ── HEADER SCROLL ─────────────────────────────────────────
const header = document.querySelector('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ── TEMA TOGGLE ───────────────────────────────────────────
const themeBtn = document.querySelector('.theme-toggle');
let theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });
}

// ── HAMBURGEr MENÜ ────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    // Menü açıkken body scroll'u engelle
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Mobil menüdeki linklere tıklayınca menüyü kapat
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ESC tuşuyla kapat
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ── REVEAL SCROLL ─────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ── SMOOTH SCROLL ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── AKTİF NAV ─────────────────────────────────────────────
const navLinks = document.querySelectorAll('nav a, .mobile-nav a');
const sections = document.querySelectorAll('section[id]');

new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => {
      const href = l.getAttribute('href');
      l.style.color = (href === '#' + e.target.id || href === '../index.html#' + e.target.id)
        ? 'var(--accent)' : '';
    });
  });
}, { threshold: 0.4 }).observe = function() {};

const secObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => {
      const href = l.getAttribute('href') || '';
      l.style.color = (href.endsWith('#' + e.target.id)) ? 'var(--accent)' : '';
    });
  });
}, { threshold: 0.4 });
sections.forEach(s => secObserver.observe(s));
