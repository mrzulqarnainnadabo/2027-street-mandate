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
          500: "#0f4d34",
          700: "#0a3524",
          900: "#16201b",
        },
        gold: {
          400: "#e8b93d",
          500: "#c99a2e",
          600: "#a8791d",
        },
        cream: "#fdfaf2",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        sans: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
