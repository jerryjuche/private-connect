import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Syne'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        void:    "#080A0F",
        surface: "#0D1117",
        panel:   "#111827",
        border:  "#1E2A3A",
        muted:   "#374151",
        dim:     "#6B7280",
        text:    "#E5E7EB",
        bright:  "#F9FAFB",
        arc:     "#6EE7B7",
        signal:  "#38BDF8",
        warn:    "#F59E0B",
        danger:  "#EF4444",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up":    "fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
