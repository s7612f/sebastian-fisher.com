// Minimal Worker scoped to ONE path via assets.run_worker_first in wrangler.jsonc.
// It only ever runs for /google6f1c92c182dec82b.html and returns the Search Console
// verification content with a 200, bypassing Cloudflare's .html -> clean-URL redirect
// that was causing "file not found" during verification. Every other request never
// touches this Worker and is served directly by the static-assets system.
export default {
  async fetch() {
    return new Response("google-site-verification: google6f1c92c182dec82b.html", {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
