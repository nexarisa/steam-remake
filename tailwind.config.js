/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steamDark: '#171a21',
        steamLight: '#1b2838',
        steamBlue: '#66c0f4',
        steamGreen: '#a4d007',
      }
    },
  },
  plugins: [],
}