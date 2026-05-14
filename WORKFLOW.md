# How this site works

## The setup

The site lives in this git repo: `s7612f/sebastian-fisher.com`

Files are plain HTML — no build step, no framework. Edit a file, push to git, then run the deploy command.

Hosting is on **Cloudflare Pages** (project: `sebastian-fisher`). The site URL is `sebastian-fisher.pages.dev`, custom domain is `sebastian-fisher.com`.

---

## Day-to-day workflow

```bash
cd ~/Projects/sebastian-fisher.com

# 1. Edit files in VS Code
# 2. Push to git
git add .
git commit -m "what you changed"
git push

# 3. Deploy to Cloudflare Pages
npx wrangler pages deploy . --project-name sebastian-fisher
```

The deploy takes ~10 seconds and uploads only changed files.

---

## One-liner deploy alias (optional)

Add this to `~/.zshrc` for a quick `deploy` command:

```bash
alias deploy-sf="cd ~/Projects/sebastian-fisher.com && git add . && git commit -m 'update' && git push && npx wrangler pages deploy . --project-name sebastian-fisher"
```

---

## Environment variables (in ~/.zshrc)

```bash
export CLOUDFLARE_API_TOKEN="..."       # Cloudflare API token with Pages:Edit
export CLOUDFLARE_ACCOUNT_ID="6959e11203b445fb9856aad90c792c08"
```

If the token expires, generate a new one at:
`dash.cloudflare.com/profile/api-tokens` → **Create Custom Token**
- Permissions: `Cloudflare Pages: Edit`
- Account: your account

After updating `.zshrc` run `source ~/.zshrc`.

---

## Pages structure

| File | URL |
|------|-----|
| `index.html` | sebastian-fisher.com/ |
| `links.html` | sebastian-fisher.com/links.html |
| `projects.html` | sebastian-fisher.com/projects.html |
| `homelab.html` | sebastian-fisher.com/homelab.html |
| `giphy-gallery.html` | sebastian-fisher.com/giphy-gallery.html |
| `retro.css` | shared stylesheet |
| `retro.js` | shared scripts |
| `favicon.png` | site favicon |
| `gifs/buttons/` | 88x31 pixel badges |
| `media/` | audio, backgrounds, images |
| `assets/` | giphy assets |

---

## Adding a new page

1. Create `pagename.html` — copy the `<head>` and nav from an existing page
2. Add a link in the `<nav>` on every other page
3. Push and deploy

---

## Cloudflare dashboard

- Pages project: dash.cloudflare.com → Workers & Pages → `sebastian-fisher`
- DNS: dash.cloudflare.com → `sebastian-fisher.com` → DNS
