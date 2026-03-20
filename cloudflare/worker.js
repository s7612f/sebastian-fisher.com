/**
 * Cloudflare Worker — Origin fallback with maintenance page
 *
 * HOW IT WORKS:
 *   Deployed as a Worker Route for sebastian-fisher.com/*
 *   Forwards all requests to origin (your VPS).
 *   If origin is unreachable OR returns 5xx, serves the maintenance page.
 *   Visitors never see a Cloudflare error page.
 *
 * DEPLOY:
 *   1. wrangler deploy   (requires wrangler CLI + Cloudflare account)
 *   2. OR: paste worker.js into Cloudflare Dashboard → Workers → Create Worker
 *   3. Add a Worker Route in Cloudflare Dashboard:
 *      Route: sebastian-fisher.com/*  → this worker
 *      Route: *.sebastian-fisher.com/* → this worker  (covers subdomains)
 *
 * SUBDOMAINS:
 *   Each subdomain (blog, forum, analytics, book) is routed here too.
 *   The worker just forwards — nginx on the VPS handles subdomain routing.
 *   If the VPS is down, all subdomains also show the maintenance page.
 */

const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BACK SOON — Sebastian Fisher Coaching</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0e0b07;
    color: #d4c9a8;
    font-family: 'Courier New', 'Lucida Console', monospace;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .wrap { max-width: 480px; width: 100%; text-align: center; }
  .title { font-size: clamp(1.6rem,6vw,2.8rem); letter-spacing: 6px; text-transform: uppercase; color: #f0e8d0; line-height: 1.2; margin-bottom: 6px; }
  .sub { font-size: .75em; letter-spacing: 4px; color: #a07800; text-transform: uppercase; margin-bottom: 40px; }
  .divider { width: 60px; height: 2px; background: #c42000; margin: 0 auto 40px; }
  .box { border: 1px solid #2a2318; border-left: 3px solid #c42000; background: #161008; padding: 24px 28px; text-align: left; margin-bottom: 24px; }
  .box h2 { font-size: .78em; letter-spacing: 3px; text-transform: uppercase; color: #c42000; margin-bottom: 12px; }
  .box p { font-size: .82em; color: #8a7e68; line-height: 1.7; }
  .box p strong { color: #d4c9a8; }
  .status { display:inline-flex; align-items:center; gap:8px; font-size:.72em; letter-spacing:2px; text-transform:uppercase; color:#a07800; border:1px solid #2a2318; padding:6px 14px; margin-bottom:32px; }
  .dot { width:7px; height:7px; border-radius:50%; background:#a07800; animation:pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .footer { margin-top:48px; font-size:.65em; letter-spacing:2px; color:#3a3020; text-transform:uppercase; }
</style>
</head>
<body>
<div class="wrap">
  <div class="title">Sebastian<br>Fisher</div>
  <div class="sub">:: Online Coaching ::</div>
  <div class="divider"></div>
  <div class="status"><div class="dot"></div>Server maintenance in progress</div>
  <div class="box">
    <h2>&#9660; Back shortly</h2>
    <p>The site is temporarily offline for maintenance. <strong>Everything will be back up shortly.</strong> No data lost. Your programmes are safe.</p>
  </div>
  <div class="box">
    <h2>&#9660; Need something urgent?</h2>
    <p>Email: <strong><a href="mailto:contact@sebastian-fisher.com" style="color:#d4c9a8;">contact@sebastian-fisher.com</a></strong><br><br>Coaching applications, programme questions, order issues — all handled via email while the site is down.</p>
  </div>
  <div class="footer">&copy; 2026 Sebastian Fisher Coaching</div>
</div>
</body>
</html>`;

function maintenancePage() {
  return new Response(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Retry-After': '300',
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    try {
      const response = await fetch(request);

      // Origin returned a server error — show maintenance
      if (response.status >= 500) {
        return maintenancePage();
      }

      return response;
    } catch (e) {
      // Origin unreachable (VPS down, network error, etc.)
      return maintenancePage();
    }
  },
};
