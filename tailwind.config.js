/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <– permite alternar entre temas via classe .dark
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        brand: {
          DEFAULT: "#22c55e", // verde padrão (pode mudar pra sua paleta)
          dark: "#16a34a",
          light: "#4ade80",
        },
      },
    },
  },
  plugins: [],
};
