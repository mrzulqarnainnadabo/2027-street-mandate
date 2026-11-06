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
          50: "#e8f0ea",
          100: "#e8f0ea",
          400: "#194b3b",
          500: "#194B3B",
          600: "#194B3B",
          700: "#194B3B",
          800: "#194B3B",
          900: "#123B2F",
          950: "#123B2F",
        },
        gold: {
          400: "#A7833F",
          500: "#A7833F",
          600: "#A7833F",
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
