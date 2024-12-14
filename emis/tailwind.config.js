/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',  // hide scroll bar for Internet Explorer 10+
          'scrollbar-width': 'none',     // Firefox
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none',               // Chrome, Safari, and Opera
        },
      });
    },
  ],
}