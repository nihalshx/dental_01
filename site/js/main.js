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

  let netCountry = 'qa', mapReady = false, pendingMap = null;
  function buildNetwork() {
    const tabs = $('[data-net-tabs]'), list = $('[data-net-list]'); if (!tabs) return;
    tabs.innerHTML = D.countries.map(c => `<button class="net__tab" type="button" role="tab" data-country="${c.id}"
      aria-selected="${c.id === netCountry}"><span>${c[lang]}</span><span class="net__tabn" dir="ltr">${c.branches.length}</span></button>`).join('');
    const render = (animate) => {
      const c = D.countries.find(x => x.id === netCountry);
      list.innerHTML = `<p class="net__count">${fill(T('netCount'), { n: c.branches.length })}</p><ul class="net__list">` +
        c.branches.map(([name, addr, land, mob]) => {
          const q = encodeURIComponent(`Kings Dental Center ${name} ${c.en}`);
          return `<li class="branch" data-name="${esc(name)}">
            <h3 class="branch__name">${esc(name)}</h3>
            <p class="branch__addr">${esc(addr)}</p>
            <div class="branch__links">
              <a href="tel:${land[1]}" dir="ltr">${land[0]}</a>
              <a href="tel:${mob[1]}" dir="ltr" aria-label="${T('mobile')} ${mob[0]}">${mob[0]}</a>
              <a class="branch__dir" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">${T('directions')}</a>
            </div></li>`;
        }).join('') + '</ul>';
      $$('.net__tab', tabs).forEach(b => b.setAttribute('aria-selected', b.dataset.country === netCountry));
      $$('.branch', list).forEach(li => li.addEventListener('click', e => { if (!e.target.closest('a')) setMap(li.dataset.name, c.en); }));
      if ($('[data-net-map]')) { const first = c.branches[0][0]; mapReady ? setMap(first, c.en) : (pendingMap = [first, c.en]); }
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
    const param = new URLSearchParams(location.search).get('service') || '';
    $$('[data-service-select]').forEach(svc => {
      const keep = svc.value || param;
      svc.innerHTML = `<option value="">${T('fAny')}</option>` + ORDER.map(s => `<option value="${s}">${tName(s)}</option>`).join('');
      svc.value = ORDER.includes(keep) ? keep : '';
    });
    $$('[data-clinic-select]').forEach(cl => {
      const keepC = cl.value;
      cl.innerHTML = `<option value="">${T('fClinicAny')}</option>` + D.countries.map(c =>
        `<optgroup label="${c[lang]}">${c.branches.map(b => `<option value="${esc(b[0])}">${esc(b[0])}</option>`).join('')}</optgroup>`).join('');
      cl.value = keepC;
    });
    const day = $('[data-day-select]'); if (!day) return;
    const { day: today } = dohaNow();
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

  function initQuick() {
    const q = $('[data-quick]'); if (!q) return;
    q.addEventListener('submit', e => {
      e.preventDefault();
      const text = fill(T('qbMsg'), { s: q.service.value ? tName(q.service.value) : T('fAny'), c: q.clinic.value || T('fClinicAny') });
      window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    });
  }

  /* map beside the branch list: follows the branch you pick */
  function setMap(name, countryEn) {
    const f = $('[data-net-map]'); if (!f) return;
    const q = encodeURIComponent(`Kings Dental Center ${name} ${countryEn}`);
    const src = `https://maps.google.com/maps?q=${q}&z=14&output=embed`;
    if (f.dataset.q !== q) { f.dataset.q = q; f.src = src; }
    $('[data-net-mapname]').textContent = `Kings Dental Center, ${name}`;
    $$('.branch').forEach(b => b.classList.toggle('is-on', b.dataset.name === name));
  }

  /* ---------------- lazy videos ---------------- */
  function initVideos() {
    if (reduced) return; // keep the still fallbacks
    const load = v => {
      if (v.src) return;
      v.src = v.dataset.src;
      v.addEventListener('canplay', () => { v.classList.add('is-ready'); v.play().catch(() => {}); }, { once: true });
      if (v.hasAttribute('data-once')) v.addEventListener('ended', () => v.classList.add('is-done'), { once: true });
      v.addEventListener('error', () => v.remove(), { once: true });
    };
    const io = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target, once = v.hasAttribute('data-once');
      if (e.isIntersecting) { load(v); if (!(once && v.classList.contains('is-done'))) v.play?.().catch(() => {}); } else if (v.src && !once) v.pause();
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

  /* ---------- hero: draw the tooth frame that matches the scroll position ---------- */
  function heroSequence() {
    const hx = $('.hx'); if (!hx) return;
    const canvas = $('.hx__canvas', hx), ctx = canvas.getContext('2d');
    const N = +hx.dataset.frames, base = hx.dataset.seq, ext = hx.dataset.ext;
    const [cy, ch] = (hx.dataset.crop || '0,1').split(',').map(Number);
    const imgs = new Array(N), state = { f: 0, zoom: 1 };
    let W = 0, H = 0, dpr = 1;
    const url = i => `${base}${String(i + 1).padStart(3, '0')}.${ext}`;
    const near = i => { for (let d = 0; d < N; d++) { const a = imgs[i - d], b = imgs[i + d]; if (a && a.complete && a.naturalWidth) return a; if (b && b.complete && b.naturalWidth) return b; } return null; };
    const draw = () => {
      const img = near(Math.round(state.f)); if (!img) return;
      const sw = img.naturalWidth, sh = img.naturalHeight * ch, sy = img.naturalHeight * cy;
      const s = Math.min(H / sh, (W * 1.35) / sw) * state.zoom;
      const dw = sw * s, dh = sh * s;
      ctx.fillStyle = '#030303'; ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, 0, sy, sw, sh, (W - dw) / 2, (H - dh) / 2 + H * 0.02, dw, dh);
    };
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth * dpr; H = canvas.clientHeight * dpr;
      canvas.width = W; canvas.height = H; draw();
    };
    // first frame now, the rest in order of need
    const load = i => { if (imgs[i]) return; const im = new Image(); im.decoding = 'async'; im.onload = draw; im.src = url(i); imgs[i] = im; };
    load(0);
    const rest = () => { for (let i = 1; i < N; i++) load(i); };
    'requestIdleCallback' in window ? requestIdleCallback(rest, { timeout: 800 }) : setTimeout(rest, 300);
    addEventListener('resize', size); size();

    // intro
    const words = $$('.hx__wi');
    gsap.timeline()
      .from(canvas, { opacity: 0, scale: 1.08, duration: 1.8, ease: 'expo.out' }, 0)
      .from(words, { yPercent: 110, duration: 1.4, stagger: .12, ease: 'expo.out' }, .15)
      .from('.hx__top > *, .hx__lede, .qb', { y: 24, opacity: 0, duration: 1, stagger: .07, ease: 'power3.out' }, .55)
      .from('.bar__in > *', { y: -12, opacity: 0, duration: .6, stagger: .05, ease: 'power2.out' }, .3);

    // scroll: the tooth turns, the words part, the interface steps back
    const sign = rtl() ? -1 : 1;
    gsap.timeline({ scrollTrigger: { trigger: hx, start: 'top top', end: 'bottom bottom', scrub: .4 } })
      .to(state, { f: N - 1, ease: 'none', duration: 1, onUpdate: draw }, 0)
      .to(state, { zoom: 1.07, ease: 'none', duration: 1 }, 0)
      .to('.hx__w--a .hx__wi', { xPercent: -28 * sign, ease: 'none', duration: 1 }, 0)
      .to('.hx__w--b .hx__wi', { xPercent: 28 * sign, ease: 'none', duration: 1 }, 0)
      .to('.hx__foot, .hx__top, .hx__cue', { opacity: 0, y: -30, ease: 'power1.in', duration: .3 }, 0)
      .to('.hx__title', { opacity: 0, ease: 'power1.in', duration: .25 }, .75);
  }

  /* header turns light over dark sections */
  function darkHeader() {
    const bar = $('.bar'), on = new Set();
    $$('[data-dark]').forEach(sec => ScrollTrigger.create({ trigger: sec, start: 'top 36px', end: 'bottom 36px', refreshPriority: -1,
      onToggle: s => { s.isActive ? on.add(sec) : on.delete(sec); bar.classList.toggle('is-dark', on.size > 0); } }));
  }

  function homeMotion() {
    heroSequence();

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

    // network: numbers count up
    $$('.stat__n').forEach((el, i) => {
      const n = { v: 0 };
      gsap.to(n, { v: +el.dataset.count, duration: 1.6 + i * .15, ease: 'power3.out', snap: { v: 1 },
        onUpdate: () => (el.textContent = n.v), scrollTrigger: { trigger: '.stats', start: 'top 80%', once: true } });
    });
    rise('.stat', '.stats', { stagger: .1 });
    rise('.net__title, .net__lede, .net__tabs', '.net__title');
    // map loads only when the section comes near
    ScrollTrigger.create({ trigger: '.net', start: 'top 150%', once: true, onEnter: () => { mapReady = true; if (pendingMap) setMap(...pendingMap); } });

    // marquee: drifts on its own, speeds up and reverses with your scrolling
    const mq = $('[data-marq]');
    if (mq) {
      const setW = () => mq.firstElementChild.offsetWidth;
      let x = 0, vel = 0, dir = rtl() ? 1 : -1;
      ScrollTrigger.create({ trigger: '.marq', start: 'top bottom', end: 'bottom top', onUpdate: s => { vel = s.getVelocity() / 300; dir = (s.direction > 0 ? -1 : 1) * (rtl() ? -1 : 1); } });
      gsap.ticker.add((t, dt) => {
        const w = setW(); if (!w) return;
        x += (dir * (0.6 + Math.min(Math.abs(vel), 8))) * dt / 16;
        vel *= 0.92;
        if (x <= -w) x += w; if (x > 0) x -= w;
        mq.style.transform = `translate3d(${x}px,0,0)`;
      });
    }

    // finale: the line and buttons arrive as the crown finishes forming
    gsap.from('.finale__copy > *', { y: 40, opacity: 0, duration: 1.2, stagger: .12, ease: 'expo.out', delay: 1.2, scrollTrigger: { trigger: '.finale', start: 'top 40%', once: true } });

    // tourism image drifts
    gsap.fromTo('.tour__media img', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.tour', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.tour__media', { clipPath: 'inset(0 0 0 100% round 22px)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: '.tour', start: 'top 75%', once: true } });
    rise('.tour__copy > *', '.tour__copy');
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

  /* ---------------- full-screen menu ---------------- */
  function initMenu() {
    const btn = $('[data-menu-btn]'), menu = $('[data-menu]'); if (!btn) return;
    let open = false;
    const set = v => {
      open = v; btn.setAttribute('aria-expanded', v);
      document.documentElement.classList.toggle('menu-open', v);
      if (v) { menu.hidden = false; lenis?.stop(); }
      else lenis?.start();
      if (hasGsap && !reduced) {
        gsap.to(menu, { clipPath: v ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)', duration: v ? .9 : .6, ease: 'expo.inOut', onComplete: () => { if (!v) menu.hidden = true; } });
        if (v) gsap.from($$('.menu__main a, .menu__side > *', menu), { yPercent: 60, opacity: 0, duration: .9, stagger: .05, ease: 'expo.out', delay: .25 });
      } else { menu.style.clipPath = v ? 'none' : ''; if (!v) menu.hidden = true; }
    };
    btn.addEventListener('click', () => set(!open));
    $$('a', menu).forEach(a => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && open) { set(false); btn.focus(); } });
  }

  /* ---------------- page transitions between pages ---------------- */
  function initCurtain() {
    const cur = $('.curtain'); if (!cur || !hasGsap || reduced) return;
    const crown = $('.curtain__crown', cur);
    gsap.set(cur, { y: 0, yPercent: 100 }); // take over the CSS starting position so offsets don't stack
    if (store.sget('kdc-curtain')) { // arriving: lift the curtain off the new page
      store.sset('kdc-curtain', '');
      gsap.set(cur, { yPercent: 0 }); gsap.set(crown, { opacity: 1 });
      gsap.timeline().to(crown, { opacity: 0, scale: .9, duration: .3, delay: .1 }).to(cur, { yPercent: -100, duration: .8, ease: 'expo.inOut' }, '<');
    }
    document.addEventListener('click', e => {
      const a = e.target.closest('a'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
      const href = a.getAttribute('href') || '';
      if (!/\.html(\?|#|$)/.test(href) || /^(https?:|mailto:|tel:)/.test(href)) return;
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname) return;
      e.preventDefault();
      store.sset('kdc-curtain', '1');
      gsap.timeline({ onComplete: () => (location.href = url.href) })
        .fromTo(cur, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: 'expo.inOut' })
        .fromTo(crown, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: .35 }, '-=.25');
    });
    addEventListener('pageshow', e => { if (e.persisted) gsap.set(cur, { yPercent: 100 }); }); // back button
    setTimeout(() => { if (!store.sget('kdc-curtain') && gsap.getProperty(cur, 'yPercent') === 0) gsap.set(cur, { yPercent: -100 }); }, 2500);
  }

  /* ---------------- boot ---------------- */
  // safety net first: whatever fails below, the page never stays behind the loader
  setTimeout(() => { const l = $('.loader'); if (l) { l.remove(); lenis?.start(); document.documentElement.classList.remove('lenis-stopped'); } }, 4500);
  const safe = (fn, ...a) => { try { return fn(...a); } catch (err) { console.error('[kdc]', err); } };
  safe(applyLang);
  safe(initForm);
  safe(initQuick);
  safe(initMenu);
  safe(initVideos);
  $$('[data-year]').forEach(e => (e.textContent = new Date().getFullYear()));
  setInterval(renderStatus, 20000);

  $('[data-lang-toggle]').addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    store.set('kdc-lang', lang);
    splits.forEach(s => s.revert()); splits = [];
    applyLang();
    if (hasGsap && !reduced) {
      ['.th__title', '.kids__title'].forEach(s => splitLines(s, { duration: 1, stagger: .08 }));
      ScrollTrigger.refresh();
    }
  });

  safe(initScroll);
  safe(initCurtain);
  const go = () => {
    if (hasGsap && !reduced) {
      if (PAGE === 'home') safe(homeMotion);
      if (PAGE === 'treatment') safe(treatmentMotion);
      safe(footerMotion);
      safe(darkHeader); // after the pins, so its positions include the pinned scroll length
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
