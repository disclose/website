#!/usr/bin/env node
// Guard for the directory.disclose.io shell.
//
// directory.disclose.io wraps its content in this site's /directory-shell/ page and
// loads the FROZEN static/css/main.css (the pre-restyle stylesheet, kept byte-identical
// since 2026-11-25). The live site builds to css/site.css instead. If any markup the
// shell renders uses a class that main.css does not define, the directory breaks
// silently (on 2026-11-25 its desktop nav vanished this way).
//
// Run after `hugo` has built public/. Exits 1 and lists the missing classes if any.
// Usage: node scripts/check-frozen-shell.mjs [publicDir]
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const publicDir = process.argv[2] || "public";
const shellPath = join(publicDir, "directory-shell", "index.html");
const cssPath = join("static", "css", "main.css");

if (!existsSync(shellPath)) { console.error(`check-frozen-shell: ${shellPath} not found; build with hugo first.`); process.exit(1); }
if (!existsSync(cssPath)) { console.error(`check-frozen-shell: ${cssPath} not found; the frozen stylesheet must be committed.`); process.exit(1); }

const html = readFileSync(shellPath, "utf8");
const css = readFileSync(cssPath, "utf8");

// The shell must link the frozen stylesheet and must not link site.css.
const problems = [];
if (!/href=["']?\/?css\/main\.css/.test(html)) problems.push("shell does not link css/main.css");
if (/css\/site\.css/.test(html)) problems.push("shell links css/site.css (it must stay on the frozen main.css)");

// Every class in a class="" attribute must exist as a selector in main.css.
// (Classes inside Alpine :class expressions and the directory's own injected widgets are
// not in the built shell, so they are not checked here.)
const escapeForCss = (c) => c.replace(/([:/\[\]\.%#(),!=&'])/g, "\\$1");
const classes = new Set();
for (const m of html.matchAll(/(?<![:\w-])class=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
  for (const c of (m[1] ?? m[2] ?? m[3] ?? "").split(/\s+/)) if (c) classes.add(c);
}
const missing = [...classes].filter((c) => !css.includes("." + escapeForCss(c) + "{") &&
  !css.includes("." + escapeForCss(c) + ",") && !css.includes("." + escapeForCss(c) + ":") &&
  !css.includes("." + escapeForCss(c) + " ") && !css.includes("." + escapeForCss(c) + ">") &&
  !css.includes("." + escapeForCss(c) + "."));

if (missing.length) problems.push(`${missing.length} class(es) used by the shell are not in the frozen main.css: ${missing.sort().join(" ")}`);

if (problems.length) {
  console.error("check-frozen-shell: FAIL");
  for (const p of problems) console.error("  - " + p);
  console.error("Fix: render the shell with layouts/partials/legacy/* (frozen markup), not the restyled partials.");
  process.exit(1);
}
console.log(`check-frozen-shell: OK (${classes.size} classes in the shell, all present in the frozen main.css)`);
