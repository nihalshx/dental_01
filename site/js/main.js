/* Kings Dental Center: interactions and motion.
   GSAP 3 + ScrollTrigger + SplitText, Lenis smooth scroll.
   Everything degrades: no JS shows the full page, reduced motion shows final states. */
(() => {
  const D = window.KDC;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rtl = () => document.documentElement.dir === 'rtl';
  const hasGsap = typeof gsap !== 'undefined';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  let lang = store.get('kdc-lang') === 'ar' ? 'ar' : 'en';
  const T = k => (D.t[lang] && D.t[lang][k] !== undefined ? D.t[lang][k] : D.t.en[k]);
  const fill = (str, map) => str.replace(/\{(\w)\}/g, (_, k) => map[k] ?? '');

  /* ---------------- crown mask (data URI works on file:// and https) ---------------- */
  const crownD = $('.loader__crown path').getAttribute('d');
  const crownSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 228 815 492"><path fill="#000" fill-rule="evenodd" d="${crownD}"/></svg>`;
  document.documentElement.style.setProperty('--crown-mask', `url("data:image/svg+xml,${encodeURIComponent(crownSvg)}")`);

  /* ---------------- Doha time and opening status ---------------- */
  function dohaNow() {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Qatar', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const g = t => p.find(x => x.type === t).value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday'));
    return { day, h: +g('hour') % 24, m: +g('minute') };
  }
  function fmtHour(h) {
    if (h === 24 || h === 0) return T('midnight');
    const h12 = h % 12 || 12;
    if (lang === 'ar') return `${h12} ${h < 12 ? 'صباحًا' : 'مساءً'}`;
    return `${h12} ${h < 12 ? 'AM' : 'PM'}`;
  }
  function status() {
    const { day, h, m } = dohaNow();
    const now = h + m / 60;
    const [o, c] = D.hours[day];
    if (now >= o && now < c) return { open: true, until: c };
    if (now < o) return { open: false, today: true, at: o, day };
    const nd = (day + 1) % 7;
    return { open: false, today: false, at: D.hours[nd][0], day: nd };
  }
  function renderStatus() {
    const s = status();
    document.body.classList.toggle('is-open', s.open);
    const short = s.open ? fill(T('openUntil'), { t: fmtHour(s.until) })
      : s.today ? fill(T('opensToday'), { t: fmtHour(s.at) })
      : fill(T('opensAt'), { d: T('tomorrow'), t: fmtHour(s.at) });
    const long = s.open ? fill(T('longOpen'), { t: fmtHour(s.until) })
      : fill(T('longClosed'), { d: s.today ? T('today').toLowerCase() : T('tomorrow'), t: fmtHour(s.at) });
    $$('[data-status-text]').forEach(e => (e.textContent = short));
    $$('[data-status-short]').forEach(e => (e.textContent = short));
    $$('[data-status-long]').forEach(e => (e.textContent = long));
    const { h, m, day } = dohaNow();
    $$('[data-clock]').forEach(e => (e.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`));
    $$('[data-hours] tr').forEach(tr => tr.classList.toggle('is-today', +tr.dataset.day === day));
  }

  /* ---------------- builders ---------------- */
  function buildHours() {
    const order = [6, 0, 1, 2, 3, 4, 5]; // week starts Saturday in Qatar
    $('[data-hours]').innerHTML = order.map(d => {
      const [o, c] = D.hours[d];
      return `<tr data-day="${d}"><td>${D.days[lang][d]}</td><td>${fmtHour(o)} – ${fmtHour(c)}</td></tr>`;
    }).join('');
  }

  function buildServices() {
    const ul = $('[data-services]');
    ul.innerHTML = D.services.map((s, i) => {
      const c = s[lang];
      return `<li class="svc__item" data-slug="${s.slug}">
        <button class="svc__btn" type="button" aria-expanded="false" aria-controls="svc-${i}">
          <span class="svc__name">${c.name}</span>
          <span class="svc__short">${c.short}</span>
          <span class="svc__icon" aria-hidden="true"></span>
        </button>
        <div class="svc__panel" id="svc-${i}" role="region" aria-label="${c.name}">
          <div class="svc__panel-in">
            <div class="svc__img" data-initial="${D.services[i].en.name[0]}">
              <img src="assets/img/services/${s.slug}.png" alt="${c.name} at Kings Dental Center" width="1200" height="900" loading="lazy">
            </div>
            <div>
              <p class="svc__long">${c.long}</p>
              <a class="btn btn--ink" href="#book" data-book-service="${s.slug}">${T('bookThis')}</a>
            </div>
            <span></span>
          </div>
        </div>
      </li>`;
    }).join('');
    $$('.svc__img img', ul).forEach(img => {
      const mark = () => img.closest('.svc__img').classList.add('is-empty');
      img.addEventListener('error', mark);
      if (img.complete && img.naturalWidth === 0) mark();
    });
    $$('.svc__btn', ul).forEach(btn => btn.addEventListener('click', () => toggle(btn.closest('.svc__item'), '.svc__panel', btn)));
    $$('[data-book-service]', ul).forEach(a => a.addEventListener('click', () => {
      const sel = $('[data-service-select]');
      sel.value = a.dataset.bookService;
    }));
  }

  function buildFaq() {
    $('[data-faq]').innerHTML = D.faq.map((f, i) => {
      const [q, a] = f[lang];
      return `<div class="qa"><button class="qa__q" type="button" aria-expanded="false" aria-controls="qa-${i}">
        <span>${q}</span><span class="svc__icon" aria-hidden="true"></span></button>
        <div class="qa__a" id="qa-${i}" role="region"><p>${a}</p></div></div>`;
    }).join('');
    $$('.qa__q').forEach(b => b.addEventListener('click', () => toggle(b.closest('.qa'), '.qa__a', b)));
  }

  function buildSelects() {
    const svc = $('[data-service-select]');
    const keep = svc.value;
    svc.innerHTML = `<option value="">${T('fAny')}</option>` + D.services.map(s => `<option value="${s.slug}">${s[lang].name}</option>`).join('');
    svc.value = keep;
    const day = $('[data-day-select]');
    const { day: today } = dohaNow();
    let opts = `<option value="soonest">${T('fSoonest')}</option>`;
    for (let i = 0; i < 7; i++) {
      const d = (today + i) % 7;
      const label = i === 0 ? T('today') : i === 1 ? T('tomorrow') : D.days[lang][d];
      const cap = label.charAt(0).toUpperCase() + label.slice(1);
      opts += `<option value="${D.days.en[d]}">${cap}</option>`;
    }
    day.innerHTML = opts;
  }

  /* accordion: animate height so the change is visible */
  function toggle(item, panelSel, btn) {
    const panel = $(panelSel, item);
    const open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
    if (!hasGsap || reduced) { panel.style.height = open ? 'auto' : '0px'; return; }
    gsap.killTweensOf(panel);
    if (open) {
      gsap.fromTo(panel, { height: panel.offsetHeight }, { height: 'auto', duration: .7, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() });
      const kids = panel.firstElementChild.children;
      gsap.from(kids, { y: 18, opacity: 0, duration: .6, stagger: .06, ease: 'power3.out' });
    } else {
      gsap.to(panel, { height: 0, duration: .5, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() });
    }
  }

  /* ---------------- language ---------------- */
  function applyLang() {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(el => {
      const v = T(el.dataset.i18n);
      if (v !== undefined) el.textContent = v;
    });
    const btn = $('[data-lang-toggle]');
    btn.textContent = lang === 'ar' ? 'English' : 'عربي';
    btn.lang = lang === 'ar' ? 'en' : 'ar';
    btn.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    buildHours(); buildServices(); buildFaq(); buildSelects(); renderStatus();
  }

  /* ---------------- booking form -> WhatsApp ---------------- */
  function initForm() {
    const f = $('[data-book]');
    const msg = $('.form__msg', f);
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (f.website.value) return; // honeypot
      const name = f.name.value.trim(), phone = f.phone.value.trim();
      f.name.setAttribute('aria-invalid', !name);
      f.phone.setAttribute('aria-invalid', phone.replace(/\D/g, '').length < 7);
      if (!name || phone.replace(/\D/g, '').length < 7) { msg.textContent = T('fNeed'); (name ? f.phone : f.name).focus(); return; }
      const s = D.services.find(x => x.slug === f.service.value);
      const text = fill(T('waMsg'), {
        n: name, p: phone,
        s: s ? s[lang].name : T('fAny'),
        w: f.when.options[f.when.selectedIndex].text
      });
      window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      msg.textContent = T('fOpened');
    });
  }

  /* ---------------- lazy videos (drop files into assets/video) ---------------- */
  function initVideos() {
    const vids = $$('video[data-src]');
    const load = v => {
      if (v.src) return;
      v.src = v.dataset.src;
      v.addEventListener('canplay', () => { v.classList.add('is-ready'); v.play().catch(() => {}); }, { once: true });
      v.addEventListener('error', () => v.remove(), { once: true });
    };
    if (reduced) return; // keep the still fallbacks
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { load(e.target); e.target.play?.().catch(() => {}); }
      else if (e.target.src) e.target.pause();
    }), { rootMargin: '200px' });
    vids.forEach(v => io.observe(v));
  }

  /* ---------------- motion ---------------- */
  let lenis, heroSplit, statementSplit;

  function initScroll() {
    if (!hasGsap) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);
    if (!reduced && typeof Lenis !== 'undefined') {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const t = $(id);
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: id === '#top' ? 0 : -72, duration: 1.4 });
      }));
    }
    const bar = $('.bar');
    ScrollTrigger.create({ start: 24, end: 'max', onToggle: s => bar.classList.toggle('is-solid', s.isActive) });
  }

  function playLoader(done) {
    const loader = $('.loader');
    if (reduced || !hasGsap || store.sget('kdc-seen')) { loader.remove(); done(); return; }
    store.sset('kdc-seen', '1');
    lenis?.stop();
    const path = $('path', loader);
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.timeline({ onComplete: () => { loader.remove(); lenis?.start(); } })
      .to(path, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' })
      .to(path, { fillOpacity: 1, strokeOpacity: 0, duration: .45, ease: 'power1.out' }, '-=.25')
      .to('.loader__crown', { scale: .14, y: () => -innerHeight / 2 + 36, x: () => {
          const b = $('.brand__crown').getBoundingClientRect(); return b.left + b.width / 2 - innerWidth / 2;
        }, duration: .9, ease: 'expo.inOut' }, '+=.15')
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'expo.inOut' }, '<.1')
      .add(done, '<.35');
  }

  function heroIntro() {
    if (!hasGsap || reduced) return;
    heroSplit = SplitText.create('.hero__title', { type: 'lines', mask: 'lines', linesClass: 'ln', autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, { yPercent: 115, rotate: 2, duration: 1.25, stagger: .1, ease: 'expo.out' });
      } });
    gsap.timeline()
      .from('.hero__kicker', { y: 16, opacity: 0, duration: .8, ease: 'power3.out' }, .1)
      .from('.hero__lede, .hero__actions', { y: 24, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out' }, .35)
      .from('.arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 22px 22px)', duration: 1.4, ease: 'expo.inOut' }, 0)
      .from('.arch__crown', { scale: 1.25, opacity: 0, duration: 1.6, ease: 'expo.out' }, .5)
      .to('.arch__sheen', { xPercent: 240, duration: 1.6, ease: 'power2.inOut' }, 1.2)
      .from('.bar__in > *', { y: -12, opacity: 0, duration: .6, stagger: .05, ease: 'power2.out' }, .2);

    // hero media drifts slower than the page
    gsap.to('.arch', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__copy', { yPercent: 14, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    // sheen again on hover
    $('.arch').addEventListener('mouseenter', () => gsap.fromTo('.arch__sheen', { xPercent: -120 }, { xPercent: 240, duration: 1.2, ease: 'power2.inOut' }));
  }

  function throughCrown() {
    if (!hasGsap || reduced) return;
    const mask = $('.through__mask');
    const state = { s: 0 };
    const start = () => Math.min(innerWidth, innerHeight) * (innerWidth < 860 ? .78 : .46);
    const end = () => Math.max(innerWidth, innerHeight) * 42;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.through', start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true }
    });
    tl.fromTo(state, { s: start }, {
        s: end, ease: 'power4.in', duration: 1,
        onUpdate: () => mask.style.setProperty('--s', state.s + 'px')
      })
      .fromTo('.through__fill', { scale: 1.15 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .to('.through__copy > *', { opacity: 1, y: 0, stagger: .08, duration: .25, ease: 'power2.out' }, .78)
      .to({}, { duration: .25 });
    mask.style.setProperty('--s', start() + 'px');
  }

  function servicesMotion() {
    if (!hasGsap || reduced) return;
    gsap.from('.svc__item', { y: 40, opacity: 0, duration: .9, stagger: .06, ease: 'power3.out',
      scrollTrigger: { trigger: '.svc', start: 'top 82%', once: true } });

    // image peek follows the cursor over the list (desktop)
    const peek = $('.svc-peek'), img = $('.svc-peek__img');
    if (getComputedStyle(peek).display === 'none') return;
    const xTo = gsap.quickTo(peek, 'x', { duration: .55, ease: 'power3' });
    const yTo = gsap.quickTo(peek, 'y', { duration: .55, ease: 'power3' });
    const loaded = {};
    D.services.forEach(s => { const i = new Image(); i.onload = () => (loaded[s.slug] = i.src); i.src = `assets/img/services/${s.slug}.png`; });
    const list = $('.svc');
    let nameRight = 0;
    list.addEventListener('pointermove', e => {
      const n = e.target.closest('.svc__btn')?.querySelector('.svc__name');
      if (n) { const r = n.getBoundingClientRect(); nameRight = rtl() ? r.left : r.right; }
      const w = peek.offsetWidth, h = peek.offsetHeight;
      let x = rtl() ? Math.min(e.clientX - 40 - w, nameRight - 32 - w) : Math.max(e.clientX + 40, nameRight + 32);
      x = Math.max(24, Math.min(x, innerWidth - w - 24));
      xTo(x); yTo(Math.max(80, Math.min(e.clientY - h / 2, innerHeight - h - 24)));
    });
    let current = null;
    list.addEventListener('pointerover', e => {
      const item = e.target.closest('.svc__item');
      const slug = item && !item.classList.contains('is-open') && e.target.closest('.svc__btn') ? item.dataset.slug : null;
      if (slug === current) return;
      current = slug;
      if (slug && loaded[slug]) {
        img.style.backgroundImage = `url("${loaded[slug]}")`;
        gsap.to(img, { scale: 1, opacity: 1, duration: .5, ease: 'expo.out', overwrite: true });
      } else gsap.to(img, { scale: .6, opacity: 0, duration: .35, ease: 'power2.in', overwrite: true });
    });
    list.addEventListener('pointerleave', () => { current = null; gsap.to(img, { scale: .6, opacity: 0, duration: .35, overwrite: true }); });
  }

  function statementMotion() {
    if (!hasGsap || reduced) return;
    statementSplit = SplitText.create('[data-fill]', { type: 'words', wordsClass: 'w', autoSplit: true,
      onSplit(self) {
        return gsap.to(self.words, { color: '#000', stagger: .1, ease: 'none',
          scrollTrigger: { trigger: '.statement', start: 'top 70%', end: 'bottom 60%', scrub: true } });
      } });
  }

  function sectionMotion() {
    if (!hasGsap || reduced) return;
    $$('.sec-title').forEach(t => {
      if (t.closest('.services')) return;
      gsap.from(t, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 85%', once: true } });
    });
    gsap.from('.insure__list li', { yPercent: 60, opacity: 0, duration: 1, stagger: .09, ease: 'expo.out',
      scrollTrigger: { trigger: '.insure__list', start: 'top 85%', once: true } });
    gsap.from('.voice__ar', { clipPath: 'inset(0 0 0 100%)', duration: 1.6, ease: 'expo.inOut',
      scrollTrigger: { trigger: '.voice', start: 'top 70%', once: true } });
    gsap.from('.clock__time', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.visit', start: 'top 70%', once: true } });
    gsap.from('.hours tr', { opacity: 0, x: -16, stagger: .05, duration: .6, ease: 'power2.out', scrollTrigger: { trigger: '.hours', start: 'top 85%', once: true } });

    // footer wordmark writes itself as you arrive
    const sp = $('.foot__script path');
    const len = sp.getTotalLength();
    gsap.set(sp, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
    gsap.timeline({ scrollTrigger: { trigger: '.foot__mark', start: 'top 95%', end: 'bottom bottom', scrub: .8 } })
      .to(sp, { strokeDashoffset: 0, ease: 'none', duration: 1 })
      .to(sp, { fillOpacity: 1, ease: 'none', duration: .35 }, '-=.2');
  }

  // safety net: whatever happens, content becomes visible
  function safety() {
    setTimeout(() => {
      if (!document.querySelector('.loader')) return;
      document.querySelector('.loader')?.remove();
      lenis?.start();
    }, 4500);
  }

  /* ---------------- boot ---------------- */
  applyLang();
  initForm();
  initVideos();
  $('[data-year]').textContent = new Date().getFullYear();
  setInterval(renderStatus, 20000);

  $('[data-lang-toggle]').addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    store.set('kdc-lang', lang);
    heroSplit?.revert(); statementSplit?.revert();
    applyLang();
    if (hasGsap && !reduced) {
      heroSplit = SplitText.create('.hero__title', { type: 'lines', mask: 'lines', linesClass: 'ln', autoSplit: true,
        onSplit(self) { return gsap.from(self.lines, { yPercent: 115, duration: 1, stagger: .08, ease: 'expo.out' }); } });
      statementMotion();
      ScrollTrigger.refresh();
    }
  });

  initScroll();
  safety();
  const go = () => {
    heroIntro();
    throughCrown();
    servicesMotion();
    statementMotion();
    sectionMotion();
    hasGsap && ScrollTrigger.refresh();
  };
  const ready = () => playLoader(go);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready); else addEventListener('load', ready);
})();
