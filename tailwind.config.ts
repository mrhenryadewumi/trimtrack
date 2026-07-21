import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        num: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        green: {
          50:  '#e8f5ee',
          100: '#c6e6d3',
          500: '#2d8a56',
          600: '#1a5c38',
          700: '#14532d',
          900: '#0f2d1e',
        },
        lime: {
          400: '#b5f23d',
          500: '#8dc42a',
        },
        surface: { DEFAULT: 'var(--tt-bg)', card: 'var(--tt-card)', deep: 'var(--tt-deep)', sheet: 'var(--tt-sheet)' },
        ink: { DEFAULT: 'var(--tt-ink)', body: 'var(--tt-txt2)', mut: 'var(--tt-mut)', faint: 'var(--tt-faint)' },
        accent: { DEFAULT: 'var(--tt-acc)', bg: 'var(--tt-acc-bg)', line: 'var(--tt-acc-line)' },
        macro: { protein: '#5e9bff', carbs: '#f5c542', fat: '#ff8a5e' },
      },
      borderColor: { hairline: 'var(--tt-line)' },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
export default config
