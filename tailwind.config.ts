import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F9FF",
        foreground: "#0c1b2a",
        tekhaf: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc4fb",
          400: "#36a3f6",
          500: "#2B8CFF", // Accent
          600: "#0074BD", // Secondary
          700: "#005B96", // Primary
          800: "#034978",
          900: "#083e63",
          950: "#052742",
        },
        brand: {
          primary: "#005B96",
          secondary: "#0074BD",
          accent: "#2B8CFF",
          light: "#F5F9FF",
          dark: "#082F49",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
