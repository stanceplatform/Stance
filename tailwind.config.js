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
        'yellow-900': '#333104',
        'yellow-500': '#D2C40F',
        'purple-900': '#280137',  
      },
      fontFamily: {
        inter: ['Inter', 'Roboto'], // Add Inter to the theme
      },
      height: {
        'screen-svh': '100svh', // Small Viewport Height
        'screen-lvh': '100lvh', // Large Viewport Height
        'screen-dvh': '100dvh', // Dynamic Viewport Height
      },
    },
  },
  plugins: [],
}