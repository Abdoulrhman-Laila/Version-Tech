/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",   // light bg / text dark mode
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6f6af0",  // gradient start
          600: "#4d3bff",  // main accent
          700: "#4338ca",
          800: "#1e3a8a",  // dark gradient
          900: "#141a3a",  // dark background
        },
      },

      fontFamily: {
        arabic: ['Noto Sans Arabic', 'Arial', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #4d3bff, #1e3a8a)',
        'primary-gradient-soft': 'linear-gradient(135deg, #6f6af0, #4d3bff, #1e3a8a)',
      },

      boxShadow: {
        soft: '0 4px 10px rgba(30, 58, 138, 0.15)',
        medium: '0 10px 24px rgba(30, 58, 138, 0.16)',
      },

      animation: {
        gradient: 'gradient 15s ease infinite',
        float: 'float 6s ease-in-out infinite',
        fade: 'fadeIn 0.4s ease-in-out',
      },

      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },

  plugins: [],
};