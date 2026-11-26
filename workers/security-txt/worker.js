// security-txt: serve disclose.io's security.txt on every disclose.io property.
//
// One source of truth: static/.well-known/security.txt in this repo, served by
// GitHub Pages at https://disclose.io/.well-known/security.txt. This Worker is
// routed (per host, exact path) on every other proxied disclose.io host and on
// disclosecon.com. It fetches the apex file and rewrites only the Canonical line
// to the URL it is answering, as RFC 9116 section 2.5.2 expects. Edit the repo
// file, deploy the site, and every host follows within the cache TTL.
//
// On the apex itself only the legacy /security.txt path is routed: the apex's
// /.well-known/security.txt is the origin and must never be intercepted.
// calendar, links and projects have zone redirect rules that skip these two paths.
// blog (Ghost) and community (Discourse) are DNS-only, so they redirect here instead.
// Deploy: bun workers/security-txt/deploy.ts (see docs/SECURITY_PAGE.md).

const ORIGIN = "https://disclose.io/.well-known/security.txt";
const CACHE_SECONDS = 300;

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed\n", { status: 405, headers: { allow: "GET, HEAD" } });
    }
    const url = new URL(request.url);
    if (url.hostname === "disclose.io" && url.pathname.startsWith("/.well-known/")) {
      // The origin file itself: never intercept it (that would loop). The apex is
      // routed only for the legacy /security.txt path.
      return fetch(request);
    }

    let upstream;
    try {
      upstream = await fetch(ORIGIN, { cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true } });
    } catch (err) {
      upstream = null;
    }
    if (!upstream || !upstream.ok) {
      return new Response(
        `security.txt is temporarily unavailable. Report security issues to security@disclose.io or see ${ORIGIN}\n`,
        { status: 503, headers: { "content-type": "text/plain; charset=utf-8", "retry-after": "300" } },
      );
    }

    const canonical = `https://${url.hostname}/.well-known/security.txt`;
    const source = await upstream.text();
    const body = /^Canonical:.*$/m.test(source)
      ? source.replace(/^Canonical:.*$/m, `Canonical: ${canonical}`)
      : `${source.replace(/\n?$/, "\n")}Canonical: ${canonical}\n`;

    return new Response(request.method === "HEAD" ? null : body, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": `public, max-age=${CACHE_SECONDS}`,
        "access-control-allow-origin": "*",
        "x-security-txt-source": ORIGIN,
      },
    });
  },
};
