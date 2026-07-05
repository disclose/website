<div align="center">

# disclose.io — website

### The **front door** that explains disclosure, safe harbor, and how to adopt best practice in minutes. The Hugo source for [disclose.io](https://disclose.io).

<p>
<a href="LICENSE"><img src="https://img.shields.io/github/license/disclose/website?color=5B3AB6&label=license" alt="license"></a>
<a href="https://disclose.io"><img src="https://img.shields.io/badge/live-disclose.io-5B3AB6" alt="live disclose.io"></a>
<a href="https://gohugo.io"><img src="https://img.shields.io/badge/built%20with-Hugo-5B3AB6" alt="built%20with Hugo"></a>
<a href="https://github.com/disclose/website/issues"><img src="https://img.shields.io/badge/PRs-welcome-5B3AB6" alt="PRs welcome"></a>
</p>

*Part of **[the disclose.io Project](https://disclose.io)** — the open, vendor-neutral infrastructure for vulnerability disclosure. [Browse the ecosystem →](https://github.com/disclose)*

</div>

---


# disclose.io Website

The official [disclose.io](https://disclose.io) website, built with Hugo and Tailwind CSS.

## Development

### Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) (v0.124.0 or later)
- [Node.js](https://nodejs.org/) (v20 or later)

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

This starts:
- Hugo server with live reload at http://localhost:1313
- Tailwind CSS in watch mode

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
disclose-io-hugo/
├── assets/css/         # Tailwind CSS source
├── config/_default/    # Hugo configuration
│   ├── hugo.toml       # Main config
│   ├── menus.toml      # Navigation menus
│   └── params.toml     # Site parameters
├── content/
│   ├── docs/           # Documentation pages
│   ├── faqs/           # FAQ entries (headless bundle)
│   ├── _index.md       # Homepage
│   ├── contact.md      # Contact page
│   ├── history.md      # History timeline
│   └── programs.md     # VDP programs page
├── data/
│   ├── changelog.yaml  # History timeline data
│   ├── navigation/     # Navigation data
│   └── videos.yaml     # Video embeds
├── layouts/
│   ├── _default/       # Base templates
│   ├── docs/           # Documentation layouts
│   ├── partials/       # Reusable components
│   └── shortcodes/     # Content shortcodes
└── static/
    ├── css/            # Compiled CSS
    ├── standalone/     # Iframe content
    └── uploads/        # Images and assets
```

## Deployment

The site deploys to GitHub Pages via GitHub Actions. Push to `main` to trigger deployment.

## Design

The site uses the policymaker.disclose.io design system:
- Primary color: Purple #673ab6
- Typography: Noto Sans
- Framework: Tailwind CSS

## Contributing

See the main [disclose.io contribution guide](https://disclose.io/docs/contributors/).

## License

MIT License - See LICENSE file
