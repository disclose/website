#!/usr/bin/env node
// Generates content/framework/ from external/dioterms/ across two pillars:
// terms (legal boilerplate with mustache variables, including the four
// policymaker-aligned canonicals plus BBP) and maturity (diostatus levels).
// Idempotent — writes only when bytes change so the Hugo watcher doesn't see
// phantom rebuilds.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'external', 'dioterms');
const OUT = path.join(ROOT, 'content', 'framework');

const VARIABLES = {
  organization: 'Organization Name',
  channel: 'reporting channel',
  disclosure_window: 'number of days',
};

const PLACEHOLDER_OPEN = '<span class="framework-placeholder">[';
const PLACEHOLDER_CLOSE = ']</span>';

// Pillar 1: Terms — legal boilerplate. Mustache variables get replaced. The
// first four mirror policymaker.disclose.io's canonical template families 1:1;
// BBP is retained as a fifth canonical that policymaker does not currently
// carry. English renders for the website; other locales live in the dioterms
// folders alongside but aren't rendered here (policymaker serves them directly).
const TERMS = [
  { src: 'terms/vdp/en-US.md',                out: 'terms/vdp.md',                title: 'Vulnerability Disclosure Policy',         description: 'Canonical VDP boilerplate with safe harbor, from the disclose.io framework.',             weight: 10 },
  { src: 'terms/vdp-with-cvd/en-US.md',       out: 'terms/vdp-with-cvd.md',       title: 'VDP with Coordinated Disclosure Window',  description: 'Canonical VDP with an explicit coordinated-disclosure timeline.',                          weight: 15 },
  { src: 'terms/safe-harbor/en-US.md',        out: 'terms/safe-harbor.md',        title: 'Safe Harbor',                             description: 'Standalone full safe-harbor clause for attaching to an existing policy.',                  weight: 20 },
  { src: 'terms/simple-safe-harbor/en-US.md', out: 'terms/simple-safe-harbor.md', title: 'Simple Safe Harbor',                      description: 'Condensed safe harbor clause for quick adoption.',                                         weight: 25 },
  { src: 'bbp/en-US.md',                      out: 'terms/bbp.md',                title: 'Bug Bounty Program Policy',               description: 'Canonical BBP boilerplate with rewards structure and safe harbor.',                        weight: 30 },
];

// Pillar 3: Practices — operational conduct guidance. External authors retain
// rights; the file header carries attribution + license, which we surface in
// frontmatter so layouts can render an appropriate badge.
const PRACTICES = [
  {
    src: 'practices/good-faith-security-research.md',
    slug: 'good-faith-security-research',
    title: 'Accepted Practices for Good-Faith Security Research',
    description: 'Operational conduct for good-faith security research, originally published by NextJenSecurity (2026). Aligns with the disclose.io framework.',
    weight: 10,
    license: 'See file header — author retains rights, reproduced with attribution',
  },
];

// Pillar 2: Maturity — diostatus levels. No variable replacement; keep first H1.
const MATURITY = [
  { src: 'maturity/level-0.md', slug: 'level-0', title: 'Level 0 — Not Present',              description: 'No findable contact, no policy, no intake method.',                         weight: 10 },
  { src: 'maturity/level-1.md', slug: 'level-1', title: 'Level 1 — Contact Only',             description: 'security.txt published; a researcher can reach someone. No policy yet.',    weight: 20 },
  { src: 'maturity/level-2.md', slug: 'level-2', title: 'Level 2 — Basic VDP',                description: 'Public policy document and a real submission channel. No legal protection.', weight: 30 },
  { src: 'maturity/level-3.md', slug: 'level-3', title: 'Level 3 — Partial Safe Harbor',      description: 'A commitment not to pursue legal action. Report safely; test uncertainly.',  weight: 40 },
  { src: 'maturity/level-4.md', slug: 'level-4', title: 'Level 4 — Full Safe Harbor',         description: 'Explicit testing authorisation and carve-outs from CFAA / DMCA / TOS.',      weight: 50 },
  { src: 'maturity/level-5.md', slug: 'level-5', title: 'Level 5 — Full Safe Harbor + CVD',   description: 'Level 4 plus a public coordinated-disclosure timeline. Accountable.',       weight: 60 },
];

function replaceVariables(content) {
  let out = content;
  for (const [key, label] of Object.entries(VARIABLES)) {
    const pattern = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    out = out.replace(pattern, `${PLACEHOLDER_OPEN}${label}${PLACEHOLDER_CLOSE}`);
  }
  return out;
}

// Rewrites README-style `.md` links (which work on GitHub) into Hugo slug URLs
// so they don't 404 in production. Hugo's Goldmark emits `href` literally, so
// `[text](./file.md)` must become `[text](./file/)` to match the rendered URL.
function rewriteLinks(content) {
  // Fix stale "terms/core/vdp.md" reference from the dioterms source — the
  // real Hugo slug after preprocess is terms/core-vdp/, and the text path is
  // from an older layout.
  let out = content.replace(
    /\[terms\/core\/vdp\.md\]\(\.\.\/terms\/\)/g,
    '[terms/core-vdp.md](../terms/core-vdp/)'
  );

  // Strip .md extension from relative markdown link hrefs: `(./x.md)` → `(./x/)`,
  // `(../d/x.md#anchor)` → `(../d/x/#anchor)`. External (http/https/mailto) and
  // root-absolute (/...) hrefs are left alone because they match neither prefix.
  out = out.replace(
    /(\]\()(\.{1,2}\/[^)\s]+?)\.md(#[^)\s]*)?(\))/g,
    (_, open, path, anchor = '', close) => `${open}${path}/${anchor}${close}`
  );

  return out;
}

function stripFirstH1(content) {
  const lines = content.split('\n');
  const idx = lines.findIndex((line) => line.trim().startsWith('# '));
  if (idx === -1) return content;
  lines.splice(idx, 1);
  while (lines.length > 0 && lines[0].trim() === '') lines.shift();
  return lines.join('\n');
}

function frontMatter({ title, description, weight, license = 'CC0-1.0', extra = {} }) {
  const lines = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `weight: ${weight}`,
    'type: framework',
    'source_repo: "https://github.com/disclose/dioterms"',
    `license: ${JSON.stringify(license)}`,
  ];
  for (const [k, v] of Object.entries(extra)) {
    lines.push(`${k}: ${JSON.stringify(v)}`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

function writeIfChanged(outPath, body) {
  try {
    if (fs.readFileSync(outPath, 'utf8') === body) return 'unchanged';
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, body, 'utf8');
  return 'written';
}

// Replace em-dashes with sensible punctuation so generated pages match the
// disclose.io house style (no em-dashes). Applied to maturity descriptions
// (disclose.io's own content) only — NOT the canonical legal terms or the
// externally-attributed practices doc.
function dedashText(text) {
  return text.split('\n').map((line) => {
    const isHeading = /^\s{0,3}#{1,6}\s/.test(line);
    const isLabel = /^\s*(title|name)\s*[:=]/.test(line);
    let out = '';
    let i = 0;
    let first = true;
    while (i < line.length) {
      if (line[i] === ' ' && line[i + 1] === '—' && line[i + 2] === ' ') {
        const prev = out.length ? out[out.length - 1] : '';
        const colon = prev === ')' || prev === '*' || ((isHeading || isLabel) && first);
        out += colon ? ': ' : ', ';
        i += 3; first = false; continue;
      }
      if (line[i] === '—') {
        if (out.endsWith(' ')) out = out.slice(0, -1);
        out += ','; i += 1;
        if (line[i] !== ' ') out += ' ';
        continue;
      }
      out += line[i]; i += 1;
    }
    return out;
  }).join('\n');
}

function processFile({ src, out, title, description, weight, license, replaceVariables: doReplace, stripFirstH1: doStrip, dedash: doDedash, extra }) {
  const srcPath = path.join(SRC, src);
  if (!fs.existsSync(srcPath)) {
    console.warn(`[skip] source not found: ${src}`);
    return null;
  }
  let content = fs.readFileSync(srcPath, 'utf8');
  if (doStrip) content = stripFirstH1(content);
  if (doReplace) content = replaceVariables(content);
  content = rewriteLinks(content);
  if (doDedash) content = dedashText(content);
  const body = frontMatter({ title, description, weight, license, extra }) + content.trimStart();
  const outPath = path.join(OUT, out);
  const status = writeIfChanged(outPath, body);
  console.log(`[${status}] ${src} -> content/framework/${out}`);
  return outPath;
}

function pruneStale(keep) {
  if (!fs.existsSync(OUT)) return;
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir)) {
      const p = path.join(dir, entry);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        walk(p);
      } else if (!keep.has(p) && entry !== '_index.md') {
        fs.rmSync(p);
      }
    }
  };
  walk(OUT);
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const wrote = new Set();
  let count = 0;

  // Pillar 1 — Terms
  for (const m of TERMS) {
    const p = processFile({ ...m, replaceVariables: true, stripFirstH1: true });
    if (p) { wrote.add(p); count++; }
  }

  // Pillar 2 — Maturity (with /docs/diostatus/ alias on _index)
  for (const m of MATURITY) {
    const p = processFile({
      src: m.src,
      out: `maturity/${m.slug}.md`,
      title: m.title.replace(/\s—\s/g, ': '),
      description: m.description,
      weight: m.weight,
      replaceVariables: false,
      stripFirstH1: true,
      dedash: true,
    });
    if (p) { wrote.add(p); count++; }
  }

  // Pillar 3 — Practices (operational conduct, external authorship preserved)
  for (const m of PRACTICES) {
    const p = processFile({
      src: m.src,
      out: `practices/${m.slug}.md`,
      title: m.title,
      description: m.description,
      weight: m.weight,
      license: m.license,
      replaceVariables: false,
      stripFirstH1: true,
    });
    if (p) { wrote.add(p); count++; }
  }

  pruneStale(wrote);

  console.log(`\nPreprocessed ${count} framework pages -> content/framework/`);
}

main();
