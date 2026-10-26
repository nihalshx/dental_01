/* Kings Dental Center: virtual receptionist (DEMO).
   Fully scripted in the browser. No AI service, no API, no data leaves the page.
   Booking times are sample availability; nothing is booked. */
(() => {
  const D = window.KDC, TR = window.KDC_TREAT || {}, ORDER = window.KDC_TREAT_ORDER || [];
  if (!D) return;
  const ROOT = document.body.dataset.root || '';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang = () => (document.documentElement.lang === 'ar' ? 'ar' : 'en');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fill = (s, m) => s.replace(/\{(\w+)\}/g, (_, k) => (m[k] ?? ''));

  /* ---------------- copy ---------------- */
  const S = {
    en: {
      title: 'Kings Receptionist', demo: 'Demo', online: 'Replies instantly',
      launcher: 'Chat with us', open: 'Open chat', close: 'Close chat', placeholder: 'Type a message…', send: 'Send', restart: 'Start over',
      note: 'Demo preview. Nothing you type is sent or saved.',
      hello: 'Hello, welcome to Kings Dental Center. I\'m the virtual receptionist. How can I help you today?',
      menu: ['Book an appointment', 'Opening hours', 'Find a clinic', 'Insurance', 'Talk to the team'],
      askTreat: 'Of course. What would you like to book?',
      checkup: 'Check-up / not sure',
      treatAck: 'Good choice. {lead}',
      checkAck: 'No problem, we\'ll start with a full check-up and take it from there.',
      askClinic: 'Which clinic suits you best?',
      showAll: 'Show all clinics', otherCountries: 'Clinics outside Qatar',
      askDay: 'Lovely, {clinic} it is. Which day works for you?',
      askTime: 'Here are the open times on {day}:',
      noTimes: 'That day is fully booked. Could you pick another day?',
      otherDay: 'Another day',
      askName: 'Great, {time} on {day}. May I have your name?',
      askPhone: 'Thanks, {name}. What\'s the best mobile number to reach you?',
      badPhone: 'That number looks too short. Could you type it again, with the country code if you\'re not in Qatar?',
      review: 'Please check your booking:',
      rTreat: 'Treatment', rClinic: 'Clinic', rWhen: 'When', rName: 'Name', rPhone: 'Mobile',
      confirm: 'Confirm booking', change: 'Change something',
      changeWhat: 'What would you like to change?', cTreat: 'Treatment', cClinic: 'Clinic', cTime: 'Day and time',
      done: 'You\'re booked in! 🎉',
      doneCard: 'Booking {ref}',
      doneNote: 'This is a demo, so no appointment was actually made. In the live version, the clinic receives this instantly and you get a WhatsApp confirmation with directions.',
      anything: 'Is there anything else I can help with?',
      hours: 'We\'re open Saturday to Thursday from 7 AM to midnight, and Friday from 2 PM to 10 PM (Doha time).',
      openNow: 'We\'re open right now.', closedNow: 'We\'re closed right now, but you can still book a time.',
      askCountry: 'Which country are you in?',
      branchesIn: 'Our clinics in {country}:', call: 'Call', directions: 'Directions',
      insurance: 'We work with insurers including Al Koot, QLM, MetLife and Allianz. Send a photo of your insurance card and the team will confirm your cover before your visit.',
      team: 'Of course. You can reach the team directly:',
      price: 'Prices depend on what your dentist finds at the examination, so I can\'t quote one here. After your check-up we\'ll explain the plan and its cost before any treatment starts.',
      pain: 'I\'m sorry you\'re in pain. If it\'s urgent, please call us now on +974 3102 6780. Or I can find you the soonest available time.',
      soonest: 'Soonest available time',
      kids: 'Yes, we treat children and teens. Our pediatric dentists take a gentle, affectionate approach so kids feel relaxed.',
      tourism: 'Kings Dental Tourism looks after patients travelling to Qatar. Tell the team your travel dates and the treatment you need, and they\'ll plan your visits around your stay.',
      thanks: 'You\'re very welcome! Anything else?',
      bye: 'Thank you for chatting with Kings Dental Center. Have a lovely day!',
      fallback: 'I\'m only a demo, so I may not understand everything yet. Here\'s what I can help with:',
      treatInfo: '{name}: {lead} Would you like to book it?', yesBook: 'Yes, book it', learnMore: 'Read more',
      today: 'Today', tomorrow: 'Tomorrow', at: '{day}, {time}',
      morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', sample: 'Sample times for the demo'
    },
    ar: {
      title: 'استقبال كينجز', demo: 'تجريبي', online: 'يرد فورًا',
      launcher: 'تحدث معنا', open: 'فتح المحادثة', close: 'إغلاق المحادثة', placeholder: 'اكتب رسالة…', send: 'إرسال', restart: 'ابدأ من جديد',
      note: 'نسخة تجريبية. لا يتم إرسال أو حفظ أي شيء تكتبه.',
      hello: 'مرحبًا بك في مركز كينجز لطب الأسنان. أنا موظف الاستقبال الافتراضي. كيف يمكنني مساعدتك اليوم؟',
      menu: ['حجز موعد', 'مواعيد العمل', 'ابحث عن عيادة', 'التأمين', 'تحدث مع الفريق'],
      askTreat: 'بكل سرور. ما الذي تود حجزه؟',
      checkup: 'فحص عام / لست متأكدًا',
      treatAck: 'اختيار جيد. {lead}',
      checkAck: 'لا مشكلة، سنبدأ بفحص شامل ثم نحدد الخطوات التالية.',
      askClinic: 'أي عيادة تناسبك؟',
      showAll: 'كل العيادات', otherCountries: 'عيادات خارج قطر',
      askDay: 'ممتاز، عيادة {clinic}. أي يوم يناسبك؟',
      askTime: 'هذه الأوقات المتاحة يوم {day}:',
      noTimes: 'هذا اليوم محجوز بالكامل. هل يمكنك اختيار يوم آخر؟',
      otherDay: 'يوم آخر',
      askName: 'رائع، الساعة {time} يوم {day}. ما اسمك؟',
      askPhone: 'شكرًا {name}. ما رقم الجوال الذي نتواصل معك عليه؟',
      badPhone: 'يبدو الرقم قصيرًا. هل يمكنك كتابته مرة أخرى مع رمز الدولة إن لم تكن في قطر؟',
      review: 'يرجى مراجعة حجزك:',
      rTreat: 'العلاج', rClinic: 'العيادة', rWhen: 'الموعد', rName: 'الاسم', rPhone: 'الجوال',
      confirm: 'تأكيد الحجز', change: 'تعديل',
      changeWhat: 'ما الذي تود تعديله؟', cTreat: 'العلاج', cClinic: 'العيادة', cTime: 'اليوم والوقت',
      done: 'تم حجز موعدك! 🎉',
      doneCard: 'الحجز {ref}',
      doneNote: 'هذه نسخة تجريبية، لذلك لم يتم حجز موعد فعلي. في النسخة الفعلية تصل الحجوزات إلى العيادة فورًا وتتلقى تأكيدًا عبر واتساب مع الاتجاهات.',
      anything: 'هل هناك شيء آخر يمكنني مساعدتك به؟',
      hours: 'نعمل من السبت إلى الخميس من 7 صباحًا حتى منتصف الليل، ويوم الجمعة من 2 ظهرًا حتى 10 مساءً (بتوقيت الدوحة).',
      openNow: 'نحن مفتوحون الآن.', closedNow: 'نحن مغلقون الآن، لكن يمكنك حجز موعد.',
      askCountry: 'في أي دولة أنت؟',
      branchesIn: 'عياداتنا في {country}:', call: 'اتصال', directions: 'الاتجاهات',
      insurance: 'نتعامل مع شركات تأمين منها الكوت وQLM وميتلايف وأليانز. أرسل صورة بطاقة التأمين وسيؤكد الفريق تغطيتك قبل زيارتك.',
      team: 'بالتأكيد. يمكنك التواصل مع الفريق مباشرة:',
      price: 'تعتمد الأسعار على ما يجده الطبيب في الفحص، لذلك لا أستطيع ذكر سعر هنا. بعد الفحص نشرح لك الخطة وتكلفتها قبل بدء أي علاج.',
      pain: 'نأسف لأنك تشعر بالألم. إذا كان الأمر عاجلًا يرجى الاتصال الآن على 6780 3102 974+. أو يمكنني إيجاد أقرب موعد متاح.',
      soonest: 'أقرب موعد متاح',
      kids: 'نعم، نعالج الأطفال والمراهقين. يتعامل أطباء أسنان الأطفال لدينا بأسلوب لطيف وحنون ليشعر الأطفال بالراحة.',
      tourism: 'تهتم خدمة كينجز للسياحة العلاجية بالمرضى القادمين إلى قطر. أخبر الفريق بمواعيد سفرك والعلاج الذي تحتاجه وسيرتبون زياراتك.',
      thanks: 'على الرحب والسعة! هل هناك شيء آخر؟',
      bye: 'شكرًا لتواصلك مع مركز كينجز لطب الأسنان. نتمنى لك يومًا سعيدًا!',
      fallback: 'أنا نسخة تجريبية وقد لا أفهم كل شيء بعد. هذا ما يمكنني مساعدتك به:',
      treatInfo: '{name}: {lead} هل تود حجزه؟', yesBook: 'نعم، احجز', learnMore: 'اقرأ المزيد',
      today: 'اليوم', tomorrow: 'غدًا', at: '{day}، {time}',
      morning: 'صباحًا', afternoon: 'ظهرًا', evening: 'مساءً', sample: 'أوقات تجريبية للعرض'
    }
  };
  const t = k => S[lang()][k] ?? S.en[k];
  const tName = s => (TR[s] ? TR[s][lang()].name : s);
  const tLead = s => (TR[s] ? TR[s][lang()].lead : '');

  /* ---------------- dates and sample availability ---------------- */
  function dohaToday() {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Qatar', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const g = k => +p.find(x => x.type === k).value;
    return { date: new Date(Date.UTC(g('year'), g('month') - 1, g('day'))), h: g('hour'), m: g('minute') };
  }
  const dayLabel = (d, i) => {
    if (i === 0) return t('today');
    if (i === 1) return t('tomorrow');
    return new Intl.DateTimeFormat(lang() === 'ar' ? 'ar-QA' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d);
  };
  const fmtTime = mins => {
    const h = Math.floor(mins / 60) % 24, m = mins % 60, h12 = h % 12 || 12;
    const ap = lang() === 'ar' ? (h < 12 ? 'ص' : 'م') : (h < 12 ? 'AM' : 'PM');
    return `${h12}:${String(m).padStart(2, '0')} ${ap}`;
  };
  const hash = s => { let x = 2166136261; for (const c of s) { x ^= c.charCodeAt(0); x = Math.imul(x, 16777619); } return x >>> 0; };
  function slotsFor(dayIndex, clinic) {
    const { date, h, m } = dohaToday();
    const d = new Date(date); d.setUTCDate(d.getUTCDate() + dayIndex);
    const [open, close] = D.hours[d.getUTCDay()];
    const now = h * 60 + m;
    const out = [];
    for (let mins = open * 60 + 30; mins <= close * 60 - 60; mins += 30) {
      if (dayIndex === 0 && mins < now + 60) continue;
      if (hash(`${d.toISOString().slice(0, 10)}|${clinic}|${mins}`) % 3 === 0) continue; // some times already taken
      out.push(mins);
    }
    // keep the list short and spread across the day
    const pick = []; const step = Math.max(1, Math.floor(out.length / 9));
    for (let i = 0; i < out.length && pick.length < 9; i += step) pick.push(out[i]);
    return pick;
  }

  /* ---------------- DOM ---------------- */
  const crown = (document.querySelector('.brand__crown path') || {}).getAttribute?.('d') || '';
  const crownSvg = cls => `<svg class="${cls}" viewBox="100 228 815 492" aria-hidden="true"><path d="${crown}" fill-rule="evenodd"/></svg>`;
  const wrap = document.createElement('div');
  wrap.className = 'rx';
  wrap.innerHTML = `
    <button class="rx__launch" type="button" aria-expanded="false" aria-controls="rx-panel">
      <span class="rx__launch-icon">${crownSvg('rx__launch-crown')}</span>
      <span class="rx__launch-text" data-rx="launcher"></span>
    </button>
    <section class="rx__panel" id="rx-panel" role="dialog" aria-modal="false" aria-labelledby="rx-title" hidden>
      <header class="rx__head">
        <span class="rx__avatar">${crownSvg('rx__avatar-crown')}</span>
        <div class="rx__who">
          <p class="rx__title" id="rx-title"><span data-rx="title"></span> <span class="rx__demo" data-rx="demo"></span></p>
          <p class="rx__status"><span class="rx__dot"></span><span data-rx="online"></span></p>
        </div>
        <button class="rx__icon rx__restart" type="button" data-rx-restart><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="visually-hidden" data-rx="restart"></span></button>
        <button class="rx__icon rx__close" type="button" data-rx-close><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span class="visually-hidden" data-rx="close"></span></button>
      </header>
      <div class="rx__log" role="log" aria-live="polite"></div>
      <form class="rx__input" autocomplete="off">
        <input class="rx__field" name="q" type="text" maxlength="200">
        <button class="rx__send" type="submit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="visually-hidden" data-rx="send"></span></button>
      </form>
      <p class="rx__note" data-rx="note"></p>
    </section>`;
  document.body.appendChild(wrap);
  const $ = s => wrap.querySelector(s);
  const launch = $('.rx__launch'), panel = $('.rx__panel'), log = $('.rx__log'), form = $('.rx__input'), field = $('.rx__field');

  function labels() {
    wrap.querySelectorAll('[data-rx]').forEach(el => (el.textContent = t(el.dataset.rx)));
    field.placeholder = t('placeholder');
    launch.setAttribute('aria-label', t('open'));
    wrap.dir = lang() === 'ar' ? 'rtl' : 'ltr';
  }

  /* ---------------- conversation state ---------------- */
  let st = {}, started = false, busy = Promise.resolve();
  const reset = () => { st = { step: 'menu', treat: null, clinic: null, day: null, dayIdx: null, time: null, name: '', phone: '' }; };
  reset();

  const scroll = () => log.scrollTo({ top: log.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  function add(html, who = 'bot', cls = '') {
    const el = document.createElement('div');
    el.className = `rx__msg rx__msg--${who} ${cls}`;
    el.innerHTML = html;
    log.appendChild(el); scroll();
    return el;
  }
  const clearChips = () => log.querySelectorAll('.rx__chips').forEach(c => c.remove());
  function chips(items) { // items: [label, handler, kind]
    const box = document.createElement('div');
    box.className = 'rx__chips';
    items.forEach(([label, fn, kind]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'rx__chip' + (kind ? ` rx__chip--${kind}` : ''); b.textContent = label;
      b.addEventListener('click', () => { clearChips(); user(label); fn(); });
      box.appendChild(b);
    });
    log.appendChild(box); scroll();
  }
  const user = text => add(esc(text), 'user');
  // bot "types" before each message so the exchange feels natural
  function say(html, opts = {}) {
    busy = busy.then(() => new Promise(res => {
      const typing = add('<span class="rx__typing"><i></i><i></i><i></i></span>', 'bot', 'rx__msg--typing');
      const wait = reduced ? 50 : Math.min(1400, 380 + html.replace(/<[^>]+>/g, '').length * 9);
      setTimeout(() => { typing.remove(); add(html, 'bot', opts.cls || ''); res(); }, wait);
    }));
    return busy;
  }
  const then = fn => (busy = busy.then(() => fn()));

  /* ---------------- flows ---------------- */
  function menu(intro) {
    st.step = 'menu';
    if (intro) say(esc(intro));
    then(() => chips(t('menu').map((label, i) => [label, [bookStart, hoursInfo, findClinic, insurance, team][i]])));
  }

  function bookStart() {
    st.step = 'treat';
    say(esc(t('askTreat')));
    then(() => chips([...ORDER.map(s => [tName(s), () => pickTreat(s)]), [t('checkup'), () => pickTreat('checkup')]]));
  }
  function pickTreat(s) {
    st.treat = s;
    say(esc(s === 'checkup' ? t('checkAck') : fill(t('treatAck'), { lead: tLead(s) })));
    st.changing ? review() : askClinic();
  }

  const popular = ['Asian Town', 'Al Wakrah', 'Duhail', 'Al Markhiya', 'Al Khor', 'Umm Salal'];
  function askClinic() {
    st.step = 'clinic';
    say(esc(t('askClinic')));
    then(() => chips([...popular.map(n => [n, () => pickClinic(n)]), [t('showAll'), allClinics, 'ghost']]));
  }
  function allClinics() {
    const qa = D.countries[0];
    then(() => chips([...qa.branches.filter(b => !popular.includes(b[0])).map(b => [b[0], () => pickClinic(b[0])]),
      ...D.countries.slice(1).flatMap(c => c.branches.map(b => [`${b[0]} (${c[lang()]})`, () => pickClinic(b[0])]))]));
  }
  function pickClinic(n) { st.clinic = n; st.changing ? review() : askDay(); }

  function askDay() {
    st.step = 'day';
    say(esc(fill(t('askDay'), { clinic: st.clinic })));
    const { date } = dohaToday();
    then(() => chips([0, 1, 2, 3, 4, 5].map(i => {
      const d = new Date(date); d.setUTCDate(d.getUTCDate() + i);
      const label = dayLabel(d, i);
      return [label, () => pickDay(i, label)];
    })));
  }
  function pickDay(i, label) {
    st.dayIdx = i; st.day = label;
    const slots = slotsFor(i, st.clinic);
    if (!slots.length) { say(esc(t('noTimes'))); askDayAgain(); return; }
    say(esc(fill(t('askTime'), { day: label })));
    then(() => {
      const box = document.createElement('div');
      box.className = 'rx__chips rx__slots';
      const groups = [[t('morning'), s => s < 720], [t('afternoon'), s => s >= 720 && s < 1020], [t('evening'), s => s >= 1020]];
      groups.forEach(([g, test]) => {
        const list = slots.filter(test); if (!list.length) return;
        const h = document.createElement('p'); h.className = 'rx__slot-h'; h.textContent = g; box.appendChild(h);
        const row = document.createElement('div'); row.className = 'rx__slot-row';
        list.forEach(mins => {
          const b = document.createElement('button'); b.type = 'button'; b.className = 'rx__chip rx__chip--slot'; b.textContent = fmtTime(mins); b.dir = 'ltr';
          b.addEventListener('click', () => { clearChips(); user(b.textContent); pickTime(mins); });
          row.appendChild(b);
        });
        box.appendChild(row);
      });
      const other = document.createElement('button'); other.type = 'button'; other.className = 'rx__chip rx__chip--ghost'; other.textContent = t('otherDay');
      other.addEventListener('click', () => { clearChips(); user(other.textContent); askDayAgain(); });
      const s = document.createElement('p'); s.className = 'rx__sample'; s.textContent = t('sample');
      box.appendChild(other); box.appendChild(s);
      log.appendChild(box); scroll();
    });
  }
  function askDayAgain() {
    const { date } = dohaToday();
    then(() => chips([0, 1, 2, 3, 4, 5, 6].filter(i => i !== st.dayIdx).map(i => {
      const d = new Date(date); d.setUTCDate(d.getUTCDate() + i); const label = dayLabel(d, i);
      return [label, () => pickDay(i, label)];
    })));
  }
  function pickTime(mins) {
    st.time = fmtTime(mins);
    if (st.changing) { review(); return; }
    st.step = 'name';
    say(esc(fill(t('askName'), { time: st.time, day: st.day })));
    then(() => field.focus());
  }
  function gotName(v) {
    st.name = v.replace(/\s+/g, ' ').trim().slice(0, 40);
    st.step = 'phone';
    say(esc(fill(t('askPhone'), { name: st.name.split(' ')[0] })));
    field.type = 'tel'; field.inputMode = 'tel';
  }
  function gotPhone(v) {
    if (v.replace(/\D/g, '').length < 7) { say(esc(t('badPhone'))); return; }
    st.phone = v.trim(); field.type = 'text'; field.inputMode = 'text';
    review();
  }
  function review() {
    st.step = 'review'; st.changing = false;
    say(esc(t('review')));
    const row = (k, v) => `<div class="rx__row"><span>${esc(t(k))}</span><strong>${esc(v)}</strong></div>`;
    say(`<div class="rx__card">${crownSvg('rx__card-crown')}
      ${row('rTreat', st.treat === 'checkup' ? t('checkup') : tName(st.treat))}
      ${row('rClinic', st.clinic)}
      ${row('rWhen', fill(t('at'), { day: st.day, time: st.time }))}
      ${row('rName', st.name)}
      ${row('rPhone', st.phone)}</div>`, { cls: 'rx__msg--card' });
    then(() => chips([[t('confirm'), done, 'primary'], [t('change'), change, 'ghost']]));
  }
  function change() {
    say(esc(t('changeWhat')));
    st.changing = true;
    then(() => chips([[t('cTreat'), bookStart], [t('cClinic'), askClinic], [t('cTime'), askDay]]));
  }
  function done() {
    const ref = 'KDC-' + (hash(st.name + st.phone + st.day + st.time) % 9000 + 1000);
    say(esc(t('done')));
    say(`<div class="rx__card rx__card--done">${crownSvg('rx__card-crown')}
      <p class="rx__ref">${esc(fill(t('doneCard'), { ref }))}</p>
      <p class="rx__done-main">${esc(st.treat === 'checkup' ? t('checkup') : tName(st.treat))}</p>
      <p class="rx__done-sub">${esc(st.clinic)} · ${esc(fill(t('at'), { day: st.day, time: st.time }))}</p>
      <p class="rx__demo-note">${esc(t('doneNote'))}</p></div>`, { cls: 'rx__msg--card' });
    const keep = { name: st.name, phone: st.phone };
    reset(); Object.assign(st, keep);
    menu(t('anything'));
  }

  function hoursInfo() {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Qatar', weekday: 'short', hour: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.find(x => x.type === 'weekday').value);
    const h = +p.find(x => x.type === 'hour').value % 24, [o, c] = D.hours[day];
    say(esc(t('hours')) + '<br><strong>' + esc(h >= o && h < c ? t('openNow') : t('closedNow')) + '</strong>');
    menu(t('anything'));
  }
  function findClinic() {
    say(esc(t('askCountry')));
    then(() => chips(D.countries.map(c => [c[lang()], () => listBranches(c)])));
  }
  function listBranches(c) {
    say(esc(fill(t('branchesIn'), { country: c[lang()] })));
    say(`<ul class="rx__branches">${c.branches.map(b => `<li><strong>${esc(b[0])}</strong><span>${esc(b[1])}</span>
      <span class="rx__b-links"><a href="tel:${b[2][1]}" dir="ltr">${b[2][0]}</a><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Kings Dental Center ' + b[0] + ' ' + c.en)}" target="_blank" rel="noopener">${esc(t('directions'))}</a></span></li>`).join('')}</ul>`, { cls: 'rx__msg--wide' });
    menu(t('anything'));
  }
  function insurance() { say(esc(t('insurance'))); menu(t('anything')); }
  function team() {
    say(esc(t('team')));
    say(`<div class="rx__contact"><a class="rx__btn" href="tel:+97431026780" dir="ltr">+974 3102 6780</a><a class="rx__btn rx__btn--line" href="https://wa.me/97431026780" target="_blank" rel="noopener">WhatsApp</a></div>`);
    menu(t('anything'));
  }

  /* ---------------- free text: simple keyword matching (demo, no AI) ---------------- */
  const has = (s, words) => words.some(w => s.includes(w));
  function understand(raw) {
    const s = raw.toLowerCase();
    if (st.step === 'name') { if (raw.trim().length >= 2) gotName(raw); return; }
    if (st.step === 'phone') { gotPhone(raw); return; }
    const treatHit = ORDER.find(slug => {
      const en = TR[slug].en.name.toLowerCase(), ar = TR[slug].ar.name;
      const keys = { 'root-canal': ['root canal', 'nerve'], orthodontics: ['brace', 'align', 'orthodont', 'straight', 'تقويم'], restorative: ['filling', 'cavity', 'حشو'], implants: ['implant', 'missing tooth', 'زراع'], gums: ['gum', 'bleed', 'لثة'], cosmetic: ['whiten', 'veneer', 'cosmetic', 'smile makeover', 'تجميل', 'تبييض'], children: ['child', 'kid', 'son', 'daughter', 'baby', 'طفل', 'أطفال'], preventive: ['clean', 'scal', 'check', 'فحص', 'تنظيف'] }[slug] || [];
      return s.includes(en) || raw.includes(ar) || has(s, keys) || has(raw, keys);
    });
    if (has(s, ['pain', 'hurt', 'ache', 'emergency', 'urgent', 'swollen', 'broken']) || has(raw, ['ألم', 'وجع', 'طوارئ', 'عاجل'])) {
      say(esc(t('pain')));
      then(() => chips([[t('soonest'), () => { st.treat = 'checkup'; st.clinic = st.clinic || 'Asian Town'; st.step = 'day'; pickDay(0, t('today')); }, 'primary'], [t('menu')[4], team]]));
      return;
    }
    if (has(s, ['book', 'appointment', 'schedule', 'reserve', 'visit']) || has(raw, ['حجز', 'موعد', 'احجز'])) { if (treatHit) pickTreat(treatHit); else bookStart(); return; }
    if (has(s, ['price', 'cost', 'how much', 'fee', 'charge', 'expensive']) || has(raw, ['سعر', 'كم', 'تكلفة', 'أسعار'])) { say(esc(t('price'))); menu(t('anything')); return; }
    if (has(s, ['insur', 'cover', 'al koot', 'qlm', 'metlife', 'allianz']) || has(raw, ['تأمين'])) { insurance(); return; }
    if (has(s, ['hour', 'open', 'close', 'time', 'friday', 'today', 'when']) || has(raw, ['مواعيد', 'مفتوح', 'ساعات', 'الجمعة'])) { hoursInfo(); return; }
    if (has(s, ['where', 'location', 'address', 'branch', 'clinic near', 'nearest', 'direction', 'map', 'dubai', 'sharjah', 'bahrain', 'india', 'kerala', 'calicut']) || has(raw, ['أين', 'فرع', 'عنوان', 'موقع', 'أقرب'])) { findClinic(); return; }
    if (has(s, ['tourism', 'travel', 'visiting', 'tourist', 'abroad']) || has(raw, ['سياحة', 'زائر', 'سفر'])) { say(esc(t('tourism'))); menu(t('anything')); return; }
    if (has(s, ['human', 'person', 'staff', 'call', 'phone', 'whatsapp', 'talk', 'speak']) || has(raw, ['اتصال', 'واتساب', 'موظف'])) { team(); return; }
    if (treatHit === 'children' && !has(s, ['book'])) { say(esc(t('kids'))); then(() => chips([[t('yesBook'), () => pickTreat('children'), 'primary'], [t('learnMore'), () => (location.href = `${ROOT}treatments/children.html`)]])); return; }
    if (treatHit) {
      say(esc(fill(t('treatInfo'), { name: tName(treatHit), lead: tLead(treatHit) })));
      then(() => chips([[t('yesBook'), () => pickTreat(treatHit), 'primary'], [t('learnMore'), () => (location.href = `${ROOT}treatments/${treatHit}.html`)]]));
      return;
    }
    if (has(s, ['thank', 'thx', 'great', 'perfect', 'ok', 'okay']) || has(raw, ['شكر', 'تمام', 'ممتاز'])) { say(esc(t('thanks'))); menu(); return; }
    if (has(s, ['bye', 'goodbye', 'see you']) || has(raw, ['مع السلامة', 'وداعا'])) { say(esc(t('bye'))); return; }
    if (has(s, ['hi', 'hello', 'hey', 'salam', 'good morning', 'good evening']) || has(raw, ['مرحبا', 'السلام', 'أهلا', 'هلا'])) { menu(t('hello')); return; }
    menu(t('fallback'));
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = field.value.trim(); if (!v) return;
    field.value = ''; clearChips(); user(v); understand(v);
  });

  /* ---------------- open / close ---------------- */
  function start() {
    log.innerHTML = ''; reset(); busy = Promise.resolve(); field.type = 'text';
    menu(t('hello')); started = true;
  }
  function open() {
    labels();
    panel.hidden = false; launch.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('rx-open');
    requestAnimationFrame(() => panel.classList.add('is-open'));
    window.__lenis?.stop();
    if (!started) start();
    setTimeout(() => field.focus({ preventScroll: true }), 300);
  }
  function close() {
    panel.classList.remove('is-open'); launch.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('rx-open');
    window.__lenis?.start();
    setTimeout(() => { panel.hidden = true; }, reduced ? 0 : 350);
    launch.focus({ preventScroll: true });
  }
  launch.addEventListener('click', () => (panel.hidden ? open() : close()));
  $('[data-rx-close]').addEventListener('click', close);
  $('[data-rx-restart]').addEventListener('click', start);
  addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });
  log.addEventListener('wheel', e => e.stopPropagation(), { passive: true });
  document.addEventListener('click', e => { const a = e.target.closest('[data-open-chat]'); if (a) { e.preventDefault(); open(); } });

  // follow the site's language switch
  new MutationObserver(() => { labels(); if (started && st.step === 'menu' && log.children.length <= 2) start(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  labels();
  // on the homepage the button waits until you've scrolled past the hero, so it never covers the hero buttons
  const showLaunch = () => launch.classList.toggle('is-shown', document.body.dataset.page !== 'home' || scrollY > innerHeight * 0.85);
  addEventListener('scroll', showLaunch, { passive: true }); showLaunch();
  // a small hello bubble on the launcher after a while (once per visit)
  try {
    if (!sessionStorage.getItem('rx-nudge')) setTimeout(function nudge() { if (!launch.classList.contains('is-shown')) { setTimeout(nudge, 2000); return; } if (panel.hidden) { launch.classList.add('is-nudge'); sessionStorage.setItem('rx-nudge', '1'); } }, 6000);
  } catch (e) {}
  window.KDCReceptionist = { open, close };
})();
