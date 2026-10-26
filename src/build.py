"""Builds site/index.html and site/treatments/*.html from src/ partials and treatments.json.
Run from the project root:  python3 src/build.py"""
import json, html, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = lambda *p: os.path.join(ROOT, 'src', *p)
OUT = os.path.join(ROOT, 'site')
rd = lambda p: open(p, encoding='utf-8').read()
CROWN = rd(os.path.join(ROOT, 'cache', 'crown.d')).strip() if os.path.exists(os.path.join(ROOT, 'cache', 'crown.d')) else rd(S('crown.d')).strip()
SCRIPT = rd(os.path.join(ROOT, 'cache', 'script.d')).strip() if os.path.exists(os.path.join(ROOT, 'cache', 'script.d')) else rd(S('script.d')).strip()
T = json.loads(rd(S('treatments.json')))
ORDER = ['root-canal', 'orthodontics', 'restorative', 'implants', 'gums', 'cosmetic', 'children', 'preventive']
SEQUENCE = {'root-canal', 'orthodontics', 'restorative', 'implants', 'cosmetic'}  # steps that really are an ordered process
e = html.escape

def card(slug, r):
    t = T[slug]['en']
    return (f'<li><a class="tcard" href="{r}treatments/{slug}.html">'
            f'<span class="tcard__media"><img src="{r}assets/img/services/{slug}.png" alt="" width="1448" height="1086" loading="lazy"></span>'
            f'<span class="tcard__name" data-tname="{slug}">{e(t["name"])}</span>'
            f'<span class="tcard__lead" data-tlead="{slug}">{e(t["lead"])}</span></a></li>')

def foot_links(r):
    return '\n      '.join(f'<a href="{r}treatments/{s}.html" data-tname="{s}">{e(T[s]["en"]["name"])}</a>' for s in ORDER)

def page(body, *, title, desc, path, r, home, schema, slug=''):
    head = rd(S('partials', 'head.html'))
    header = rd(S('partials', 'header.html'))
    footer = rd(S('partials', 'footer.html'))
    loader = ('<div class="loader" aria-hidden="true"><svg class="loader__crown" viewBox="100 228 815 492">'
              f'<path d="{CROWN}" fill-rule="evenodd"/></svg></div>'
              '<script>setTimeout(function(){var l=document.querySelector(".loader");if(l){l.remove();document.documentElement.classList.remove("lenis-stopped")}},5000)</script>') if home else ''
    H = '' if home else f'{r}index.html'
    rep = {
        '{{TITLE}}': e(title), '{{DESC}}': e(desc), '{{PATH}}': path, '{{OG}}': 'assets/img/og.jpg',
        '{{SCHEMA}}': schema, '{{LOADER}}': loader, '{{BRAND_HREF}}': '#top' if home else f'{r}index.html',
        '{{FOOT_TREAT}}': foot_links(r),
        '{{MENU_TREAT}}': foot_links(r),
    }
    out = head + body.replace('{{HEADER}}', header).replace('{{FOOTER}}', footer)
    for k, v in rep.items(): out = out.replace(k, v)
    out = out.replace('{{H}}', H).replace('{{R}}', r).replace('{{CROWN_D}}', CROWN).replace('{{SCRIPT_D}}', SCRIPT)
    assert '{{' not in out, [l for l in out.split('\n') if '{{' in l][:3]
    # cache-busting: every css/js link carries a hash of the file, so a new deploy is always fetched fresh
    import re, hashlib
    def ver(m):
        f = os.path.join(OUT, m.group(2))
        h = hashlib.md5(open(f, 'rb').read()).hexdigest()[:8] if os.path.exists(f) else 'x'
        return f'{m.group(1)}{r}{m.group(2)}?v={h}"'
    out = re.sub(r'((?:src|href)=")' + re.escape(r) + r'((?:js|css)/[^"?]+\.(?:js|css))"', ver, out)
    return out

def ld(obj): return '<script type="application/ld+json">\n' + json.dumps(obj, ensure_ascii=False, indent=1) + '\n</script>'

DENTIST = {
    "@context": "https://schema.org", "@type": "Dentist", "name": "Kings Dental Center",
    "url": "https://kingsdentalcenter.com/", "telephone": "+974 3102 6780", "email": "info@kingsdentalcenter.com",
    "image": "https://kingsdentalcenter.com/assets/img/og.jpg",
    "address": {"@type": "PostalAddress", "streetAddress": "Kings Head Office, Gate 8, Grand Mall Building, Asian Town, Industrial Area", "addressLocality": "Doha", "addressCountry": "QA"},
    "openingHoursSpecification": [
        {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], "opens": "07:00", "closes": "23:59"},
        {"@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "14:00", "closes": "22:00"}],
    "sameAs": ["https://www.instagram.com/kingsdentalcenter/", "https://www.facebook.com/kingsdentalqatar/"]}

# translations for client-side language switch
js = {s: {lang: {k: v for k, v in T[s][lang].items() if k != 'desc'} for lang in ('en', 'ar')} for s in ORDER}
open(os.path.join(OUT, 'js', 'treatments.js'), 'w', encoding='utf-8').write(
    '/* Generated from src/treatments.json by src/build.py. Edit the JSON, not this file. */\nwindow.KDC_TREAT = ' + json.dumps(js, ensure_ascii=False) + ';\nwindow.KDC_TREAT_ORDER = ' + json.dumps(ORDER) + ';\n')

# home
body = rd(S('home.html')).replace('{{TREAT_CARDS}}', '\n        '.join(card(s, '') for s in ORDER))
marq_set = ''.join(f'<span class="marq__item" data-tname="{s}">{e(T[s]["en"]["name"])}</span>' + '<svg class="marq__crown" viewBox="100 228 815 492" aria-hidden="true"><path d="' + CROWN + '" fill-rule="evenodd"/></svg>' for s in ORDER)
body = body.replace('{{MARQ}}', f'<div class="marq__set">{marq_set}</div><div class="marq__set">{marq_set}</div>')
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(page(body,
    title='Kings Dental Center | Dental Clinics in Doha, Qatar',
    desc='Kings Dental Center: 14 dental clinics across Qatar for root canal, orthodontics, implants, gum, cosmetic, children\'s and preventive care. Open until midnight.',
    path='', r='', home=True, schema=ld(DENTIST)))

# treatments
os.makedirs(os.path.join(OUT, 'treatments'), exist_ok=True)
tpl = rd(S('treatment.html'))
for slug in ORDER:
    t = T[slug]['en']
    ordered = slug in SEQUENCE
    tag = 'ol' if ordered else 'ul'
    items = ''.join(
        f'<li class="tstep">' + (f'<span class="tstep__n" aria-hidden="true">{i+1}</span>' if ordered else '<span class="tstep__dot" aria-hidden="true"></span>') +
        f'<h3 class="tstep__t" data-tf="steps.{i}.0">{e(a)}</h3><p class="tstep__d" data-tf="steps.{i}.1">{e(b)}</p></li>'
        for i, (a, b) in enumerate(t['steps']))
    steps = f'<{tag} class="tsteps__list{" is-ordered" if ordered else ""}">{items}</{tag}>'
    more = '\n      '.join(card(s, '../') for s in ORDER[ORDER.index(slug)+1:] + ORDER[:ORDER.index(slug)])
    lower = t['name'][0].lower() + t['name'][1:]
    body = (tpl.replace('{{SLUG}}', slug).replace('{{NAME}}', e(t['name'])).replace('{{NAME_LOWER}}', e(lower))
            .replace('{{LEAD}}', e(t['lead'])).replace('{{INTRO}}', e(t['intro'])).replace('{{AT}}', e(t['at']))
            .replace('{{STEPS_TITLE}}', e(t['stepsTitle'])).replace('{{STEPS}}', steps).replace('{{MORE_CARDS}}', more)
            .replace('{{ALT}}', e(f'{t["name"]} at Kings Dental Center')))
    schema = ld([
        {"@context": "https://schema.org", "@type": "MedicalWebPage", "name": t['name'], "description": t['desc'],
         "url": f"https://kingsdentalcenter.com/treatments/{slug}", "about": {"@type": "MedicalProcedure", "name": t['name']},
         "publisher": {"@type": "Dentist", "name": "Kings Dental Center", "telephone": "+974 3102 6780"}},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Kings Dental Center", "item": "https://kingsdentalcenter.com/"},
            {"@type": "ListItem", "position": 2, "name": t['name'], "item": f"https://kingsdentalcenter.com/treatments/{slug}"}]}])
    title = f'{t["name"]} in Qatar | Kings Dental Center'
    open(os.path.join(OUT, 'treatments', f'{slug}.html'), 'w', encoding='utf-8').write(page(body,
        title=title, desc=t['desc'], path=f'treatments/{slug}', r='../', home=False, schema=schema, slug=slug))
    print(f'{slug:14s} title {len(title)}  desc {len(t["desc"])}')

# sitemap
urls = [''] + [f'treatments/{s}' for s in ORDER]
open(os.path.join(OUT, 'sitemap.xml'), 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    ''.join(f'  <url><loc>https://kingsdentalcenter.com/{u}</loc><lastmod>2026-10-26</lastmod></url>\n' for u in urls) + '</urlset>\n')
print('built home + 8 treatments')
