# sebastian-fisher.com — design doc

Living design reference for the real (post-coming-soon) site. The coming-soon page
currently served at the apex is on `main`; this branch (`full-site`) is where the
full rebuild lives.

## Aesthetic north star

DOS / terminal / Geocities hybrid. Monospace first. Black background. High-contrast
neon accents. ASCII boxes and dashed borders over drop-shadows. Nothing rounded,
nothing glassy.

British spelling throughout. Copy is terse — no filler, no "empowering journeys".

## Palette (pulled from the retro-theme + current site)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#000000` | page background |
| `--bg2` | `#111111` / `#14181d` | panels, sidebar |
| `--fg` | `#00FF00` | primary text, borders |
| `--fg-dim` | `#00CC00` | secondary text, meta |
| `--accent` | `#FFFF00` | warnings, "now" markers |
| `--alert` | `#FF0000` | errors, hover state |
| `--link` | `#FFFF00` (visited `#FF9900`) | links |
| `--gold` | existing token | featured borders (see current `style.css`) |

Typography: `"Courier New", Courier, monospace` for body. Avoid mixing more than one
family. Use letter-spacing (2–4px) on headings to get that spaced-caps terminal feel.

## Elements to port from [dcsk8prk/Retro-Basic-HTML-Theme](https://github.com/flesheatingbacteria33/Retro-Basic-HTML-Theme)

The coming-soon page already adapts the palette, panel, marquee and blink. For the
full rebuild, pull in the rest of the kit as well:

- [ ] **Bordered main panel** (`.main`, `max-width: 750px`, 3px neon border) — keep
      the 750px width for content; it's a period-correct feel and reads well on
      mobile when the sidebar stacks.
- [ ] **Header + sub-header** block with spaced caps title and double-slash tagline.
- [ ] **Top marquee** with a `<span class="blink">NEW!</span>` leader for rolling
      status: coaching spots left, latest blog, cut kickoff date, etc.
- [ ] **Sidebar nav** (pages + "I'm feeling lucky" button) with `>` bullet prefix.
      Replace the lucky button with a `/random` that links to a random blog post.
- [ ] **Guestbook / 88×31 button stack** — host 88×31 badges for lastlamp, the
      forum, the blog, ProtonMail. One optional real guestbook via a form → Formcapture.
- [ ] **News cards** (`.news`, `.news-title`, `.news-date`, `.news-content`) —
      reuse for blog teasers, programme drops, and site changelog entries.
- [ ] **Under-construction box** (`.construction` with dashed yellow border) — keep
      this available as a reusable "section WIP" callout on interior pages.
- [ ] **Button style** — 2px outset/inset neon border, flips on hover (see `.button`
      in the theme).
- [ ] **Blinkies / link-back row** at the foot of each page (webring-style).
- [ ] **"Last updated"** footer line — `document.lastModified`. Cheap but adds trust.
- [ ] **Time-based greeting** — keep the `timeGreeting()` idea but hook the
      greeting to the visitor's local time and the page they landed on.
- [ ] **Hit counter** — pull from `count.getloli.com` (or self-host via the
      formcapture box).
- [ ] **Back-to-top + email + sitemap** in the footer.

Things in the theme we are **not** porting:

- Windows `scrollbar-*-color` properties (non-standard, IE-only).
- The Zorblax placeholder copy.
- The `<marquee>` element for anything structural — fine for the top ticker only;
  for scrolling content elsewhere use a CSS `animation: marquee` keyframe.

## Attribution (required)

The retro theme's README asks that the credit line in its footer be preserved when
used. The coming-soon and every page in the rebuild should keep:

> Layout adapted from the Retro-Basic-HTML-Theme by
> [dcsk8prk](https://dcsk8prk.nekoweb.org/).

…in the global footer. Don't remove it.

## Structure (first cut — revise once content is back)

```
/                    retro home (hero + offers + news cards)
/coaching            1-on-1 application + process
/programmes          shop (cut, overhaul, beginner) — free + paid
/free                calculators, planners, guides (no email wall)
/research            long-form write-ups
/blog                → blog.sebastian-fisher.com (Ghost)
/forum               → forum.sebastian-fisher.com (Flarum)
/about               me + the diabetic angle + why terminal aesthetic
/contact             email + booking + direct DM
/changelog           news cards as a feed
```

Keep pages flat — no deep subnav. The sidebar is the primary nav; the top bar is
status + marquee only.

## Open questions

- [ ] Do we want a single `style.css` or one per page? The existing site has a
      shared one — keep that and extend, rather than duplicating styles per file.
- [ ] Dark-mode toggle: the current header has `[ DARK MODE ]` but the whole site
      is already dark. Either remove the toggle or make it a "high-contrast /
      amber CRT" alternate palette — feels more on-brand than light mode.
- [ ] Mobile: test `.main` at 360 px. The retro sidebar needs to collapse
      gracefully (already handled in the coming-soon via a `@media (max-width: 620px)`).

## Also see

- [`../infra/docs/websites.md`](https://github.com/s7612f/infra/blob/main/docs/websites.md)
  — routing for this domain and its subdomains.
- `main` branch of this repo — current coming-soon page (the retro palette is
  already adapted there; use it as the CSS starting point).
- [Retro-Basic-HTML-Theme](https://github.com/flesheatingbacteria33/Retro-Basic-HTML-Theme)
  — original theme source.
