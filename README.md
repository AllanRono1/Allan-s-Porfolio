# Allan Rono — Portfolio

Personal portfolio website showcasing work, writing, and principles as a front-end engineer. Built with no frameworks, no build tools, and no dependencies.

Live: [github.com/AllanRono1/Allan-s-Porfolio](https://github.com/AllanRono1/Allan-s-Porfolio)

---

## Tech Stack

| Layer | Choices |
|---|---|
| Markup | Semantic HTML5 |
| Styles | Vanilla CSS — custom properties, Grid, Flexbox, fluid typography |
| Behaviour | Vanilla JavaScript (ES2020+) |
| Fonts | Space Grotesk · Inter · JetBrains Mono (Google Fonts) |
| Hosting | Static — deployable to GitHub Pages, Netlify, Vercel, or any CDN |

---

## Features

- **Zero dependencies** — no npm, no bundler, no framework; ships exactly what you write
- **Dark / light theme** — detects OS preference, persists manual override via `localStorage`, no flash on load
- **Scroll-reveal animations** — `IntersectionObserver`-powered fade-ins; disabled when the user prefers reduced motion
- **Inline blog** — posts defined in `main.js`, rendered client-side with a lightweight Markdown parser (bold, code, links, headings, bullets); XSS-safe
- **Accessible** — skip-to-content link, semantic landmarks, visible focus outlines (WCAG AA), keyboard-navigable

---

## Project Structure

```
.
├── index.html   # All markup — hero, stack, work, writing, principles, contact
├── main.js      # Theme toggle, scroll-reveal, blog engine
└── styles.css   # Design tokens, layout, components, responsive breakpoints
```

---

## Running Locally

No install step required. Open `index.html` directly in a browser, or serve it with any static server:

```bash
# Python (built into macOS / Linux / most Windows setups)
python -m http.server 3000

# Node.js
npx serve .

# VS Code
# Install the "Live Server" extension, then click "Go Live"
```

---

## Customising

| What | Where |
|---|---|
| Personal details, section copy | `index.html` |
| Blog posts | `POSTS` array at the top of `main.js` |
| Colours, fonts, spacing tokens | CSS custom properties in `:root` inside `styles.css` |
| Featured projects | `.work-grid` section in `index.html` + matching CSS |

---

## Deployment

Push to any static host — the site is a single directory with no build step:

```bash
# GitHub Pages
git push origin main
# Then enable Pages in repo Settings → Pages → Branch: main / root
```

---

## License

MIT — feel free to fork and adapt with attribution.
