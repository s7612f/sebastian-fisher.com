# Website Agent Rules

## What this site is
Static HTML/CSS/vanilla JS bodybuilding coaching site. No frameworks, no build tools, no npm, no build step. Files are served directly.

## File structure
- index.html - home page
- css/style.css - all styles, CSS variables for theming
- js/main.js - all shared JS (hit counter, dark mode, modals, stack widget)
- js/gate.js - session login gate
- assets/img/ - vintage bodybuilding images
- Other .html files - individual pages

## Key CSS variables
- --accent: #c42000 (blood red)
- --gold: #a07800 (muted gold, prices)
- --fg, --fg-dim - text colours
- .mag-mode on body = dark theme; body.force-light = forced light

## Rules - ALWAYS follow
1. Never delete files. Ask first.
2. Never touch anything outside /workspace (= ~/site).
3. Never commit directly to main. Use branches: fix/<name> or feat/<name>.
4. After every change, confirm what you changed and what to test.
5. No new dependencies, frameworks, or build tools. This is plain HTML.
6. British spelling throughout (colour, behaviour, etc.)
7. Keep diffs minimal - change only what is asked.
8. Never edit .env files or any file containing secrets.

## Git workflow
1. git checkout -b fix/short-name
2. make changes
3. git add -p  (review before staging)
4. git commit -m 'fix: description'
5. git push origin fix/short-name
