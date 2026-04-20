import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0ea5e9",
          dark: "#0369a1",
          light: "#38bdf8",
        },
        accent: {
          DEFAULT: "#f97316",
          dark: "#c2410c",
        },
        pitch: {
          DEFAULT: "#0f172a",
          mid: "#1e293b",
        },
      },
      animation: {
        "slide-up": "slideUp 0.5s ease-out both",
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    }
  },
  plugins: []
};
export default config;
