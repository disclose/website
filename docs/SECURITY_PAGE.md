# The /security/ page

How [disclose.io/security](https://disclose.io/security/) works, and how to change it without breaking it.

## What the page is

disclose.io's own vulnerability disclosure policy, followed by a form for reporting a vulnerability to us. The policy is published on DiscloseBot and embedded here, so **DiscloseBot is the single source of the policy text**. Do not paste policy text into `content/security.md`.

| Thing | Where it lives |
|---|---|
| Policy | DiscloseBot policy `fabeb9`, hosted copy at https://disclose.disclosebot.io/policy/fabeb9 |
| Reporting brief (scope, rules, inbox) | DiscloseBot brief `fa08cb`, hosted copy at https://disclose.disclosebot.io/brief/fa08cb |
| Page content | `content/security.md` (callout, policy embed, report form, dioterms footnote) |
| Policy embed | `layouts/shortcodes/disclosebot.html` |
| Report form | `layouts/shortcodes/disclosebot-report-form.html` |
| Build-time fetch cache | `config/_default/hugo.toml`, `[caches.getresource] maxAge = 0` |
| security.txt | `static/.well-known/security.txt`: Contacts in order are security@disclose.io, this page's form (`/security/#report`) and the hosted brief; Policy is this page; Expires 2027-06-30. **This one file is served on every disclose.io property** (see "security.txt on every property" below). |
| security.txt Worker | `workers/security-txt/` (Cloudflare Worker `security-txt` and its routes) |
| DNS security TXT | `_security.disclose.io` and the apex carry the same contacts, policy and expiry as `security_contact=`, `security_policy=`, `security_expires=` records (Cloudflare DNS, not in this repo). Change both together with security.txt. |

The policy itself is an instance of the dioterms [VDP with Coordinated Disclosure Window](/framework/terms/vdp-with-cvd/) template (`external/dioterms/terms/vdp-with-cvd/en-US.md`, organization disclose.io, channel security@disclose.io, 90-day window), plus a local note that disclose.io has no Hall of Fame and pays no compensation.

## How the policy embed works

`{{< disclosebot widget="policy" id="fabeb9" >}}` emits three things:

1. **A container**, `<div id="dscls-policy">`. DiscloseBot's widget attaches a Shadow DOM to it and renders the published policy inside, so site CSS cannot style it and it cannot affect the site.
2. **The same text, rendered at build time, inside the container.** The shortcode fetches `https://api.disclosebot.io/v1/p/policies/fabeb9.json` with `resources.GetRemote` and writes `policy_html` into the page. Once the widget attaches its shadow root this copy is hidden, so visitors see one policy. Readers without JavaScript, search engines, LLM crawlers, `curl` and archive.org still get the full text.
3. **The loader.** A queue stub (`window.Policy = window.Policy || function () { ... }`), `Policy('init', { policyId, container })`, then `<script async src="https://widgets.disclosebot.io/policy.js">`.

The shortcode also supports `widget="brief"`, which embeds DiscloseBot's full Brief widget (overview, scope, rules, policy tab and its own form). The page no longer uses it, because it repeated the policy.

### Things that will bite you

- **Hugo 0.128 (the CI pin) refuses the API's `application/vnd.api+json` content type** ("failed to resolve media type"), and declaring it under `[mediaTypes]` does not help. Request the `.json` URL form (`.../fabeb9.json`), which the API serves, so Hugo resolves the type from the extension.
- **The fallback text refreshes only on deploy.** The widget always shows the live policy; the build-time copy is as of the last build. After editing the policy in DiscloseBot, re-run the GitHub Pages workflow (`workflow_dispatch`) to refresh it.
- **If the build-time fetch fails, the build still succeeds.** The shortcode logs a `WARN` and falls back to a link to the hosted policy. Check the build log for `disclosebot shortcode:` warnings.
- **Console noise is expected:** DiscloseBot's widget preloads three of its own chunks (`/vite/assets/loader-*.js`) from the host origin and gets 404s. The real imports load from widgets.disclosebot.io, so the widget still renders.

## How the report form works

`{{< disclosebot-report-form brief="fa08cb" policy-anchor="#policy" >}}` is a native form styled with the site's Tailwind classes. It posts to DiscloseBot's documented public endpoint, the same one every DiscloseBot widget uses:

```
POST https://api.disclosebot.io/v1/p/briefs/fa08cb/reports
Content-Type: application/vnd.api+json

{"data":{"type":"report","attributes":{
  "title": "...", "description": "...", "reporter_email": "...",
  "policies_acknowledged": true},
  "relationships":{"assets":{"data":[{"type":"asset","id":"<asset id>"}]}}}}
```

- No authentication, CORS `*`, rate limited per address (5 a minute, 30 an hour). Responses: `201` with the report's `shortcode` (shown to the reporter as their reference), `422` with field errors, `429` when rate limited.
- `title`, `description`, `reporter_email` are required, and `policies_acknowledged` must be `true` (the checkbox, which links to the policy above it).
- The "Affected asset" list is read from the published brief at build time. Asset changes in DiscloseBot show up on the next deploy.
- Without JavaScript, a `<noscript>` block points to the hosted brief and to security@disclose.io.

Every report lands in the DiscloseBot inbox for the brief. Email to security@disclose.io is a separate channel (it is also forwarded into the same DiscloseBot inbox); the page tells reporters both reach the same place.

### Why not DiscloseBot's Brief or MiniBrief widget

- **Brief widget:** its overview, scope table, rules of engagement and Policy tab repeated the policy on the same page.
- **MiniBrief widget:** it never sends `policies_acknowledged`, so the brief's API rejects its reports with `422 must be accepted`. Revisit if DiscloseBot fixes it.

## Fonts and colours

These are set in DiscloseBot, not here. Both the policy and the brief use:

- Heading and body font **"Host page font"**, which the widget maps to `font-family: inherit`, so it uses the site's system font stack.
- Primary and accent `#673ab6`, secondary `#4c1d95` (the site's purples).
- Policy display header **hidden**: the policy text carries its own title, so the widget's title bar would repeat it.
- Theme **host** and frame **none** (DiscloseBot's defaults): no border or background, text colour from the page.

These settings also apply to the hosted DiscloseBot pages.

## security.txt on every property

`static/.well-known/security.txt` is the only copy. Every other disclose.io host serves it, so editing that file and deploying the site updates all of them (within the Worker's 5-minute cache).

| Host type | Hosts | How it gets the file |
|---|---|---|
| Apex (the origin) | disclose.io | GitHub Pages serves the repo file at `/.well-known/security.txt`. The legacy `/security.txt` path is routed to the Worker. |
| Proxied by Cloudflare | www, calendar, dates, dev, directory, go, history, links, lookup, platforms, policymaker, projects, state, threats, vault, zero (all `.disclose.io`), disclosecon.com, www.disclosecon.com | Worker `security-txt` (`workers/security-txt/worker.js`) fetches the apex file and returns it with the Canonical line set to the host it is answering. Routes are exact per host for `/.well-known/security.txt` and `/security.txt`, each also with a trailing `*`, because an exact route does not match a URL with a query string. |
| Redirect hosts | calendar, links, projects | Their zone redirect rules (Rules, Redirect Rules) exclude the two security.txt paths, so the Worker answers there instead of the redirect. |
| Behind Cloudflare Access | zero | An Access application "zero.disclose.io security.txt (public)" bypasses login for the two paths only. |
| DNS-only, not proxied | blog (Ghost), community (Discourse) | They redirect to the apex file: Ghost redirects (302, set in Ghost admin, Settings, Labs, Redirects) and Discourse permalinks (Admin, Customize, Permalinks). Discourse permalinks do not match a URL with a query string. |
| Not covered | m.disclose.io (Bitly short links) | Bitly answers for that host and serves its own `/security.txt`. It can only be covered by moving the short domain off Bitly. |

To deploy or check the Worker and routes (idempotent; a route that points at another script is reported, never replaced):

```
bun workers/security-txt/deploy.ts           # dry run
bun workers/security-txt/deploy.ts --apply   # upload the script, create missing routes
```

It needs `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_EMAIL` and `CLOUDFLARE_API_KEY` in the environment. When a new disclose.io host goes live behind Cloudflare, add it to `HOSTS` in `deploy.ts` and run it with `--apply`. If it has a redirect rule or Access in front, exempt the two paths as above.

Never route the Worker on `disclose.io/.well-known/security.txt`: that is its origin.

## Changing things

| To change | Do this |
|---|---|
| Policy wording, scope, commitments | Edit the policy in DiscloseBot. The widget updates at once; re-run the deploy workflow to refresh the build-time copy. Make no commitment the dioterms template does not make. |
| Which assets reporters can pick | Edit the brief's in-scope assets in DiscloseBot, then redeploy. |
| Page layout or copy around the policy | `content/security.md` |
| Form fields or behaviour | `layouts/shortcodes/disclosebot-report-form.html`. Keep the request shape above; it is DiscloseBot's public API. |
| Fonts or colours | DiscloseBot branding for the policy and the brief (see above). |

## Testing a change

1. Build with the CI's Hugo version: `HUGO_ENVIRONMENT=production hugo --gc --minify` with Hugo 0.128.0. Expect no `disclosebot` warnings.
2. In `public/security/index.html`, check for `id="dscls-policy"`, the form (`data-disclosebot-form="fa08cb"`), and the policy text (for example "Safe Harbor").
3. Deploy to dev.disclose.io first (the `preview` branch, served by Cloudflare Pages) and look at the page in a browser: the policy renders in the site font, there is no "View the program" card, and the console shows no errors beyond the known 404s above.
4. Submit one report through the form, with a title starting `[TEST]`, and confirm the success message shows a reference. Tell the security team so they can close it.
5. After merging to `main`, check that `https://disclose.io/.well-known/security.txt` is unchanged unless you meant to change it.
