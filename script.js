/* Chariot Exteriors — site interactions */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* year */
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* sticky header state */
  const header = $('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* mobile menu */
  const burger = $('#hamburger'), menu = $('#mobileMenu');
  const closeMenu = () => {
    if (!burger || !menu || !menu.classList.contains('open')) return;
    burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); document.body.style.overflow = '';
  };
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
      if (!open) { const first = menu.querySelector('a'); if (first) first.focus(); }
    });
    $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMenu));
    // keep Tab within the open menu
    menu.addEventListener('keydown', e => {
      if (e.key !== 'Tab' || !menu.classList.contains('open')) return;
      const f = [...menu.querySelectorAll('a')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* before / after slider */
  const slider = $('#baSlider'), range = $('#baRange');
  if (slider && range) {
    const set = v => { slider.style.setProperty('--pos', v + '%'); range.setAttribute('aria-valuetext', Math.round(v) + '% after image shown'); };
    range.addEventListener('input', e => set(e.target.value));
    // allow click/drag anywhere on the image to move handle
    const moveTo = clientX => {
      const r = slider.getBoundingClientRect();
      const pct = Math.round(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
      range.value = pct; set(pct);
    };
    let dragging = false;
    slider.addEventListener('pointerdown', e => { dragging = true; moveTo(e.clientX); });
    window.addEventListener('pointermove', e => { if (dragging) moveTo(e.clientX); });
    window.addEventListener('pointerup', () => { dragging = false; });
  }

  /* FAQ accordion — state lives on the button (CSS reacts via :has) */
  $$('.qa button').forEach(btn => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      $$('.qa button').forEach(b => b.setAttribute('aria-expanded', 'false'));
      if (!open) btn.setAttribute('aria-expanded', 'true');
    });
  });

  /* scroll reveal */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* floating quote widget (chat-style, follows scroll) */
  const fab = $('#quoteFab'), panel = $('#quotePanel'), backdrop = $('#quoteBackdrop'), closeBtn = $('#quoteClose');
  let lastFocus = null;
  function openQuote(service) {
    if (!panel) return;
    lastFocus = document.activeElement;
    panel.hidden = false; backdrop.hidden = false;
    requestAnimationFrame(() => { panel.classList.add('open'); backdrop.classList.add('show'); fab.classList.add('hide'); });
    fab.setAttribute('aria-expanded', 'true');
    if (window.innerWidth < 700) document.body.style.overflow = 'hidden';
    if (service) { const sel = $('#service'); if (sel) sel.value = service; }
    setTimeout(() => { const f = $('#name'); if (f) f.focus({ preventScroll: true }); }, 340);
  }
  function closeQuote() {
    if (!panel || panel.hidden) return;
    panel.classList.remove('open'); backdrop.classList.remove('show'); fab.classList.remove('hide');
    fab.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
    setTimeout(() => { panel.hidden = true; backdrop.hidden = true; }, 340);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (fab) {
    fab.addEventListener('click', () => openQuote());
    closeBtn.addEventListener('click', closeQuote);
    backdrop.addEventListener('click', closeQuote);
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      closeQuote();
      if (menu && menu.classList.contains('open')) { closeMenu(); if (burger) burger.focus(); }
    });
    // re-evaluate scroll-lock if the viewport crosses the mobile/desktop threshold while open
    window.addEventListener('resize', () => {
      if (!panel.hidden) document.body.style.overflow = window.innerWidth < 700 ? 'hidden' : '';
    });
    $$('a[href="#quote"]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); closeMenu(); openQuote(a.dataset.service);
    }));
    // keep keyboard focus inside the dialog while it's open
    panel.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const f = [...panel.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.disabled && el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* quote form -> FormSubmit AJAX with inline success */
  const form = $('#quoteForm'), status = $('#formStatus');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form._honey && form._honey.value) return; // bot
      const btn = form.querySelector('button[type=submit]');
      const original = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending...';
      status.textContent = '';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.querySelectorAll('.field, .fineprint').forEach(el => el.style.display = 'none');
          btn.style.display = 'none';
          status.innerHTML = '<div style="text-align:center;padding:1rem 0"><div style="width:58px;height:58px;border-radius:50%;background:rgba(62,140,78,.12);display:flex;align-items:center;justify-content:center;margin:0 auto .8rem"><svg aria-hidden="true" focusable="false" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#3E8C4E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div><strong style="display:block;font-family:var(--display);font-weight:800;font-size:1.35rem;color:var(--navy);margin:0 0 .3rem">Thanks, we got it!</strong><p style="color:var(--muted);margin:0">Sean will reach out shortly to set up your free in-home estimate.</p></div>';
        } else { throw new Error('bad response'); }
      } catch (err) {
        btn.disabled = false; btn.textContent = original;
        status.innerHTML = '<p style="color:#c0392b;font-size:.92rem;margin:.7rem 0 0;text-align:center">Something went wrong. Please call <a href="tel:+16826882233">(682) 688-2233</a> or email <a href="mailto:sean@chariotexteriors.com">sean@chariotexteriors.com</a>.</p>';
      }
    });
  }
})();
