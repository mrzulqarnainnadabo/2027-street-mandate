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
          50: "#f0f7f4",
          100: "#d9ebe3",
          400: "#3d7a5c",
          500: "#0B3D2E",
          600: "#0c3f2b",
          700: "#0a3524",
          800: "#072A20",
          900: "#072A20",
          950: "#051c15",
        },
        gold: {
          400: "#d4bc7a",
          500: "#C4A35A",
          600: "#a8791d",
        },
        cream: "#F7F3E9",
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
