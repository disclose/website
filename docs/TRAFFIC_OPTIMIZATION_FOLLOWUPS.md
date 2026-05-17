# Traffic Optimization Follow-ups

Generated from the 2026-05-17 GA 7-day analysis. The unattended work
(C1 AI-readiness on disclose.io, C2 newsletter CTA propagation) shipped
in commit alongside this file. The items below need your input before
they can ship — each is scoped so it's ready to execute on approval.

## A1 — Block bot traffic in GA4 admin (HIGH leverage, but irreversible)

**Why:** 5/10 main property got 12,179 "users" from Singapore at 0.74% engagement
with 8,507 distinct directory.disclose.io pagePaths in a single day. Same signature
ran into 5/11. This contaminates every cohort, channel, and engagement metric.

**Proposed action:**
1. Create a GA4 audience named `Likely Crawlers` with these conditions:
   - `country` equals `Singapore` AND
   - `sessionDefaultChannelGroup` equals `Direct` AND
   - `hostName` equals `directory.disclose.io` AND
   - session engagement rate < 5%
2. Use it as an exclusion filter in standard reports going forward.

**Why I didn't just do it:** audience definitions are property-wide and affect
every historical and future report. Want your eyes on the criteria before it
goes live. If you say "ship it," I'll do it via the Admin API v1alpha (audiences
endpoint).

**Alternative (cleaner if available):** add IP-based Developer/Internal Traffic
filter — but we'd need the bot's IP range, and Cloudflare obscures it.

---

## A2 — Canonicalize dual-tracked subdomains (MEDIUM, needs decisions)

**Why:** Four subdomains are tagged in both their dedicated property AND the
consolidated main property. Numbers don't reconcile.

**Decision needed (per subdomain):**

| Subdomain | Keep as canonical | Rationale (suggested) |
|---|---|---|
| lookup.disclose.io | **Dedicated property (530257491)** | Already has its own analytics workflow |
| policymaker.disclose.io | **Dedicated property (385649734)** | Same — clean separation |
| community.disclose.io | **Dedicated property (263113067)** | Discourse forum, distinct UX |
| vault.disclose.io | **Dedicated property (530179529)** | Pre-launch, no need to dilute |

If you confirm the suggested column, I can remove the `G-NJQTCTSYCM` tag from
those subdomains' HTML headers (or wherever they're injected) in one pass.

---

## A3 — Fire SPA route-change pageviews on lookup.disclose.io (MEDIUM)

**Why:** GA only sees `/` for lookup property — the post-search result state is
invisible. Sessions average 331s, so users ARE doing things; we can't see what.

**Proposed action:** Find the lookup search-submit handler in
`~/Projects/lookup-disclose-io/server.ts` (HTML is inlined there) or the
client-side JS that processes results, and fire:
```js
gtag('event', 'page_view', {
  page_path: '/result/' + assetTypeOrHash,
  page_title: 'Lookup result — ' + assetType,
});
```

**Why I didn't just do it:** lookup serves HTML inline from a Hono server file,
which means the client JS and the server template are coupled in a single
`.ts` file. Surgical change but deserves a dedicated session — I want to read
the full request lifecycle before injecting tracking calls.

---

## B1 — Redirect policymaker.disclose.io/ → /policymaker/introduction (LOW-MEDIUM)

**Why:** Root page = 6.4s avg session; `/policymaker/introduction` = 91s. Same
product, different landing. Anyone arriving at the root bounces.

**Proposed action:** Find the Nuxt routing config in `~/Projects/policymaker/`
and add a permanent redirect (308) from `/` to `/policymaker/introduction`,
OR set the default index page to render the introduction content directly.

**Why I didn't just do it:** policymaker's `pages/` dir only has a nested
`policymaker/` subdir, no top-level `pages/index.vue` — the Nuxt structure is
non-obvious and I'd rather not guess at the routing convention.

---

## A4 — UTM discipline (ongoing process, not code)

Every outbound link from your Bluesky/X/LinkedIn/newsletter posts going forward
should carry `?utm_source=<channel>&utm_medium=social&utm_campaign=<topic>`.
Eighty percent of main-property traffic is "(direct) / (none)" — most of that
is untagged social, not brand strength.

**A no-code helper option:** I can add a small UTM-builder page at
`/internal/utm-builder.html` (gated behind a query param) that you bookmark and
use to generate tagged URLs before posting. Say the word.

---

## A5 — Link Google Search Console (LOW effort, needs you in the UI)

Currently the deepest channel visibility is `firstUserDefaultChannelGroup`
("Organic Search" as a bucket). No per-query data. Five minutes in Search
Console + GA4 admin links the two and unlocks query-level reporting.

This needs you to be signed into both accounts in a browser — can't be done via
API alone without the property's verified ownership being linked at the GSC
side first.

---

## Cross-property AI-readiness rollout (shipped across all addressable repos)

The 2026-05-17 round shipped AI-readiness across every disclose.io property
where I had source-tree access and the change was surgical enough to ship
unattended. Status:

| Property | Shipped? | What landed | Where |
|---|---|---|---|
| **disclose.io** (main) | ✅ | llms.txt refresh, llms-full.txt, Dataset/CreativeWork schema on /programs and /framework, TL;DR blocks on 4 pages, newsletter CTA on 4 pages | this repo, `preview` branch (commits `8a4cb7c` + `d73aadf`) |
| **lookup.disclose.io** | ✅ | /llms.txt route (schema was already comprehensive) | `disclose/lookup.disclose.io` `feat/seo-static-landing-pages` (`1b96913`) |
| **vault.disclose.io** | ✅ | /llms.txt + /robots.txt routes (both were 404), full @graph schema with WebSite/Organization/SoftwareApplication/FAQPage, missing og: + twitter: meta tags | `disclosure-vault` `main` (`12e4be2`) |
| **dnssecuritytxt.org** | ✅ | docs/llms.txt (Jekyll site, picked up automatically on next push) | `disclose/dnssecuritytxt` `main` (`ea35c71`) |
| **blog.disclose.io** (Ghost) | ⏭️ | Needs admin-panel code injection (head + footer settings). Schema can be added that way without theme changes. | Ghost admin UI |
| **community.disclose.io** (Discourse) | ⏭️ | Needs a Discourse theme component (custom HTML in `<head>`) — Discourse has good native SEO, so the marginal value is lower than the other properties | Discourse admin → Customize → Themes |
| **policymaker.disclose.io** (Nuxt) | ⏭️ | Local repo at `~/Projects/policymaker/` is scaffold-only (empty subdirs). Real source likely lives on bucky — need to land on the right host before editing | bucky (presumed) |
| **directory.disclose.io** | ⏭️ | Repo not located in `~/Projects/` — referenced as a config URL only. Schema/llms.txt should go where the directory's HTML is actually served | TBD |

### After deploy, expected new endpoints

- https://disclose.io/llms-full.txt (currently 404 — needs Cloudflare Pages rebuild on `preview` → `main`)
- https://lookup.disclose.io/llms.txt (currently 404)
- https://vault.disclose.io/llms.txt + /robots.txt (currently 404)
- https://dnssecuritytxt.org/llms.txt (currently 404)

---

## Originally shipped (disclose.io main repo only — kept for history)

- **C1 AI-readiness:**
  - Refreshed `static/llms.txt` with deeper page index (Framework terms, all
    docs, tools subdomains)
  - Added `Dataset` JSON-LD to `/programs`
  - Added `CreativeWork` JSON-LD to `/framework`
  - New reusable `partials/page-tldr.html` rendering verbatim-quotable
    summary blocks on `/platforms`, `/programs`, `/threats`, `/framework`
  - `llms-full.txt` Hugo output format (generated at build time, full corpus
    for AI crawlers)
- **C2 returning-user loop:**
  - Extracted newsletter CTA to `partials/newsletter-cta.html`
  - Added to all four high-engagement pages so net-new users encounter it on
    the pages they spend the most time on (per the 2x returning-user
    engagement signal)
- **B6 schema markup:** covered by C1 above

## Recommendations that are process, not code (not in this commit)

- **B5** Policy Pulse cadence — you're already on it; keep it.
- **C3** Selected HN submissions — your call when there's a worthy piece.
- **C4** Reddit engagement — find the 3-5 VDP/bug-bounty subreddits worth a real human presence.
- **C5** LinkedIn / Facebook decision — commit to a cadence with UTMs, or drop them and stop spending attention.
- **C6** Bugcrowd referral partnership — 14 sessions at 75% engagement is a relationship signal; a quick chat with Casey/Bugcrowd folks could compound it.
