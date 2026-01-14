/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ed',
          100: '#dde5d4',
          200: '#c4d3b9',
          300: '#a8c09d',
          400: '#8aad82',
          500: '#6b8e6f',
          600: '#5a7d60',
          700: '#4a6741',
          800: '#3a5231',
          900: '#2b3d23',
        },
        accent: {
          cream: '#d4c9b8',
          sage: '#6b8e6f',
          forest: '#4a6741',
        },
      },
    },
  },
  plugins: [],
};
