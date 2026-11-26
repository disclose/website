{{- /* Markdown twin of the home page, for AI agents. llms.txt is the curated entry point. */ -}}
# {{ .Site.Title }}

> {{ .Site.Params.description | default "disclose.io is the open, vendor-neutral infrastructure that powers vulnerability disclosure and security reporting." }}

Start with https://disclose.io/llms.txt (curated) or https://disclose.io/llms-full.txt (everything). Every page has a Markdown twin at its URL plus index.md.

## Sections

{{ range .Site.Sections }}- [{{ .Title }}]({{ .Permalink }}){{ with .OutputFormats.Get "markdown" }} (Markdown: {{ .Permalink }}){{ end }}
{{ end }}
## Pages

{{ range where .Site.RegularPages "Section" "" }}{{ if not .Params.redirect_to }}- [{{ .Title }}]({{ .Permalink }}){{ with .OutputFormats.Get "markdown" }} (Markdown: {{ .Permalink }}){{ end }}
{{ end }}{{ end }}
