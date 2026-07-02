# sebastian-fisher.com — Hard Film Studios

Cinematic video production for gyms, restaurants and events across Saffron Walden, Cambridge and North Essex.

## Structure

- `index.html` — the Hard Film Studios site (packages, basket, quote builder)
- `assets/css/style.css` — styles (dark cinematic theme)
- `assets/js/main.js` — pricing data, basket (localStorage), quote calculator
- `assets/media/` — **placeholder** stock clips & stills ([Mixkit free license](https://mixkit.co/license/)) until launch client work replaces them
- `archive/` — the previous retro personal site, still browsable at `/archive/`

## Editing prices & packages

All pricing lives in `assets/js/main.js` in the `PACKAGES`, `SECTORS` and `ADDONS` arrays at the top of the file. Edit the numbers there and the package cards, quote builder and basket all update automatically.

## Deployment

Pushed to `main` → GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages at [sebastian-fisher.com](https://sebastian-fisher.com).

## Replacing placeholders

Drop your own exports into `assets/media/` using the same filenames (720p H.264 `.mp4` + a matching `.jpg` poster frame), or update the paths in `index.html` / `main.js`. Then delete the placeholder disclaimer lines in the Work section and footer.
