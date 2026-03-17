/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        clay: {
          50: "#fbf7f1",
          100: "#f4ebdf",
          200: "#e6d0bb",
          300: "#d7b08c",
          400: "#c58b5b",
          500: "#b76634",
          600: "#9f5028",
          700: "#7f3f22",
          800: "#69351f",
          900: "#592f1d",
        },
      },
      boxShadow: {
        panel: "0 24px 60px rgba(84, 48, 29, 0.12)",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
