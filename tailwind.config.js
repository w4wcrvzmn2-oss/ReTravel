/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Coral accent — replaces old blue primary
        primary: {
          50:  '#fef4f1',
          100: '#fde8e2',
          200: '#fbd0c4',
          400: '#f08066',
          500: '#e85d3d',
          600: '#c0492c',
          700: '#9e3822',
          800: '#7a2b19',
          900: '#5a1f12',
        },
        accent: {
          400: '#e9a288',
          500: '#e85d3d',
          600: '#c0492c',
        },
        // Warm dark theme (replaces cold slate)
        dark: {
          950: '#0e0b08',
          900: '#14110d',
          800: '#1e1a15',
          700: '#2a2318',
          600: '#3d3328',
        },
        // Warm cream / sand tones
        sand: {
          50:  '#fffefb',
          100: '#f6f3ec',
          200: '#ece6d8',
          300: '#ddd6c8',
          400: '#c7bfb0',
          500: '#9a9183',
          600: '#6f685d',
          700: '#5d564b',
        },
        ink: '#191512',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans:    ['Manrope', 'system-ui', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'float':      'rtFloat 5s ease-in-out infinite',
        'float-slow': 'rtFloat 7s ease-in-out infinite',
        'pulse-coral':'rtPulse 2s infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        rtFloat: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-7px)' } },
        rtPulse: {
          '0%':   { boxShadow: '0 0 0 0 rgba(232,93,61,.5)' },
          '70%':  { boxShadow: '0 0 0 13px rgba(232,93,61,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(232,93,61,0)' },
        },
      },
    },
  },
  plugins: [],
}
