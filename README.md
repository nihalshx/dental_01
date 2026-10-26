# Kings Dental Center website

Static site: HTML, CSS and JavaScript. No build step, no server code.

## Open it
Double-click `site/index.html`, or for the smoothest preview run a local server inside `site/`:
```
npx serve site
```

## Deploy (Vercel)
`vercel.json` serves the `site/` folder as a static site, no build step.
1. vercel.com > Add New > Project > import `nihalshx/dental_01`.
2. Leave every setting as detected (Framework: Other) and press Deploy.
3. Every push to `main` redeploys automatically.
4. Add the domain under Project > Settings > Domains.

## Where things are
| What | File |
|---|---|
| All text, English and Arabic, services, FAQ, opening hours | `site/js/content.js` |
| Design (colors, type, layout) | `site/css/style.css` |
| Motion and interactions | `site/js/main.js` |
| Logo (traced from the client's PNG) | `site/assets/logo/` |
| Videos to add | `site/assets/video/` (see ASSET_BRIEF.md) |
| Images to add | `site/assets/img/` (see ASSET_BRIEF.md) |

## What's built in
- Crown preloader that draws the Kings crown, then lands in the header (once per visit)
- Signature section: scroll and the page dives through the crown into the clinic film
- Live "Open now / Closed" status in Doha time, from the real hours, in the header and phone dock
- Full Arabic version with right-to-left layout (button top right)
- Booking form that opens WhatsApp with the request already written
- Services that open in place, with an image that follows the cursor on desktop
- Footer "Kings" signature that writes itself as you reach the bottom
- Smooth scroll (Lenis) and GSAP motion, all switched off for visitors who prefer reduced motion
- Sticky call and WhatsApp dock on phones
- SEO: one h1, title, description, Dentist schema, sitemap, robots, share image

## Libraries
GSAP 3.15 with ScrollTrigger and SplitText (free license), Lenis 1.3. Fonts: Bodoni Moda, Hanken Grotesk, Noto Kufi Arabic (OFL), self-hosted.
