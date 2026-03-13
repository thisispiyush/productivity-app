/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        card: 'var(--card)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',

        accentBlue: 'var(--accent-blue)',
        accentPurple: 'var(--accent-purple)',
        accentGreen: 'var(--accent-green)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
      },
      boxShadow: {
        glow:
          '0 0 0 1px rgba(0,0,0,0.06), 0 20px 40px rgba(0,0,0,0.18), 0 0 24px rgba(79,124,255,0.10)',
        glowGreen:
          '0 0 0 1px rgba(0,0,0,0.06), 0 20px 40px rgba(0,0,0,0.18), 0 0 24px rgba(34,197,94,0.12)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

