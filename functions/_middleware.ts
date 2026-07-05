/**
 * dev.disclose.io basic-auth wall — OPT-IN (disabled by default).
 *
 * The wall only enforces when REQUIRE_AUTH === "true". When enabled it reads
 * credentials from BASIC_AUTH_USERS (one `user:password` per line, blank lines
 * and `#`-comments ignored), returns 401 with WWW-Authenticate on missing/
 * invalid creds, 503 if enabled but no users are configured, and calls next()
 * on success.
 *
 * dev.disclose.io is intentionally public (Casey, 2026-07-05): REQUIRE_AUTH is
 * unset, so requests pass straight through. noindex is still enforced via
 * static/_headers. To re-enable the wall on any environment, set
 * REQUIRE_AUTH="true" and BASIC_AUTH_USERS on that Pages project.
 */

interface Env {
  REQUIRE_AUTH?: string;
  BASIC_AUTH_USERS?: string;
}

const REALM = "dev.disclose.io";

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, next, env } = context;

  // Opt-in gate: the wall stays off unless explicitly enabled.
  if (env.REQUIRE_AUTH !== "true") {
    return next();
  }

  const configured = parseUsers(env.BASIC_AUTH_USERS ?? "");
  if (configured.length === 0) {
    return setupRequired();
  }

  const header = request.headers.get("Authorization") ?? "";
  if (!header.startsWith("Basic ")) {
    return unauthorized();
  }

  let decoded: string;
  try {
    decoded = atob(header.slice("Basic ".length));
  } catch {
    return unauthorized();
  }
  const sep = decoded.indexOf(":");
  if (sep < 0) return unauthorized();
  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);

  let ok = false;
  for (const entry of configured) {
    if (timingSafeEqual(user, entry.user) && timingSafeEqual(pass, entry.pass)) {
      ok = true;
      break;
    }
  }
  if (!ok) return unauthorized();

  return next();
};

function parseUsers(raw: string): { user: string; pass: string }[] {
  const out: { user: string; pass: string }[] = [];
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const sep = line.indexOf(":");
    if (sep < 0) continue;
    const user = line.slice(0, sep);
    const pass = line.slice(sep + 1);
    if (!user || !pass) continue;
    out.push({ user, pass });
  }
  return out;
}

function unauthorized(): Response {
  return new Response("Authentication required.\n", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

function setupRequired(): Response {
  return new Response(
    "dev.disclose.io setup incomplete: BASIC_AUTH_USERS env var is not configured on this Pages project.\n",
    {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
      },
    },
  );
}

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
