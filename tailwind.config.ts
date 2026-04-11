import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        fifa: {
          red: "#C8102E",
          "red-dark": "#9B0D24",
          "red-light": "#E8354F",
          gold: "#D4AF37",
        },
        dark: {
          bg: "#0B0E14",
          card: "#12151E",
          border: "#1E2330",
          surface: "#181C28",
          text: "#E2E8F0",
          muted: "#8B95A5",
        },
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "Consolas", "monospace"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-fire": "pulse-fire 1.5s ease-in-out infinite",
      },
      keyframes: {
        "pulse-fire": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
