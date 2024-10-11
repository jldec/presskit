/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{html,js,jsx,ts,tsx,md}', '../client/index.tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: '15px',
            lineHeight: '1.4',
            h1: {
              fontSize: theme('fontSize.3xl'),
              textTransform: 'uppercase'
            },
            h2: {
              fontSize: theme('fontSize.2xl'),
              textTransform: 'uppercase'
            },
            ul: {
              listStyleType: 'square'
            },
            li: {
              lineHeight: '1.2',
              margin: '0.25rem 0'
            },
            p: {
              marginTop: '1.4rem',
              marginBottom: '1.4rem'
            },
            a: {
              textDecorationThickness: '1.5px'
            },
            ['a:hover']: {
              textDecorationStyle: 'double'
            },
            hr: {
              margin: '1.4rem 0',
              paddingBottom: '1.5px',
              borderTop: 'solid 1.5px currentColor',
              borderBottom: 'solid 1.5px currentColor'
            },
            input: {
              display: 'block',
              minWidth: '75%',
              margin: '1.4rem 0',
              padding: '8px',
              border: 'solid 1.5px currentColor'
            },
            img: {
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: theme('borderRadius.md'),
            },
            pre: {
              backgroundColor: '#222',
              color: '#7f7',
              minHeight: '100px'
            },
            blockquote: {
              fontStyle: 'normal',
              margin: '2rem auto',
              padding: '0 1rem',
              border: 'solid 1.5px currentColor',
              borderRadius: theme('borderRadius.md'),
            },
            ['blockquote p::before']: {
              content: 'none'
            },
            ['blockquote p::after']: {
              content: 'none'
            }
          }
        }
      })
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
