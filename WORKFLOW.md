# How this site works

## The setup

The site lives in this git repo: `s7612f/sebastian-fisher.com`

Files are plain HTML — no build step, no framework. Edit a file, push to git, it's live.

Hosting is on **Cloudflare Pages** (project: `personalwebsite`). Every push to `main` auto-deploys.

DNS is managed through Cloudflare — `sebastian-fisher.com` points to the Pages project.

---

## Day-to-day workflow

```bash
# 1. Edit a file in VS Code
# 2. Save it
# 3. Push to git

cd ~/Projects/sebastian-fisher.com

git add .
git commit -m "what you changed"
git push
```

That's it. Cloudflare picks it up and the site updates within ~30 seconds.

---

## Manual deploy (if you need to force it)

```bash
cd ~/Projects/sebastian-fisher.com
npx wrangler pages deploy . --project-name personalwebsite
```

Requires `CLOUDFLARE_API_TOKEN` to be set in your environment (see `.zshrc`).

---

## Pages structure

| File | URL |
|------|-----|
| `index.html` | sebastian-fisher.com/ |
| `links.html` | sebastian-fisher.com/links.html |
| `projects.html` | sebastian-fisher.com/projects.html |
| `homelab.html` | sebastian-fisher.com/homelab.html |
| `favicon.png` | site favicon |
| `gifs/buttons/` | 88x31 pixel badges |
| `023C.png` | tiled background used on projects page |

---

## Adding a new page

1. Create `pagename.html` — copy the structure from `index.html`
2. Add a link to it in the `<nav>` on every other page
3. `git add . && git commit -m "add pagename" && git push`

---

## Cloudflare dashboard

- Pages project: dash.cloudflare.com → Workers & Pages → personalwebsite
- DNS: dash.cloudflare.com → sebastian-fisher.com → DNS

---

## API token

Stored in `~/.zshrc` as `CLOUDFLARE_API_TOKEN`. If it expires, generate a new one at:
`dash.cloudflare.com/profile/api-tokens` → Edit Cloudflare Workers template.

After updating `.zshrc` run `source ~/.zshrc` to reload it in the current terminal.
