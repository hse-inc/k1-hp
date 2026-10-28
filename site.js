(() => {
  const header = document.querySelector('.header');
  const fv = document.querySelector('.fv');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > (fv ? fv.offsetHeight - header.offsetHeight : 8));
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const btn = document.querySelector('.menu-btn');
  const drawer = document.querySelector('.drawer');
  if (btn && drawer) {
    const set = (open) => {
      drawer.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      document.documentElement.classList.toggle('is-locked', open);
    };
    btn.addEventListener('click', () => set(!drawer.classList.contains('is-open')));
    drawer.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  }

  document.querySelectorAll('.ttl__en').forEach((t) => t.querySelectorAll('.mask').forEach((m, i) => m.style.setProperty('--m', i)));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (el.classList.contains('rv')) {
        const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('rv'));
        el.style.setProperty('--rv-delay', `${sibs.indexOf(el) * 0.12}s`);
      }
      el.classList.add('is-on');
      if (el.dataset.shuffle) shuffle(el);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.rv, .ttl__en, [data-shuffle]').forEach((el) => io.observe(el));

  const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*<>:;+';
  function shuffle(el) {
    const word = el.dataset.shuffle;
    const start = performance.now();
    const step = (now) => {
      const t = (now - start) / 1400;
      el.textContent = [...word].map((c, i) => {
        if (c === '-' || t > (i + 1) / word.length) return c;
        return POOL[Math.floor(Math.random() * POOL.length)];
      }).join('');
      if (t < 1) requestAnimationFrame(step); else el.textContent = word;
    };
    requestAnimationFrame(step);
  }

  const pxs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--marquee-pxs')) || 40;
  const fit = () => document.querySelectorAll('.marquee__track').forEach((m) => {
    m.style.setProperty('--marquee-dur', `${m.scrollWidth / 2 / pxs}s`);
  });
  document.fonts.ready.then(fit);
  window.addEventListener('resize', fit);
})();
