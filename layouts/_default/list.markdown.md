{{- /* Markdown twin of a section page, for AI agents. */ -}}
# {{ .Title }}
{{ with .Description }}
> {{ . }}
{{ end }}
Source: {{ .Permalink }}

{{ with .RawContent }}{{ . }}

{{ end -}}
{{- with .Pages }}## Pages in this section

{{ range . }}- [{{ .Title }}]({{ .Permalink }}){{ with .OutputFormats.Get "markdown" }} (Markdown: {{ .Permalink }}){{ end }}{{ with .Description }}: {{ . }}{{ end }}
{{ end }}{{ end -}}
