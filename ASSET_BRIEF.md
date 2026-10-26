# Kings Dental Center: what to generate

> Status: both videos and all 8 treatment images are in. Only the client's real photos (section 3) and facts (section 4) remain.

The site already works without any of these. Each file you drop in upgrades a fallback that is already designed. Use the exact file names and folders below and everything appears automatically, no code changes.

Brand rules for every asset:
- Colors: true black `#000000`, enamel white `#F4F6F5`, pearl grey `#E3E8E6`, and one accent, Qatar maroon `#8A1538`.
- No text, no words, no logos, no watermarks inside any image or video. The site adds the type.
- No real-looking patients' faces. No before/after pictures (they would be fake results).
- Calm, expensive, studio-lit. Think luxury watch or perfume ad, not stock dental photos.

---

## 1. Google Flow videos (2 clips)

Generate in Google Flow (Veo). Pick the highest quality, 8 seconds, no audio needed (the site plays them muted).

### Video 1: `hero-loop.mp4`
Where: the tall arch on the right of the hero (on phones, under the headline).
Aspect: **9:16 vertical** (the site crops it to 3:4).
Save to: `site/assets/video/hero-loop.mp4`

**Prompt (paste into Flow):**
> Ultra-premium 3D product film. A single perfect human molar tooth sculpted from glossy white porcelain floats in the center of a pure black void, rotating very slowly on its vertical axis. One soft rim light from the upper left traces its enamel edge, and a slow band of specular light glides across the surface like polished ceramic. Tiny dust particles drift in the light. Shallow depth of field, macro lens, 100mm, f/2.8. Colors only black, warm white enamel, and a faint deep maroon (#8A1538) glow reflecting from below. Seamless loop: the end frame matches the start frame. Locked-off camera, no cuts, no text, no logo. Photorealistic, 4K, cinematic, Octane render look.

**Shot plan (8 s):**
| Time | What happens |
|---|---|
| 0.0 to 2.0 s | Tooth already centered, rim light on its left edge |
| 2.0 to 5.5 s | Light band sweeps across the crown of the tooth |
| 5.5 to 8.0 s | Rotation continues, light returns to the start position so it loops |

If Flow adds camera movement, add: *"static camera, the object rotates, not the camera"*.

### Video 2: `clinic-reveal.mp4`
Where: the big crown section. The video plays **inside the crown shape**, then the crown zooms until the video fills the whole screen and the white headline appears over it.
Aspect: **16:9 horizontal**.
Save to: `site/assets/video/clinic-reveal.mp4`

**Prompt (paste into Flow):**
> Abstract luxury dental film, macro 3D. A slow forward dolly through a landscape of smooth white porcelain forms shaped like rounded tooth crowns and soft arches, lit by warm studio light. Deep maroon (#8A1538) silk-like light washes across the surfaces from the right. Glossy enamel reflections, soft shadows, a few floating water droplets catching light. Very slow, calm, continuous camera move, no cuts. Mostly maroon and white tones with black shadows, so white text placed over the lower left stays readable. No people, no text, no logos, no medical tools. Photorealistic, cinematic, 4K, shallow depth of field.

**Shot plan (8 s):**
| Time | What happens |
|---|---|
| 0.0 to 3.0 s | Camera drifts forward, maroon light enters from the right |
| 3.0 to 6.0 s | Porcelain arches pass close to the lens, out of focus |
| 6.0 to 8.0 s | Camera settles; the lower left of the frame is darker (text sits there) |

### Optional Video 3 (only if you want more): `hero-loop` alternate
Same as Video 1 but a **white porcelain crown (the king's crown shape)** instead of a tooth. Use it if the tooth version feels too clinical. Keep the same file name to swap it in.

### After Flow: prepare the videos
Send me the raw Flow downloads and I'll compress them. Or do it yourself with ffmpeg:
```
ffmpeg -i flow-hero.mp4 -an -vf "scale=-2:1440" -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p -movflags +faststart site/assets/video/hero-loop.mp4
ffmpeg -i flow-clinic.mp4 -an -vf "scale=1920:-2" -c:v libx264 -preset veryfast -crf 27 -pix_fmt yuv420p -movflags +faststart site/assets/video/clinic-reveal.mp4
```
Aim for under 4 MB each.

---

## 2. ChatGPT images (8 treatment images)

Where: when someone opens a treatment, its image shows beside the text; on desktop it also floats beside the cursor when hovering the list.
Size: **1200 x 900 (4:3), JPG**. Keep the main subject in the middle third (the hover preview crops to a tall arch).
Save to: `site/assets/img/services/<file name>.png` (PNG, as delivered)

Use this **style line at the start of every prompt** so the 8 images match:
> Minimal luxury still-life product photograph, studio lighting, soft shadows, background in smooth pearl grey (#E3E8E6), subject in white porcelain and polished steel, a single small accent of deep maroon (#8A1538), shot on medium format, 4:3, no text, no logo, no people.

Then add the subject line:

| File name | Subject line to add |
|---|---|
| `root-canal.png` | A single white porcelain molar standing on a black stone plinth, a fine gold-tipped endodontic file lying beside it. |
| `orthodontics.png` | A clear dental aligner tray resting on a glossy white sphere, light refracting through it. |
| `restorative.png` | A porcelain tooth with a smooth, seamless filling, next to a small maroon ceramic dish of white composite paste. |
| `implants.png` | A titanium dental implant screw standing upright under a white porcelain crown, floating just above it, perfectly aligned. |
| `gums.png` | A soft maroon silk fabric folded around the base of a white porcelain tooth, like gum tissue, very elegant and abstract. |
| `cosmetic.png` | A row of perfectly shaped white porcelain veneers arranged in an arc on black glass, like jewellery. |
| `children.png` | A small, friendly white porcelain baby tooth next to a soft maroon toothbrush, playful but still minimal and premium. |
| `preventive.png` | A dental mirror and a white toothbrush crossed on pearl stone, with a single drop of water. |

---

## 3. Real photos from the clinic (most important, ask the client)

Real photos beat anything generated. Please ask Kings Dental Center for these:

| File | What | Size |
|---|---|---|
| `site/assets/img/clinic/entrance.jpg` | The clinic entrance or reception at Grand Mall Building, daylight | 1200 x 900 |
| `site/assets/img/team/<name>.jpg` | Portraits of the doctors (only real doctors, with permission) | 900 x 1200 |

If they send doctor photos, also send me: each doctor's name, title, specialty and languages. I'll add a Doctors section.

---

## 4. Facts I need confirmed by the client

The site only uses facts from their current website. Please check:
1. **Branches:** their menu says "Branches" but no list is published. Names and addresses of every branch?
2. **Insurance:** the site lists Al Koot, QLM, MetLife and Allianz (from logos on their site). Two more logos on their site had no name. Which other insurers?
3. **Hours:** Sat to Thu 7 AM to 12 AM, Fri 2 PM to 10 PM. Still correct, and the same for every branch?
4. **WhatsApp:** bookings go to +974 3102 6780. Correct number for WhatsApp?
5. **Domain:** where will this be hosted (kingsdentalcenter.com)?
