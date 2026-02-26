/* ============================================
   THE HOST & THE GUEST
   Interaction Layer — V5 Multi-page
   ============================================ */

(function() {
  'use strict';

  // --- Header Scroll ---
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 80;
    header.classList.toggle('scrolled', isScrolled);
    document.body.classList.toggle('scrolled', isScrolled);
  }, { passive: true });


  // --- Slide-out Menu ---
  const navToggle = document.getElementById('navToggle');
  const slideMenu = document.getElementById('slideMenu');
  const slideMenuOverlay = document.getElementById('slideMenuOverlay');
  const servicesToggle = document.getElementById('servicesToggle');
  const slideMenuSub = document.getElementById('slideMenuSub');
  const slideMenuSubBack = document.getElementById('slideMenuSubBack');

  function openMenu() {
    slideMenu.classList.add('open');
    slideMenuOverlay.classList.add('open');
    navToggle.classList.add('active');
    document.body.classList.add('menu-open');
    var lbl = navToggle.querySelector('.nav-toggle-label');
    if (lbl) lbl.textContent = 'Close';
    navToggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    slideMenu.classList.remove('open');
    slideMenuSub.classList.remove('open');
    slideMenuOverlay.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.classList.remove('sub-open');
    document.body.classList.remove('menu-open');
    var lbl = navToggle.querySelector('.nav-toggle-label');
    if (lbl) lbl.textContent = 'Menu';
    navToggle.setAttribute('aria-label', 'Menu');
  }

  function openSubPanel() {
    slideMenu.classList.remove('open');
    slideMenuSub.classList.add('open');
    navToggle.classList.add('sub-open');
  }

  function closeSubPanel() {
    slideMenuSub.classList.remove('open');
    slideMenu.classList.add('open');
    navToggle.classList.remove('sub-open');
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (slideMenuSub && slideMenuSub.classList.contains('open')) {
        closeSubPanel();
      } else if (slideMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (slideMenuOverlay) {
    slideMenuOverlay.addEventListener('click', closeMenu);
  }

  if (servicesToggle) {
    servicesToggle.addEventListener('click', openSubPanel);
  }

  if (slideMenuSubBack) {
    slideMenuSubBack.addEventListener('click', closeSubPanel);
  }

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (slideMenuSub && slideMenuSub.classList.contains('open')) {
        closeSubPanel();
      } else if (slideMenu && slideMenu.classList.contains('open')) {
        closeMenu();
      }
    }
  });


  // --- Active Nav Link ---
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const servicePages = ['events.html', 'workshops.html', 'tablescapes.html'];

  // Highlight active link in slide menu
  document.querySelectorAll('.slide-menu-link[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('nav-link--active');
    }
  });

  // Highlight Services button if on a service page
  if (servicePages.includes(currentPage)) {
    const svcBtn = document.getElementById('servicesToggle');
    if (svcBtn) svcBtn.classList.add('nav-link--active');
  }

  // Highlight active sub-link
  document.querySelectorAll('.slide-menu-sub-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.style.color = 'var(--sage)';
    }
  });


  // --- Smooth Scroll (same-page anchors only) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // --- Offering Panels: last hovered stays open ---
  const panels = document.querySelectorAll('.offerings-panel');

  if (panels.length) {
    panels.forEach(panel => {
      panel.addEventListener('mouseenter', () => {
        panels.forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
      });
    });
  }


  // --- Service Accordion ---
  document.querySelectorAll('.service-accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.service-accordion-item');
      const body = item.querySelector('.service-accordion-body');
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other items in the same accordion
      const accordion = item.closest('.service-accordion');
      accordion.querySelectorAll('.service-accordion-item').forEach(other => {
        if (other !== item) {
          other.querySelector('.service-accordion-trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.service-accordion-body').style.maxHeight = null;
          other.classList.remove('active');
        }
      });

      // Toggle this item
      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        body.style.maxHeight = body.scrollHeight + 'px';
        item.classList.add('active');
      } else {
        body.style.maxHeight = null;
        item.classList.remove('active');
      }
    });
  });


  // --- URL Param: Pre-select interest dropdown ---
  const urlParams = new URLSearchParams(window.location.search);
  const interestParam = urlParams.get('interest');
  const interestSelect = document.getElementById('interest');

  if (interestParam && interestSelect) {
    const option = interestSelect.querySelector(`option[value="${interestParam}"]`);
    if (option) {
      interestSelect.value = interestParam;
      // Trigger label float
      interestSelect.dispatchEvent(new Event('change'));
    }
  }


  // --- Scroll Reveal ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


  // --- Form ---
  const form = document.getElementById('connectForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const btnText = btn.querySelector('.form-submit-text');
      const original = btnText.textContent;

      btnText.textContent = 'Thank you';
      btn.style.pointerEvents = 'none';
      btn.style.background = 'var(--sage)';
      btn.style.borderColor = 'var(--sage)';
      btn.style.color = 'var(--parchment)';

      setTimeout(() => {
        btnText.textContent = original;
        btn.style.pointerEvents = '';
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        form.reset();
      }, 3000);
    });
  }


})();
