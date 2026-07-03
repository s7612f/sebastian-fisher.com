// Serves the static site and hardens transport:
// - redirects any plain-HTTP request to HTTPS (301)
// - adds an HSTS header so browsers stick to HTTPS afterwards
// The Cloudflare edge already terminates TLS with a valid certificate; this just
// makes sure nobody is ever served over http://.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const visitor = request.headers.get("CF-Visitor") || "";
    if (visitor.includes('"scheme":"http"')) {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    const res = await env.ASSETS.fetch(request);
    const resp = new Response(res.body, res);
    resp.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    return resp;
  },
};
