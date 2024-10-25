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
        inter: ['Inter'], // Add Inter to the theme
      },
      fontSize: {
        'responsive': 'clamp(2rem, 6vw + 1rem, 3rem)',
      },
      lineHeight: {
        'responsive': 'clamp(1.25rem, 8vw + 1rem, 4rem)',
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