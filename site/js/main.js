/* Kings Dental Center: interactions and motion, shared by every page.
   GSAP 3 + ScrollTrigger + SplitText, Lenis smooth scroll.
   Everything degrades: no JS shows the full page, reduced motion shows final states. */
(() => {
  const D = window.KDC;
  const TR = window.KDC_TREAT || {};
  const ORDER = window.KDC_TREAT_ORDER || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const PAGE = body.dataset.page;
  const SLUG = body.dataset.slug;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rtl = () => document.documentElement.dir === 'rtl';
  const hasGsap = typeof gsap !== 'undefined';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let lang = store.get('kdc-lang') === 'ar' ? 'ar' : 'en';
  const T = k => (D.t[lang] && D.t[lang][k] !== undefined ? D.t[lang][k] : D.t.en[k]);
  const fill = (str, map) => str.replace(/\{(\w)\}/g, (_, k) => map[k] ?? '');
  const tName = slug => (TR[slug] ? TR[slug][lang].name : slug);

  /* ---------------- crown mask for the signature section ---------------- */
  const crownPath = $('.brand__crown path');
  if (crownPath) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 228 815 492"><path fill="#000" fill-rule="evenodd" d="${crownPath.getAttribute('d')}"/></svg>`;
    document.documentElement.style.setProperty('--crown-mask', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
  }

  /* ---------------- Doha time and opening status ---------------- */
  function dohaNow() {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Qatar', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const g = t => p.find(x => x.type === t).value;
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), h: +g('hour') % 24, m: +g('minute') };
  }
  function fmtHour(h) {
    if (h === 24 || h === 0) return T('midnight');
    const h12 = h % 12 || 12;
    return lang === 'ar' ? `${h12} ${h < 12 ? 'صباحًا' : 'مساءً'}` : `${h12} ${h < 12 ? 'AM' : 'PM'}`;
  }
  function status() {
    const { day, h, m } = dohaNow(), now = h + m / 60, [o, c] = D.hours[day];
    if (now >= o && now < c) return { open: true, until: c };
    if (now < o) return { open: false, today: true, at: o };
    return { open: false, today: false, at: D.hours[(day + 1) % 7][0] };
  }
  function renderStatus() {
    const s = status();
    body.classList.toggle('is-open', s.open);
    const short = s.open ? fill(T('openUntil'), { t: fmtHour(s.until) })
      : s.today ? fill(T('opensToday'), { t: fmtHour(s.at) }) : fill(T('opensAt'), { d: T('tomorrow'), t: fmtHour(s.at) });
    const long = s.open ? fill(T('longOpen'), { t: fmtHour(s.until) })
      : fill(T('longClosed'), { d: s.today ? T('today').toLowerCase() : T('tomorrow'), t: fmtHour(s.at) });
    $$('[data-status-text],[data-status-short]').forEach(e => (e.textContent = short));
    $$('[data-status-long]').forEach(e => (e.textContent = long));
    const { h, m, day } = dohaNow();
    $$('[data-clock]').forEach(e => (e.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`));
    $$('[data-hours] tr').forEach(tr => tr.classList.toggle('is-today', +tr.dataset.day === day));
  }

  /* ---------------- builders (each only runs if its element exists) ---------------- */
  function buildHours() {
    const el = $('[data-hours]'); if (!el) return;
    el.innerHTML = [6, 0, 1, 2, 3, 4, 5].map(d => {
      const [o, c] = D.hours[d];
      return `<tr data-day="${d}"><td>${D.days[lang][d]}</td><td>${fmtHour(o)} – ${fmtHour(c)}</td></tr>`;
    }).join('');
  }

  function buildFaq() {
    const el = $('[data-faq]'); if (!el) return;
    el.innerHTML = D.faq.map((f, i) => {
      const [q, a] = f[lang];
      return `<div class="qa"><button class="qa__q" type="button" aria-expanded="false" aria-controls="qa-${i}">
        <span>${q}</span><span class="pm" aria-hidden="true"></span></button>
        <div class="qa__a" id="qa-${i}" role="region"><p>${a}</p></div></div>`;
    }).join('');
    $$('.qa__q', el).forEach(b => b.addEventListener('click', () => toggle(b.closest('.qa'), '.qa__a', b)));
  }

  let netCountry = 'qa';
  function buildNetwork() {
    const tabs = $('[data-net-tabs]'), list = $('[data-net-list]'); if (!tabs) return;
    tabs.innerHTML = D.countries.map(c => `<button class="net__tab" type="button" role="tab" data-country="${c.id}"
      aria-selected="${c.id === netCountry}"><span>${c[lang]}</span><span class="net__tabn" dir="ltr">${c.branches.length}</span></button>`).join('');
    const render = (animate) => {
      const c = D.countries.find(x => x.id === netCountry);
      list.innerHTML = `<p class="net__count">${fill(T('netCount'), { n: c.branches.length })}</p><ul class="net__list">` +
        c.branches.map(([name, addr, land, mob]) => {
          const q = encodeURIComponent(`Kings Dental Center ${name} ${c.en}`);
          return `<li class="branch">
            <h3 class="branch__name">${esc(name)}</h3>
            <p class="branch__addr">${esc(addr)}</p>
            <div class="branch__links">
              <a href="tel:${land[1]}" dir="ltr">${land[0]}</a>
              <a href="tel:${mob[1]}" dir="ltr" aria-label="${T('mobile')} ${mob[0]}">${mob[0]}</a>
              <a class="branch__dir" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">${T('directions')}</a>
            </div></li>`;
        }).join('') + '</ul>';
      $$('.net__tab', tabs).forEach(b => b.setAttribute('aria-selected', b.dataset.country === netCountry));
      if (animate && hasGsap && !reduced) {
        gsap.from($$('.branch', list), { y: 22, opacity: 0, duration: .55, stagger: .035, ease: 'power3.out' });
      }
      hasGsap && ScrollTrigger.refresh();
    };
    $$('.net__tab', tabs).forEach(b => b.addEventListener('click', () => { netCountry = b.dataset.country; render(true); }));
    tabs.addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const btns = $$('.net__tab', tabs), i = btns.findIndex(b => b.dataset.country === netCountry);
      const dir = (e.key === 'ArrowRight') !== rtl() ? 1 : -1;
      const n = btns[(i + dir + btns.length) % btns.length]; n.focus(); n.click();
    });
    render(false);
  }

  function buildSelects() {
    const svc = $('[data-service-select]'); if (!svc) return;
    const keep = svc.value || new URLSearchParams(location.search).get('service') || '';
    svc.innerHTML = `<option value="">${T('fAny')}</option>` + ORDER.map(s => `<option value="${s}">${tName(s)}</option>`).join('');
    svc.value = ORDER.includes(keep) ? keep : '';
    const cl = $('[data-clinic-select]'), keepC = cl.value;
    cl.innerHTML = `<option value="">${T('fClinicAny')}</option>` + D.countries.map(c =>
      `<optgroup label="${c[lang]}">${c.branches.map(b => `<option value="${esc(b[0])}">${esc(b[0])}</option>`).join('')}</optgroup>`).join('');
    cl.value = keepC;
    const day = $('[data-day-select]'), { day: today } = dohaNow();
    let opts = `<option value="soonest">${T('fSoonest')}</option>`;
    for (let i = 0; i < 7; i++) {
      const d = (today + i) % 7, label = i === 0 ? T('today') : i === 1 ? T('tomorrow') : D.days[lang][d];
      opts += `<option value="${D.days.en[d]}">${label.charAt(0).toUpperCase() + label.slice(1)}</option>`;
    }
    day.innerHTML = opts;
  }

  /* treatment names everywhere + the treatment page's own text */
  function applyTreatText() {
    $$('[data-tname]').forEach(el => { if (TR[el.dataset.tname]) el.textContent = tName(el.dataset.tname); });
    $$('[data-tlead]').forEach(el => { const t = TR[el.dataset.tlead]; if (t) el.textContent = t[lang].lead; });
    if (PAGE === 'treatment' && TR[SLUG]) {
      const t = TR[SLUG][lang];
      $$('[data-tf]').forEach(el => {
        const v = el.dataset.tf.split('.').reduce((o, k) => (o == null ? o : o[k]), t);
        if (v != null) el.textContent = v;
      });
      const n = t.name;
      $$('[data-book-name]').forEach(el => (el.textContent = fill(T('bookName'), { s: lang === 'en' ? n.charAt(0).toLowerCase() + n.slice(1) : n })));
      document.title = `${n} | ${lang === 'ar' ? 'مركز كينجز لطب الأسنان' : 'Kings Dental Center'}`;
    }
  }

  /* accordion: animate height so the change is visible */
  function toggle(item, panelSel, btn) {
    const panel = $(panelSel, item), open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
    if (!hasGsap || reduced) { panel.style.height = open ? 'auto' : '0px'; return; }
    gsap.killTweensOf(panel);
    if (open) gsap.fromTo(panel, { height: panel.offsetHeight }, { height: 'auto', duration: .7, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() });
    else gsap.to(panel, { height: 0, duration: .5, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() });
  }

  /* ---------------- language ---------------- */
  function applyLang() {
    const html = document.documentElement;
    html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(el => { const v = T(el.dataset.i18n); if (v) el.textContent = v; });
    const btn = $('[data-lang-toggle]');
    btn.textContent = lang === 'ar' ? 'English' : 'عربي';
    btn.lang = lang === 'ar' ? 'en' : 'ar';
    btn.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    applyTreatText();
    buildHours(); buildFaq(); buildNetwork(); buildSelects(); renderStatus();
  }

  /* ---------------- booking form -> WhatsApp ---------------- */
  function initForm() {
    const f = $('[data-book]'); if (!f) return;
    const msg = $('.form__msg', f);
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (f.website.value) return; // honeypot
      const name = f.name.value.trim(), phone = f.phone.value.trim(), okPhone = phone.replace(/\D/g, '').length >= 7;
      f.name.setAttribute('aria-invalid', !name); f.phone.setAttribute('aria-invalid', !okPhone);
      if (!name || !okPhone) { msg.textContent = T('fNeed'); (name ? f.phone : f.name).focus(); return; }
      const text = fill(T('waMsg'), {
        n: name, p: phone,
        s: f.service.value ? tName(f.service.value) : T('fAny'),
        c: f.clinic.value || T('fClinicAny'),
        w: f.when.options[f.when.selectedIndex].text
      });
      window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      msg.textContent = T('fOpened');
    });
  }

  /* ---------------- lazy videos ---------------- */
  function initVideos() {
    if (reduced) return; // keep the still fallbacks
    const load = v => {
      if (v.src) return;
      v.src = v.dataset.src;
      v.addEventListener('canplay', () => { v.classList.add('is-ready'); v.play().catch(() => {}); }, { once: true });
      v.addEventListener('error', () => v.remove(), { once: true });
    };
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { load(e.target); e.target.play?.().catch(() => {}); } else if (e.target.src) e.target.pause();
    }), { rootMargin: '200px' });
    $$('video[data-src]').forEach(v => io.observe(v));
  }

  /* ---------------- motion ---------------- */
  let lenis, splits = [];
  const mm = hasGsap ? gsap.matchMedia() : null;

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
        const id = a.getAttribute('href'); if (id.length < 2) return;
        const t = $(id); if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: id === '#top' ? 0 : -72, duration: 1.4 });
      }));
    }
    const bar = $('.bar');
    ScrollTrigger.create({ start: 24, end: 'max', onToggle: s => bar.classList.toggle('is-solid', s.isActive) });
    if (PAGE !== 'home') bar.classList.add('is-solid');
  }

  function playLoader(done) {
    const loader = $('.loader');
    if (!loader) { done(); return; }
    if (reduced || !hasGsap || store.sget('kdc-seen') || location.hash) { loader.remove(); done(); return; }
    store.sset('kdc-seen', '1');
    lenis?.stop();
    const path = $('path', loader), len = path.getTotalLength();
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

  const splitLines = (sel, opts = {}) => {
    if (!$(sel)) return;
    splits.push(SplitText.create(sel, { type: 'lines', mask: 'lines', linesClass: 'ln', autoSplit: true,
      onSplit(self) { return gsap.from(self.lines, { yPercent: 115, rotate: 2, duration: 1.25, stagger: .1, ease: 'expo.out', ...opts }); } }));
  };
  const rise = (targets, trigger, extra = {}) => gsap.from(targets, { y: 40, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out',
    scrollTrigger: { trigger, start: 'top 85%', once: true }, ...extra });

  function homeMotion() {
    // hero
    splitLines('.hero__title');
    gsap.timeline()
      .from('.hero__kicker', { y: 16, opacity: 0, duration: .8, ease: 'power3.out' }, .1)
      .from('.hero__lede, .hero__actions', { y: 24, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out' }, .35)
      .from('.arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 22px 22px)', duration: 1.4, ease: 'expo.inOut' }, 0)
      .from('.arch__crown', { scale: 1.25, opacity: 0, duration: 1.6, ease: 'expo.out' }, .5)
      .to('.arch__sheen', { xPercent: 240, duration: 1.6, ease: 'power2.inOut' }, 1.2)
      .from('.bar__in > *', { y: -12, opacity: 0, duration: .6, stagger: .05, ease: 'power2.out' }, .2);
    gsap.to('.arch', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__copy', { yPercent: 14, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // signature: dive through the crown
    const mask = $('.through__mask'), state = { s: 0 };
    const start = () => Math.min(innerWidth, innerHeight) * (innerWidth < 860 ? .78 : .46);
    gsap.timeline({ scrollTrigger: { trigger: '.through', start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true } })
      .fromTo(state, { s: start }, { s: () => Math.max(innerWidth, innerHeight) * 42, ease: 'power4.in', duration: 1,
        onUpdate: () => mask.style.setProperty('--s', state.s + 'px') })
      .fromTo('.through__fill', { scale: 1.15 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .to('.through__copy > *', { opacity: 1, y: 0, stagger: .08, duration: .25, ease: 'power2.out' }, .78)
      .to({}, { duration: .25 });
    mask.style.setProperty('--s', start() + 'px');

    // treatments: horizontal travel on desktop, native swipe on phones
    rise('.treat__head > *', '.treat');
    mm.add('(min-width: 900px)', () => {
      const track = $('.treat__track'), vp = $('.treat__viewport');
      const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth);
      const sign = () => (rtl() ? 1 : -1);
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.treat__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .7, invalidateOnRefresh: true, anticipatePin: 1 } });
      tl.to(track, { x: () => sign() * dist(), ease: 'none' }, 0)
        .fromTo('.treat__progress', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
      $$('.tcard__media img', track).forEach(img => {
        tl.fromTo(img, { xPercent: () => -sign() * 8 }, { xPercent: () => sign() * 8, ease: 'none' }, 0);
      });
      gsap.from('.tcard', { y: 70, opacity: 0, duration: 1.1, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: '.treat', start: 'top 70%', once: true } });
    });
    mm.add('(max-width: 899px)', () => { rise('.tcard', '.treat__track', { stagger: .05 }); });

    // visit steps: a line draws down as you read
    rise('.step', '.steps__list', { stagger: .14 });
    gsap.fromTo('.steps__line', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps__list', start: 'top 70%', end: 'bottom 60%', scrub: true } });
    gsap.from('.steps__media', { clipPath: 'inset(0 0 100% 0 round 22px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.steps__media', start: 'top 85%', once: true } });
    gsap.fromTo('.steps__media img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top bottom', end: 'bottom top', scrub: true } });

    // children
    gsap.from('.kids__frame', { clipPath: 'inset(100% 0 0 0 round 999px 999px 22px 22px)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: '.kids', start: 'top 75%', once: true } });
    gsap.fromTo('.kids__frame img', { yPercent: -6, scale: 1.15 }, { yPercent: 6, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.kids', start: 'top bottom', end: 'bottom top', scrub: true } });
    splitLines('.kids__title', { scrollTrigger: { trigger: '.kids', start: 'top 70%', once: true } });
    rise('.kids__text, .kids__copy .btn', '.kids__copy');

    // network: count up, then rows
    const num = $('.net__num'), n = { v: 0 };
    gsap.to(n, { v: +num.dataset.count, duration: 1.8, ease: 'power3.out', snap: { v: 1 },
      onUpdate: () => (num.textContent = n.v), scrollTrigger: { trigger: '.net', start: 'top 75%', once: true } });
    rise('.net__lede, .net__tabs', '.net');
    rise('.branch', '.net__panel', { stagger: .035, y: 24 });

    // remaining sections
    $$('.visit .sec-title, .insure .sec-title, .faq .sec-title, .book .sec-title').forEach(t => rise(t, t));
    rise('.insure__list li', '.insure__list', { yPercent: 60, y: 0 });
    gsap.from('.voice__ar', { clipPath: 'inset(0 0 0 100%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.voice', start: 'top 70%', once: true } });
    rise('.clock__time', '.visit');
    rise('.hours tr', '.hours', { stagger: .05, y: 0, x: -16 });
  }

  function treatmentMotion() {
    splitLines('.th__title');
    gsap.timeline()
      .from('.crumb', { y: 12, opacity: 0, duration: .7, ease: 'power3.out' }, .1)
      .from('.th__lead, .th__actions', { y: 24, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out' }, .45)
      .from('.th__frame', { clipPath: 'inset(18% 12% 18% 12% round 28px)', duration: 1.6, ease: 'expo.inOut' }, .2)
      .from('.th__frame img', { scale: 1.3, duration: 1.8, ease: 'expo.out' }, .2);
    gsap.to('.th__frame img', { yPercent: 8, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.th__media', start: 'top top', end: 'bottom top', scrub: true } });
    rise('.tbody__intro, .tbody__at', '.tbody');
    rise('.tsteps .sec-title', '.tsteps');
    rise('.tstep', '.tsteps__list', { stagger: .1 });
    gsap.from('.tcta__in > *', { y: 40, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.tcta', start: 'top 75%', once: true } });
    rise('.tmore .tcard', '.tmore', { stagger: .06 });
  }

  function footerMotion() {
    const sp = $('.foot__script path'); if (!sp) return;
    const len = sp.getTotalLength();
    gsap.set(sp, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
    gsap.timeline({ scrollTrigger: { trigger: '.foot__mark', start: 'top 95%', end: 'bottom bottom', scrub: .8 } })
      .to(sp, { strokeDashoffset: 0, ease: 'none', duration: 1 })
      .to(sp, { fillOpacity: 1, ease: 'none', duration: .35 }, '-=.2');
  }

  /* ---------------- boot ---------------- */
  // safety net first: whatever fails below, the page never stays behind the loader
  setTimeout(() => { const l = $('.loader'); if (l) { l.remove(); lenis?.start(); document.documentElement.classList.remove('lenis-stopped'); } }, 4500);
  const safe = (fn, ...a) => { try { return fn(...a); } catch (err) { console.error('[kdc]', err); } };
  safe(applyLang);
  safe(initForm);
  safe(initVideos);
  $$('[data-year]').forEach(e => (e.textContent = new Date().getFullYear()));
  setInterval(renderStatus, 20000);

  $('[data-lang-toggle]').addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    store.set('kdc-lang', lang);
    splits.forEach(s => s.revert()); splits = [];
    applyLang();
    if (hasGsap && !reduced) {
      ['.hero__title', '.th__title', '.kids__title'].forEach(s => splitLines(s, { duration: 1, stagger: .08 }));
      ScrollTrigger.refresh();
    }
  });

  safe(initScroll);
  const go = () => {
    if (hasGsap && !reduced) {
      if (PAGE === 'home') safe(homeMotion);
      if (PAGE === 'treatment') safe(treatmentMotion);
      safe(footerMotion);
      ScrollTrigger.refresh();
    }
    // arriving with #book etc. from another page
    if (location.hash && $(location.hash)) {
      const jump = () => (lenis ? lenis.scrollTo($(location.hash), { offset: -72, immediate: true, force: true }) : $(location.hash).scrollIntoView());
      [60, 400, 1000].forEach(t => setTimeout(jump, t)); // re-aim after pins and images settle
    }
  };
  const ready = () => { try { playLoader(go); } catch (err) { console.error('[kdc]', err); $('.loader')?.remove(); lenis?.start(); go(); } };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready); else addEventListener('load', ready);
})();
