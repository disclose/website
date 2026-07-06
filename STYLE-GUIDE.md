# disclose.io Copy Style Guide

A reference for writing consistent, on-brand content for disclose.io.

---

## Voice & Tone

**Character:** Professional yet approachable. Educational rather than prescriptive.

**Voice Principles:**
- Active voice preferred ("We provide tools" not "Tools are provided")
- Confident and aspirational about vulnerability disclosure
- Empathetic to all audiences (researchers, legal teams, organizations)
- Direct without being cold

**Examples:**
- Good: "disclose.io provides free, open-source tools and data..."
- Good: "We want to help you make safe decisions..."
- Avoid: "Tools have been developed which can be utilized..."

---

## Brand Terminology

### Core Terms

| Term | Usage | Example |
|------|-------|---------|
| **disclose.io** | Always lowercase with period | "the disclose.io Project" |
| **The disclose.io Project** | Capitalized when referring to the initiative | "Join The disclose.io Project" |
| **Policymaker** | Capitalized (product name) | "Generate a policy with Policymaker" |
| **VDP** | Acronym, always caps | "start a VDP" |
| **vulnerability disclosure** | Lowercase mid-sentence | "vulnerability disclosure programs" |
| **Safe Harbor** | Two words, capitalized as concept | "Safe Harbor provisions" |
| **good-faith security research** | Hyphenated, lowercase | "protect good-faith security research" |
| **bug bounty** | Lowercase | "bug bounty programs" |

### Audience Terms

| Preferred | Context |
|-----------|---------|
| hackers, finders | Security community members discovering issues |
| security researchers | Formal/professional context |
| security practitioners and executives | Security leaders and decision-makers within organizations |
| organizations | Companies receiving reports |
| legal teams | In-house counsel and lawyers |
| builders | Organizations creating products |

**Note:** Use "hackers" confidently - it's reclaimed language in this context.

### Avoid

| Don't Use | Use Instead |
|-----------|-------------|
| responsible disclosure | vulnerability disclosure |
| bug hunters | hackers, finders, security researchers |
| white hat hackers | good-faith security researchers |
| click here | [descriptive link text] |

---

## Capitalization

### Always Capitalized
- The disclose.io Project
- Policymaker
- Neighborhood Watch for the Internet
- Safe Harbor (as concept)
- The Terms, The List, The Seal (project names)
- VDP, CVD, CFAA (acronyms)

### Always Lowercase
- disclose.io (the brand)
- vulnerability disclosure
- security research/researcher
- bug bounty
- hackers/finders

### Repository Names
Use code formatting, lowercase: `dioterms`, `diodb`, `dioseal`

### Headings
- Page titles: Title Case ("What is disclose.io")
- Main sections: Title Case ("Key Objectives")
- Subsections: Sentence case ("As a finder...")

---

## Punctuation

### Oxford Comma
Always use: "security researchers, lawyers, and technology vendors"

### Dashes
- Em dashes without spaces for parenthetical phrases
- Example: "...security research—in a way that balances risk..."

### Exclamation Points
Use sparingly for enthusiasm: "Let's send best practice viral!"

---

## Formatting

### Bold
Use strategically for:
- Key concepts: "**cross-industry, vendor-agnostic standardization project**"
- Audience segments: "**hackers and finders**"
- Important phrases: "**good-faith security research**"

### Links
- Contextual anchor text: "[disclose.io Community](url)" not "[click here](url)"
- Include full URL for code/API references
- Repository links: "[dioterms](https://github.com/disclose/dioterms)"

### Lists
- Bullet points for non-sequential items
- Avoid numbered lists unless order matters
- Lead with action verbs when listing tasks

### Tables
Use for:
- Comparisons
- Maturity models
- Press/resource listings

### Blockquotes
Use for:
- Definitions
- Mission/vision statements
- Important callouts

---

## Signature Phrases

Use these recurring phrases for consistency:

- "safe, simple, and standardized for everyone"
- "Neighborhood Watch for the Internet"
- "Internet Immune System"
- "good-faith security research"
- "cross-industry, vendor-agnostic"

---

## Writing for Audiences

### Dual-Audience Approach

disclose.io content speaks to **both researchers AND organizations simultaneously**. We don't write for one or the other - we write for the relationship between them.

**Core principle:** Every piece of content should resonate with both sides of the vulnerability disclosure equation. When a researcher reads our content, they should feel supported. When an organization reads the same content, they should see the value and path forward.

### What Each Audience Needs to Hear

| Researchers/Finders | Organizations/Legal/Executives |
|---------------------|-------------------------------|
| Legal safety and protection | Best practices and standards |
| Good-faith recognition | Risk reduction and maturity |
| Community support | Industry alignment and consensus |
| Clear reporting paths | Competitive advantage |

### Balancing Tone

- **Supportive** to researchers without being adversarial to organizations
- **Professional** to organizations without being cold to researchers
- **Empathetic** to the challenges both sides face
- **Aspirational** about what's possible when both sides collaborate

### Example of Dual-Audience Writing

> "Safe Harbor provisions protect good-faith security researchers from legal action while giving organizations confidence that their vulnerability disclosure program operates on established best practices."

This single sentence validates researchers (protection) AND organizations (confidence, best practices).

---

## Page Structure

### Standard Documentation Page
1. Brief intro paragraph (problem or context)
2. Main content with subheadings
3. Bullet points or tables for details
4. Call-to-action or related links

### FAQ Pattern
1. Direct answer first
2. Empathetic acknowledgment when appropriate ("Glad you asked!")
3. Actionable guidance
4. Links to resources

---

## External References

### Organizations (Full Name First Use)
- Electronic Frontier Foundation (EFF)
- Cybersecurity and Infrastructure Security Agency (CISA)
- National Institute of Standards and Technology (NIST)

### Standards
- Include full reference: "ISO/IEC 30111:2019"
- Link to official source when possible

---

## Quick Reference

### Do
- Use active voice
- Write "disclose.io" lowercase
- Use Oxford commas
- Bold key concepts strategically
- Use descriptive link text
- Address audiences empathetically

### Don't
- Use passive voice unnecessarily
- Capitalize "disclose.io"
- Say "responsible disclosure"
- Overuse exclamation points
- Use "click here" links
- Be prescriptive or condescending

---

## Visual & UI Consistency

The site's visual language lives in `tailwind.config.js` (colors: `purple` #673ab6, `shade-050..900`; `font-display` = Noto Sans Display) and the component classes in `assets/css/main.css` (notably `.card` = white / `rounded-xl` / `shadow-sm` / `border-shade-200`). Compose these tokens; do not invent one-off colors, radii, or shadows.

### Table / directory pages (platforms, threats)

Pages that render a large table from a submodule README (`layouts/_default/platforms.html`, `layouts/_default/threats.html`) follow one shared convention so they read as one system:

- **Contain the content** to `max-w-6xl`, never `max-w-[1440px]` (edge-to-edge reads as an unstyled data dump).
- **Card the tables.** Each logical table uses the `.card` treatment (white, `rounded-xl`, `border-shade-200`, `shadow-sm`, `overflow-hidden`). On platforms each category is its own card; on threats each incident table is a card.
- **Section headers** are purple `font-display` (the site h2/h3 convention), not plain gray, each with a per-card count badge (platforms: platform count per category; threats: incident count per group). On threats the labels are positional, so `threats.html` only applies them when the table count matches the label list exactly (else it degrades to unlabelled cards and warns at build).
- **Soft table chrome:** uppercase `gray-600` labels on `shade-050`, `shade-100` row borders, `shade-050` hover tint. No sticky headers; no hard black-on-gray.
- **Columns are per-page:** platforms cells are compact and truncate with shared `th` widths so all sections align; threats keeps the narrative `Status` column wrapping (never truncate prose) and mutes/emphasizes by column position.
- Jump-nav (platforms) is pill chips rebuilt from the section list so anchor ids always match; `scroll-mt-24` clears the fixed navbar.

### Acceptance gates (verify before shipping any table-page change)

1. **Data conserved:** rendered row count == source README row count (nothing dropped by extraction/rendering).
2. **Contrast ≥ WCAG AA 4.5:1** on every new text/background pair. Compute it: tokens frequently miss AA (`gray-500` on `shade-050` is 4.38:1, use `gray-600`).
3. **No prose truncation** where a cell holds narrative (threats `Status`); short-data cells may truncate.
4. **Mobile:** wide tables scroll inside their card; the page body must not scroll horizontally.
5. **Verify against a FULL production build** (`npm run build` = prebuild + `build:css --minify` + hugo + pagefind), not `hugo server` — the dev server throws a `PagefindUI is not defined` console error and skips Tailwind purge.
6. **After deploy, cache-bust before trusting the render:** `/css/main.css` is unfingerprinted, so a browser that visited earlier serves stale CSS — hard-reload (cmd+shift+r) or `curl https://disclose.io/css/main.css` and grep for the new classes. Also: the GitHub Pages deploy step can transiently fail with "Deployment failed, try again later" — re-run it (`gh run rerun <id> --failed`), it is not a code problem.

**Footgun:** column emphasis/sizing by `nth-child` is positional — it only works if every table on the page shares the same column *order* (threats' 4 tables all run When / Entity / Researcher / Topic / Status even though their headers differ).

---

*This style guide reflects disclose.io's commitment to being accessible across diverse audiences while maintaining professional authority in the vulnerability disclosure space.*
