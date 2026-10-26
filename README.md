# Kings Dental Center website

Static site: HTML, CSS and JavaScript. No build step, no server code.

## Open it
Double-click `site/index.html`, or for the smoothest preview run a local server inside `site/`:
```
npx serve site
```

## Deploy
Drag the `site` folder into Netlify Drop (app.netlify.com/drop) or Vercel. Point kingsdentalcenter.com at it.

## Where things are
| What | File |
|---|---|
| Treatment page text (English + Arabic) | `src/treatments.json` |
| Homepage layout | `src/home.html` |
| Treatment page layout | `src/treatment.html` |
| Shared header / footer / head | `src/partials/` |
| Site text, FAQ, hours, all 20 branches | `site/js/content.js` |
| Design | `site/css/style.css` |
| Motion and interactions | `site/js/main.js` |

After editing anything in `src/`, rebuild the pages:
```
python3 src/build.py
```
This writes `site/index.html`, `site/treatments/*.html`, `site/js/treatments.js` and `site/sitemap.xml`.

## Pages
- `/` homepage
- `/treatments/root-canal`, `orthodontics`, `restorative`, `implants`, `gums`, `cosmetic`, `children`, `preventive`

## What's built in
- Crown preloader that draws the Kings crown, then lands in the header
- Dive through the crown into the clinic film
- Treatments: horizontal pinned scroll on desktop, swipe on phones, each opening its own page
- How a visit works, with a line that draws as you read
- Children's dentistry feature
- Branch finder: all 20 clinics in Qatar, UAE, Bahrain and India, with tap-to-call and directions
- Live "Open now / Closed" status in Doha time
- Full Arabic version with right-to-left layout on every page
- Booking form with treatment and clinic choice that opens WhatsApp with the request written
- Treatment pages link to the booking form with the treatment preselected
- SEO: titles, descriptions, Dentist and MedicalWebPage schema, breadcrumbs, sitemap

## Libraries
GSAP 3.15 with ScrollTrigger and SplitText (free license), Lenis 1.3. Fonts: Bodoni Moda, Hanken Grotesk, Noto Kufi Arabic (OFL), self-hosted.
