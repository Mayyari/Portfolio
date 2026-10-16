(() => {
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('i');
  const nav = document.querySelector('.site-nav');
  const backToTop = document.getElementById('backToTop');
  const year = document.getElementById('currentYear');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  // Theme switch: save preference when localStorage is available.
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('mayyari-theme') || 'dark'; } catch (_) {}
  setTheme(savedTheme);

  function setTheme(theme) {
    const chosen = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', chosen);
    if (themeIcon) {
      themeIcon.className = chosen === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', chosen === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', chosen === 'dark' ? '#0a0b12' : '#f7f8fc');
  }

  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('mayyari-theme', next); } catch (_) {}
  });

  // Footer year.
  if (year) year.textContent = new Date().getFullYear();

  // Navbar and back-to-top button.
  const updateScrollUI = () => {
    const y = window.scrollY;
    nav?.classList.toggle('scrolled', y > 24);
    backToTop?.classList.toggle('visible', y > 550);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Close the mobile navigation after selecting a section.
  document.querySelectorAll('#mainNav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const collapseEl = document.getElementById('mainNav');
      if (collapseEl?.classList.contains('show') && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
      }
    });
  });

  // Reveal-on-scroll animation, with fallback for browsers without IntersectionObserver.
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Small typing effect in the hero.
  const typedRole = document.getElementById('typedRole');
  const roles = ['digital experiences', 'responsive websites', 'beautiful interfaces', 'ideas into reality'];
  let roleIndex = 0, charIndex = roles[0].length, deleting = true;
  function typeLoop() {
    if (!typedRole || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const current = roles[roleIndex];
    if (deleting) {
      charIndex--;
      typedRole.textContent = current.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
      window.setTimeout(typeLoop, 45);
    } else {
      const next = roles[roleIndex];
      charIndex++;
      typedRole.textContent = next.slice(0, charIndex);
      if (charIndex >= next.length) { deleting = true; window.setTimeout(typeLoop, 1550); }
      else window.setTimeout(typeLoop, 75);
    }
  }
  window.setTimeout(typeLoop, 1800);

  // Project category filters.
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projectItems.forEach(item => {
        const matches = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('is-hidden', !matches);
      });
    });
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  });

  // Contact form uses mailto so it works without a backend.
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subject = String(data.get('subject') || 'Website enquiry').trim();
    const message = String(data.get('message') || '').trim();

    const emailSubject = encodeURIComponent(`Portfolio enquiry: ${subject}`);
    const body = encodeURIComponent(`Hi Mayyari,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);
    const mailto = `mailto:rh1704173@gmail.com?subject=${emailSubject}&body=${body}`;

    if (formFeedback) {
      formFeedback.classList.remove('error');
      formFeedback.textContent = 'Your email app should open with the message ready to send. If it does not, email rh1704173@gmail.com directly.';
    }
    window.location.href = mailto;
  });

  // Cursor glow on pointer devices.
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  // Keep active nav item in sync with visible section.
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-link').forEach(link => {
            const active = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('active', active);
          });
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }
})();
