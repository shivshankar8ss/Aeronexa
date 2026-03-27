/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        aqi: {
          good:      '#16a34a',
          moderate:  '#ca8a04',
          sensitive: '#ea580c',
          unhealthy: '#dc2626',
          veryBad:   '#9333ea',
          hazardous: '#be123c',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease',
        'slide-up':   'slideUp 0.4s ease',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
