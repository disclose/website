/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    // Frozen directory-shell chrome is styled by the frozen static/css/main.css, not site.css.
    '!./layouts/partials/legacy/**',
    './content/**/*.md',
    './content/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        // state.disclose.io design system (diostatus-snapshot build-page.ts :root), adopted 2026-11-25.
        purple: {
          DEFAULT: '#673ab6', // --accent
          dark: '#4c1d95',    // --accent-deep (was #322a41)
          light: '#a78bfa',
        },
        // Violet surfaces: --bg-alt, --bg-tint, --bg-deep.
        tint: {
          50: '#faf7ff',
          100: '#f3f0ff',
          200: '#ede9fe',
        },
        // NOTE: "gray" is Tailwind's SLATE palette, so text-gray-* matches state's
        // slate neutrals (--ink #0f172a, --muted #64748b). Intentional remap.
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Neutral ramp re-based on state's slate surfaces and #e5e7eb line.
        shade: {
          '050': '#f8fafc',
          '100': '#f1f5f9',
          '200': '#e5e7eb',
          '300': '#cbd5e1',
          '400': '#94a3b8',
          '500': '#64748b',
          '600': '#475569',
          '700': '#334155',
          '800': '#1e293b',
          '900': '#0f172a',
        },
      },
      fontFamily: {
        // state.disclose.io stack. Noto Sans was never actually loaded.
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Inter"', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', '"Inter"', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // Point every prose variable at the slate-remapped gray scale. The plugin
            // otherwise hard-codes Tailwind's original gray (#374151, #6b7280, ...).
            '--tw-prose-body': theme('colors.gray.700'),
            '--tw-prose-headings': theme('colors.gray.900'),
            '--tw-prose-lead': theme('colors.gray.600'),
            '--tw-prose-links': theme('colors.purple.DEFAULT'),
            '--tw-prose-bold': theme('colors.gray.900'),
            '--tw-prose-counters': theme('colors.gray.600'),
            '--tw-prose-bullets': theme('colors.gray.400'),
            '--tw-prose-hr': theme('colors.shade.200'),
            '--tw-prose-quotes': theme('colors.gray.900'),
            '--tw-prose-quote-borders': theme('colors.purple.DEFAULT'),
            '--tw-prose-captions': theme('colors.gray.600'),
            '--tw-prose-kbd': theme('colors.gray.900'),
            '--tw-prose-code': theme('colors.purple.dark'),
            '--tw-prose-pre-code': theme('colors.gray.200'),
            '--tw-prose-pre-bg': theme('colors.gray.900'),
            '--tw-prose-th-borders': theme('colors.shade.200'),
            '--tw-prose-td-borders': theme('colors.gray.100'),
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.purple.DEFAULT'),
              '&:hover': {
                color: theme('colors.purple.dark'),
              },
            },
            h1: {
              color: theme('colors.gray.900'),
              fontFamily: theme('fontFamily.display').join(', '),
              letterSpacing: '-0.02em',
            },
            h2: {
              color: theme('colors.gray.900'),
              fontFamily: theme('fontFamily.display').join(', '),
            },
            h3: {
              color: theme('colors.gray.900'),
            },
            h4: {
              color: theme('colors.gray.900'),
            },
            code: {
              color: theme('colors.purple.dark'),
              backgroundColor: theme('colors.tint.100'),
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
            },
            blockquote: {
              borderLeftColor: theme('colors.purple.DEFAULT'),
              fontStyle: 'normal',
            },
          },
        },
      }),
    },
  },
  safelist: [
    'grid-cols-5',
    'grid-cols-10',
    'sm:grid-cols-10',
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
