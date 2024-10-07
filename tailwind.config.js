/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yellow-700': '#F0E224',
      },
      fontFamily: {
        inter: ['Inter', 'Roboto'], // Add Inter to the theme
      },
    },
  },
  plugins: [],
}