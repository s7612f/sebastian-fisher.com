# Sebastian Fisher — Static Site

Minimal, elegant static site with a stone palette and a smooth “Enquire now” scroll to the enquiry box.

Contents
- `index.html` — main page
- `assets/styles.css` — theme and layout
- `assets/script.js` — smooth scroll + placeholder form toast

Deploy options

1) Cloudflare Pages (recommended)
- Create a new Pages project in Cloudflare Dashboard → Pages → Create project → Upload assets.
- Upload the contents of this folder (keep the same structure).
- Build settings: Framework preset = None, Build command = None, Output directory = `/`.
- After deploy, add a Custom domain (e.g. `sebastian-fisher.com` and `www.sebastian-fisher.com`).

DNS setup for Cloudflare Pages
- If your domain is in Cloudflare (nameservers point to Cloudflare):
  - Add the custom domain in Pages; Cloudflare will create the DNS records automatically (CNAME for `www`, apex handled by CNAME flattening/ALIAS).
- If your domain is at IONOS and you keep IONOS DNS:
  - In Pages, you’ll be given a `*.pages.dev` target.
  - Create a CNAME at IONOS for `www` → `<your-project>.pages.dev`.
  - For the apex `sebastian-fisher.com`, IONOS may not support CNAME at root. Easiest path is to switch nameservers to Cloudflare so flattening works. Alternative: host at IONOS Web Hosting (see option 2).

2) IONOS Web Hosting (no build, just upload)
- Provision a web space and point the domain’s root and/or `www` to that web space.
- Upload all files in this folder to the web root (via SFTP/FTP or IONOS File Manager).
- Ensure `index.html` is the default document.

3) Git + Cloudflare Pages (CI)
- Initialize a git repo with this folder and push to GitHub/GitLab.
- In Cloudflare Pages, connect the repo. Build command: None. Output dir: `/`.
- Any push to `main` redeploys automatically.

Wiring the enquiry form
- Current form shows a success toast only. Options to make it deliver:
  - Cloudflare Workers + Email (Durable Object/Queue -> Email routing), or a lightweight Worker that calls a webhook.
  - Form services (Formspree, Basin) — add their action URL to the `<form>`.
  - IONOS: small PHP handler if you host there.

Next steps
- Provide brand assets (logo/mark), preferred font, and copy.
- I can add Analytics (Cloudflare Web Analytics) and a privacy page.
- If you want me to set up Cloudflare Pages + DNS, confirm which account to use.

