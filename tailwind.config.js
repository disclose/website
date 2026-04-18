/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.md',
    './content/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: '#673ab6',
          dark: '#322a41',
          light: '#8b5cf6',
        },
        shade: {
          '050': 'hsla(240, 8%, 97%, 1)',
          '100': 'hsla(240, 5%, 93%, 1)',
          '200': 'hsla(229, 5%, 89%, 1)',
          '300': 'hsla(225, 4%, 82%, 1)',
          '400': 'hsla(230, 4%, 73%, 1)',
          '500': 'hsla(231, 4%, 63%, 1)',
          '600': 'hsla(230, 4%, 56%, 1)',
          '700': 'hsla(231, 3%, 51%, 1)',
          '800': 'hsla(231, 3%, 46%, 1)',
          '900': 'hsla(231, 3%, 41%, 1)',
        },
      },
      fontFamily: {
        sans: ['Noto Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Noto Sans Display', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
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
              backgroundColor: theme('colors.shade.100'),
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
