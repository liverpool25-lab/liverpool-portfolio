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
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          lowest: "var(--surface-lowest)",
          low: "var(--surface-low)",
          DEFAULT: "var(--surface-default)",
          high: "var(--surface-high)",
          highest: "var(--surface-highest)",
        },
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        border: "var(--border-subtle)",
        spider: {
          DEFAULT: "#D9323E",
          hover: "#BF2430",
          glow: "rgba(217, 50, 62, 0.35)",
        },
        accent: {
          lime: "#C8F36B",
          mint: "#72D9BC",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      spacing: {
        gutter: "1.5rem",
        "gutter-mobile": "1rem",
        margin: "3rem",
        "margin-mobile": "1.25rem",
      },
      scale: {
        "102": "1.02",
        "103": "1.03",
        "104": "1.04",
      },
    },
  },
  plugins: [],
};

export default config;
