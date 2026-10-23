# portfolio-v3 — Ravi Varman S

Flagship software-developer portfolio. Hand-written HTML/CSS/JS — no build step,
no dependencies. Hosted on **GitHub Pages** at:

**https://ravi-varman-s.github.io/portfolio-v3/**

## Highlights

- Aurora dark theme, starfield canvas hero, kinetic typography, custom cursor
- **Skill orbit** — counter-rotating skill rings (hover to pause & inspect)
- **Scroll-drawn journey timeline** that lights up milestones as you scroll
- 3D tilt project cards with cursor-tracking glow
- **Resume section** — `resume.pdf` downloadable from the page at any time
- Fully responsive + `prefers-reduced-motion` respected + works without JS

## Files

```
index.html   whole page (content lives here)
styles.css   theme + animations
script.js    interactions (vanilla JS)
resume.pdf   Ravi_Varman_S_Resume.pdf — Software Developer version
```

## Editing content

| What | Where |
|------|-------|
| Projects, about, FAQ, contact | `index.html` |
| Resume PDF | replace `resume.pdf` (keep the name) |
| Accent colour | `styles.css` → `--cyan` / `--violet` (top `:root`) |
| Skill orbit entries | `script.js` → `orbit()` → `rings` array |

## Updating the resume

The PDF is generated from a spec in the main repo:

```
python job-application/make_resume_role.py job-application/spec_sd_r5.json
copy job-application\Ravi_Varman_Resume_SD_R5.pdf portfolio-v3\resume.pdf
```

Then commit + push.
