/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blinkit: {
          yellow: '#F8CB46',
          green: '#0C831F',
          darkgreen: '#075A15',
          lightgreen: '#E8F5E9',
          dark: '#1C1C1C',
        },
        sapphire: {
          50: '#F0F5FF',
          100: '#E1EBFF',
          500: '#2F54EB',
          600: '#1D39C4',
          700: '#10239E',
          800: '#061178',
          900: '#030852',
        }
      }
    },
  },
  plugins: [],
}
