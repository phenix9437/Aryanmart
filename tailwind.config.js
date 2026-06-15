/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F2D6B',
          dark: '#091E4A',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#E85D04',
          light: '#FF8C42',
          foreground: '#FFFFFF',
        },
        govt: {
          DEFAULT: '#2D6A4F',
          foreground: '#FFFFFF',
        },
        surface: '#F4F6FA',
        card: '#FFFFFF',
        border: '#DDE3EE',
        text: {
          primary: '#1A1D2E',
          muted: '#6B7A99',
        },
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['48px', { lineHeight: '52px', fontWeight: '700' }],
        'display-xl': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'display-lg': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'heading-xl': ['22px', { lineHeight: '32px', fontWeight: '600' }],
        'heading-lg': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'mono-md': ['13px', { lineHeight: '20px', fontWeight: '400' }],
      },
      spacing: {
        18: '72px',
        22: '88px',
      },
      maxWidth: {
        content: '1360px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(15 45 107 / 0.05)',
        md: '0 4px 6px -1px rgb(15 45 107 / 0.08)',
        lg: '0 10px 15px -3px rgb(15 45 107 / 0.1)',
      },
      height: {
        'header-utility': '36px',
        'header-main': '72px',
        'header-category': '48px',
        'hero-desktop': '480px',
        'hero-mobile': '260px',
      },
      width: {
        'plp-sidebar': '240px',
        'plp-rail': '200px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
