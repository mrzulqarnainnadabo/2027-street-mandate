/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#F5F8F5",
          100: "#E8F0EA",
          200: "#D9EBE3",
          300: "#A9C9B4",
          400: "#6F9C82",
          500: "#3F7B61",
          600: "#2D6651",
          700: "#194B3B",
          800: "#123B2F",
          900: "#0B2D22",
          950: "#071F18",
        },
        gold: {
          300: "#DCCB9B",
          400: "#C5A96A",
          500: "#A7833F",
          600: "#8B6A2E",
        },
        cream: "#FAF9F5",
      },
      fontFamily: {
        display: ['"Source Serif 4"', "Newsreader", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
