/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f5',
          100: '#ffe0e2',
          200: '#ffb3b8',
          300: '#ff7f87',
          400: '#f74e5a',
          500: '#ee2737',
          600: '#cc1525',
          700: '#a50f1c',
          800: '#820c17',
          900: '#620a12',
        },
        navy: {
          50:  '#f0f6ff',
          100: '#daeaf8',
          200: '#b0cfee',
          300: '#7fb0e0',
          400: '#4d8dce',
          500: '#2368b0',
          600: '#1a4f8c',
          700: '#143d70',
          800: '#0e2d55',
          900: '#0c1929',
          950: '#071020',
        },
        main: {
          red: '#ee2737',
          darkRed: '#cc1525',
          gray: '#6b7280',
          lightGray: '#f9f5f5',
          navy: '#0c1929',
          navyMid: '#112236',
          navyLight: '#162e47',
        },
        background: {
          DEFAULT: '#fafafa',
          dark: '#0c1929',
          darker: '#071020',
          card: '#ffffff',
          cardDark: '#112236',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#162e47',
          darker: '#112236',
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#1e3d5f',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
