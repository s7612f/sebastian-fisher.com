# Cloudflare Maintenance Worker

## What it does

When your VPS is unreachable or returns a 5xx error, Cloudflare serves the
maintenance page automatically. Visitors never see a Cloudflare error page.

Works for the main site AND all subdomains (blog, forum, analytics, book).

## Deploy — Option A: Cloudflare Dashboard (easiest, no CLI needed)

1. Go to **Cloudflare Dashboard** → your domain → **Workers & Pages**
2. Click **Create** → **Create Worker**
3. Paste the contents of `worker.js` into the editor
4. Click **Save and Deploy**
5. Go to the worker's **Triggers** tab
6. Under **Routes**, add:
   - `sebastian-fisher.com/*`
   - `*.sebastian-fisher.com/*`
7. Save

Done. Test by temporarily pointing your DNS A record to a dead IP — you
should see the maintenance page within ~30 seconds.

## Deploy — Option B: Wrangler CLI

```bash
npm install -g wrangler
wrangler login
cd cloudflare/
# Edit wrangler.toml — uncomment routes and add your Zone ID
# (Zone ID is on your domain's Overview page in Cloudflare)
wrangler deploy
```

## Testing locally

Open `maintenance.html` directly in a browser to check how it looks.

## Updating the maintenance page

Edit `worker.js` — the HTML is the `MAINTENANCE_HTML` string near the top.
Redeploy via dashboard (paste again) or `wrangler deploy`.
