#!/usr/bin/env node
// Generates content/framework/ from external/dioterms/ across three pillars:
// terms (legal boilerplate with mustache variables), practices (operational
// playbooks), and maturity (DIOstatus levels). Idempotent — writes only when
// bytes change so the Hugo watcher doesn't see phantom rebuilds.

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

// Pillar 1: Terms — legal boilerplate. Mustache variables get replaced.
const TERMS = [
  { src: 'core-terms-vdp.md',                       out: 'terms/core-vdp.md',            title: 'Vulnerability Disclosure Policy',   description: 'Canonical VDP boilerplate with safe harbor, from the disclose.io framework.', weight: 10 },
  { src: 'core-terms-bbp.md',                       out: 'terms/core-bbp.md',            title: 'Bug Bounty Program Policy',         description: 'Canonical BBP boilerplate with rewards structure and safe harbor.',          weight: 20 },
  { src: 'simple-safeharbor/simple-safe-harbor.md', out: 'terms/simple-safe-harbor.md',  title: 'Simple Safe Harbor',                 description: 'Condensed safe harbor clause for quick adoption.',                            weight: 30 },
];

const REGIONAL = [
  { src: 'regional/USA-core-terms.md',        slug: 'usa', title: 'United States',           weight: 10 },
  { src: 'regional/NLD-core-terms.md',        slug: 'nld', title: 'Netherlands',             weight: 20 },
  { src: 'regional/BEL-core-terms.md',        slug: 'bel', title: 'Belgium',                 weight: 30 },
  { src: 'regional/CHE-core-terms.md',        slug: 'che', title: 'Switzerland',             weight: 40 },
  { src: 'regional/CAN-core-terms.md',        slug: 'can', title: 'Canada',                  weight: 50 },
  { src: 'regional/AUS-core-terms-draft.md',  slug: 'aus', title: 'Australia (draft)',       weight: 60 },
  { src: 'regional/GBR-core-terms-draft.md',  slug: 'gbr', title: 'United Kingdom (draft)',  weight: 70 },
  { src: 'regional/NZD-core-terms-draft.md',  slug: 'nzd', title: 'New Zealand (draft)',     weight: 80 },
];

// Pillar 2: Practices — operational playbooks. No variable replacement; keep first H1.
const PRACTICES = [
  { src: 'practices/program-launch.md',              slug: 'program-launch',              title: 'Program Launch',              description: 'Preflight decisions, scoping, approvals, go-live checklist.',             weight: 10 },
  { src: 'practices/triage.md',                      slug: 'triage',                      title: 'Triage',                      description: 'Intake, severity calibration, deduplication, validation, routing.',       weight: 20 },
  { src: 'practices/coordinated-disclosure.md',      slug: 'coordinated-disclosure',      title: 'Coordinated Disclosure',      description: 'Timelines, negotiation, public disclosure, multi-party coordination.',    weight: 30 },
  { src: 'practices/safe-harbor-implementation.md',  slug: 'safe-harbor-implementation',  title: 'Safe Harbor Implementation',  description: 'Aligning Legal, TOS/AUP, platform agreements, and internal procedures.',  weight: 40 },
  { src: 'practices/researcher-relations.md',        slug: 'researcher-relations',        title: 'Researcher Relations',        description: 'Communication cadence, recognition, escalation, program transparency.',   weight: 50 },
];

// Pillar 3: Maturity — DIOstatus levels. No variable replacement; keep first H1.
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

function stripFirstH1(content) {
  const lines = content.split('\n');
  const idx = lines.findIndex((line) => line.trim().startsWith('# '));
  if (idx === -1) return content;
  lines.splice(idx, 1);
  while (lines.length > 0 && lines[0].trim() === '') lines.shift();
  return lines.join('\n');
}

function frontMatter({ title, description, weight, extra = {} }) {
  const lines = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `weight: ${weight}`,
    'type: framework',
    'source_repo: "https://github.com/disclose/dioterms"',
    'license: "CC0-1.0"',
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

function processFile({ src, out, title, description, weight, replaceVariables: doReplace, stripFirstH1: doStrip, extra }) {
  const srcPath = path.join(SRC, src);
  if (!fs.existsSync(srcPath)) {
    console.warn(`[skip] source not found: ${src}`);
    return null;
  }
  let content = fs.readFileSync(srcPath, 'utf8');
  if (doStrip) content = stripFirstH1(content);
  if (doReplace) content = replaceVariables(content);
  const body = frontMatter({ title, description, weight, extra }) + content.trimStart();
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

function writeRegionalIndex() {
  const body = [
    '---',
    'title: "Regional Variants"',
    'description: "Jurisdiction-specific adaptations of the core dioterms."',
    'weight: 40',
    'type: framework',
    '---',
    '',
    'The following regional variants adapt the core dioterms language to the legal and regulatory context of specific jurisdictions. Drafts are marked as such.',
    '',
  ].join('\n');
  return writeIfChanged(path.join(OUT, 'terms', 'regional', '_index.md'), body) && path.join(OUT, 'terms', 'regional', '_index.md');
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const wrote = new Set();
  let count = 0;

  // Pillar 1 — Terms (core + regional)
  for (const m of TERMS) {
    const p = processFile({ ...m, replaceVariables: true, stripFirstH1: true });
    if (p) { wrote.add(p); count++; }
  }

  wrote.add(path.join(OUT, 'terms', 'regional', '_index.md'));
  writeRegionalIndex();

  for (const r of REGIONAL) {
    const p = processFile({
      src: r.src,
      out: `terms/regional/${r.slug}.md`,
      title: r.title,
      description: `Regional dioterms variant for ${r.title}.`,
      weight: r.weight,
      replaceVariables: true,
      stripFirstH1: true,
    });
    if (p) { wrote.add(p); count++; }
  }

  // Pillar 2 — Practices
  for (const m of PRACTICES) {
    const p = processFile({
      src: m.src,
      out: `practices/${m.slug}.md`,
      title: m.title,
      description: m.description,
      weight: m.weight,
      replaceVariables: false,
      stripFirstH1: true,
    });
    if (p) { wrote.add(p); count++; }
  }

  // Pillar 3 — Maturity (with /docs/diostatus/ alias on _index)
  for (const m of MATURITY) {
    const p = processFile({
      src: m.src,
      out: `maturity/${m.slug}.md`,
      title: m.title,
      description: m.description,
      weight: m.weight,
      replaceVariables: false,
      stripFirstH1: true,
    });
    if (p) { wrote.add(p); count++; }
  }

  pruneStale(wrote);

  console.log(`\nPreprocessed ${count} framework pages -> content/framework/`);
}

main();
