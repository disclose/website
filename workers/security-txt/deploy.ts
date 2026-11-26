#!/usr/bin/env bun
// Deploy the security-txt Worker and its routes through the Cloudflare API.
//
//   bun workers/security-txt/deploy.ts            # dry run: show what would change
//   bun workers/security-txt/deploy.ts --apply    # upload the script, create missing routes
//
// Needs CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_EMAIL and CLOUDFLARE_API_KEY in the
// environment (Bun loads them from a .env in the working directory).
// Idempotent: existing routes for this script are left alone; a route on one of
// these exact patterns that points at another script is reported, never replaced.

import { readFileSync } from "fs";
import { join } from "path";

const SCRIPT = "security-txt";
// The trailing * forms are needed: an exact route pattern does not match a request
// that carries a query string (verified 2026-11-26), so "?anything" fell through.
const PATHS = ["/.well-known/security.txt", "/.well-known/security.txt*", "/security.txt", "/security.txt*"];

// Every web host of a disclose.io property that Cloudflare proxies, except the
// apex disclose.io (the origin of the file). Hosts that are DNS-only cannot run
// a Worker; see docs/SECURITY_PAGE.md for how they are covered.
const HOSTS: Record<string, string[]> = {
  "disclose.io": [
    "www.disclose.io", "calendar.disclose.io", "dates.disclose.io", "dev.disclose.io",
    "directory.disclose.io", "go.disclose.io", "history.disclose.io", "links.disclose.io",
    "lookup.disclose.io", "platforms.disclose.io", "policymaker.disclose.io",
    "projects.disclose.io", "state.disclose.io", "threats.disclose.io", "vault.disclose.io",
    "zero.disclose.io",
  ],
  "disclosecon.com": ["disclosecon.com", "www.disclosecon.com"],
};

// The apex serves its own /.well-known/security.txt (the origin); only its legacy
// /security.txt path is routed to the Worker.
const APEX_ROUTES = ["disclose.io/security.txt", "disclose.io/security.txt*"];

const apply = process.argv.includes("--apply");
const need = (k: string) => process.env[k] || (console.error(`${k} is not set`), process.exit(2));
const ACCOUNT = need("CLOUDFLARE_ACCOUNT_ID") as string;
const H = { "X-Auth-Email": need("CLOUDFLARE_API_EMAIL") as string, "X-Auth-Key": need("CLOUDFLARE_API_KEY") as string };
const API = "https://api.cloudflare.com/client/v4";

async function cf(path: string, init: RequestInit = {}) {
  const r = await fetch(`${API}${path}`, { ...init, headers: { ...H, ...(init.headers || {}) } });
  const j: any = await r.json().catch(() => ({}));
  if (!j.success) throw new Error(`${init.method || "GET"} ${path}: ${r.status} ${JSON.stringify(j.errors)}`);
  return j.result;
}

// 1. Script
const source = readFileSync(join(import.meta.dir, "worker.js"), "utf-8");
if (apply) {
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify({ main_module: "worker.js", compatibility_date: "2026-11-01" })], { type: "application/json" }));
  form.append("worker.js", new Blob([source], { type: "application/javascript+module" }), "worker.js");
  await cf(`/accounts/${ACCOUNT}/workers/scripts/${SCRIPT}`, { method: "PUT", body: form });
  console.log(`script ${SCRIPT}: uploaded (${source.length} bytes)`);
} else {
  console.log(`script ${SCRIPT}: would upload (${source.length} bytes)`);
}

// 2. Routes
let created = 0, kept = 0, conflicts = 0;
for (const [zoneName, hosts] of Object.entries(HOSTS)) {
  const zones = await cf(`/zones?name=${zoneName}`);
  if (!zones.length) { console.error(`zone ${zoneName} not found`); conflicts++; continue; }
  const zone = zones[0].id;
  const routes: any[] = await cf(`/zones/${zone}/workers/routes`);
  const patterns = hosts.flatMap((host) => PATHS.map((p) => `${host}${p}`)).concat(zoneName === "disclose.io" ? APEX_ROUTES : []);
  for (const pattern of patterns) {
    const hit = routes.find((r) => r.pattern === pattern);
    if (hit && hit.script === SCRIPT) { kept++; continue; }
    if (hit) { console.log(`CONFLICT ${pattern} -> ${hit.script} (left alone)`); conflicts++; continue; }
    if (apply) { await cf(`/zones/${zone}/workers/routes`, { method: "POST", body: JSON.stringify({ pattern, script: SCRIPT }), headers: { "content-type": "application/json" } }); }
    console.log(`${apply ? "created" : "would create"} ${pattern}`);
    created++;
  }
}
console.log(`routes: ${created} ${apply ? "created" : "to create"}, ${kept} already in place, ${conflicts} conflicts`);
process.exit(conflicts ? 1 : 0);
