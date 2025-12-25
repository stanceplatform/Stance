/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#9105C6', // Purple
          yellow: '#F0E224', // Yellow
        },
        secondary: {
          'purple-dark': '#5B037C', // Dark Purple
          'purple-bright': '#BF24F9', // Bright Purple
          'purple-light': '#F8E6FE', // Light Purple
          'purple-deep': '#3A0250', // Deep Purple
          'yellow-dark': '#565006', // Dark Yellow
          'yellow-medium': '#776F08', // Medium Yellow
          'yellow-light': '#F5EC70', // Light Yellow
          'yellow-pale': '#FCF9CF', // Very Light Yellow
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        intro: ['Intro', 'sans-serif'],
      },
      fontSize: {
        'responsive': 'clamp(40px, 10vw, 44px)',
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
  plugins: [typography],
}
