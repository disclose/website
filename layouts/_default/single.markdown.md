{{- /* Markdown twin of a page, for AI agents. Served at <page>/index.md and advertised with rel=alternate. */ -}}
{{- if .Params.redirect_to -}}
# {{ .Title }}

This page has moved to {{ .Params.redirect_to }}
{{- else if eq .Layout "directory-shell" -}}
# {{ .Title }}

The directory lives at https://directory.disclose.io/ (agents: https://directory.disclose.io/llms.txt).
{{- else -}}
# {{ .Title }}
{{ with .Description }}
> {{ . }}
{{ end }}
Source: {{ .Permalink }}{{ if not .Lastmod.IsZero }} · Updated {{ .Lastmod.Format "2006-01-02" }}{{ end }}

{{ with .RawContent }}{{ . }}{{ else }}This page is generated from data; read it at {{ $.Permalink }}{{ end }}
{{- end }}
