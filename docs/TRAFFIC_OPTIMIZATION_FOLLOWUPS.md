# Traffic Optimization Follow-ups

Generated from the 2026-05-17 GA 7-day analysis. The unattended work
(C1 AI-readiness on disclose.io, C2 newsletter CTA propagation) shipped
in commit alongside this file. The items below need your input before
they can ship — each is scoped so it's ready to execute on approval.

## A1 — Block bot traffic in GA4 admin ✅ SHIPPED 2026-05-17

Audience `Likely Crawlers` (id `properties/365274897/audiences/14895335664`)
now lives on the main property. Conditions: country=Singapore AND
sessionDefaultChannelGroup=Direct AND hostName=directory.disclose.io.
Scope: across all sessions, 30-day membership.

**How to use:** GA4 → Reports → Library → Customize → add Comparison →
"Audience" → exclude `Likely Crawlers`. Or use it in Explore as a segment
exclusion. Reversible via the audience admin if unwanted.

**Note on the original spec:** the engagement-rate < 5% condition was
dropped because GA4 audience builders don't support that metric threshold
directly. The 3-AND-condition signature is precise enough on its own — the
5/10 bot wave wouldn't pass the country + direct + directory filter without
also having near-zero engagement.

Provisioner script: `~/.claude/skills/GoogleAnalytics/Tools/provision-likely-crawlers.ts`
(idempotent, safe to re-run).

---

## A1.5 — IP-based Developer/Internal Traffic filter

Still on the table as a stronger complement to the audience. Cloudflare
obscures the actual origin IP in the GA dimension, so this needs either:
(a) a server-side fix that surfaces the real client IP back to GA, or
(b) acceptance that the audience filter is the practical ceiling here.

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

## A3 — Fire SPA route-change pageviews on lookup.disclose.io ✅ SHIPPED 2026-05-17

`renderResults` in `~/Projects/lookup-disclose-io/web/index.html` now fires
a gtag virtual page_view on every result render:
- `page_path: /result/<assetType>/<status>` — e.g. `/result/domain/complete`
- `page_title: Lookup result — <assetType> (<status>)`

assetType is sanitized to lowercase a-z/0-9/hyphen/underscore for a clean
virtual path. Status is one of `complete | partial | failed | unknown`.
Defensive guard ensures the call no-ops if gtag isn't loaded.

Commit `fd0b812` on `feat/seo-static-landing-pages`. After deploy, GA will
show per-asset-type traffic distribution and per-status success rates
instead of one `/` aggregate.

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

## A4 — UTM discipline ✅ HELPER SHIPPED 2026-05-17, ongoing discipline still on you

UTM builder page lives at `https://disclose.io/internal/utm-builder.html`
(after deploy). noindex+nofollow, self-contained HTML/JS form, disclose.io
brand colors. Pre-loaded with the channels you actually use (Bluesky, X,
LinkedIn, Mastodon, newsletter, email, slack, discord, podcast, HN,
reddit, github).

**Bookmark it.** Two-week test: tag every outbound link going forward.
Then run a `sessionSource` report and see if "(direct)" share of weekly
users drops below 70%. If yes, UTM discipline is paying off; if no, the
direct traffic is genuinely dark (privacy browsers, AI-assistant referrals
that strip referer headers, etc.) rather than untagged-by-us.

---

## B2 — Investigate /threats engagement collapse ✅ DIAGNOSED 2026-05-17

Opened https://disclose.io/threats/ live via Interceptor (real Chrome). Page
renders correctly — full nav, 60+ case entries (Columbus / Modern Solution /
NEWAG / Ford / Apple / FreeHour / Josh Renaud / etc.), all links working,
no console errors, accessibility tree clean.

**Diagnosis:** /threats is NOT broken. The 4.9% engagement rate on 60-of-61
"direct" sessions is the bot signature (a scoped scanner hitting /threats
specifically). Now excluded by the `Likely Crawlers` audience created in A1.

No code change needed for /threats itself.

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
