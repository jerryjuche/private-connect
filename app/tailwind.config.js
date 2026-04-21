/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        void: "#0A0F14",
        surface: "#101720",
        panel: "#151E29",
        border: "#263243",
        muted: "#415166",
        dim: "#8A98AA",
        text: "#E4EBF2",
        bright: "#F8FBFF",
        arc: "#63C7A2",
        signal: "#6DA4FF",
        warn: "#D9A441",
        danger: "#D56B6B",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      boxShadow: {
        soft:
          "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 30px rgba(2,6,12,0.18)",
        panel:
          "0 1px 0 rgba(255,255,255,0.035) inset, 0 18px 48px rgba(2,6,12,0.24)",
        accent:
          "0 1px 0 rgba(255,255,255,0.05) inset, 0 16px 40px rgba(99,199,162,0.14)",
      },
      borderRadius: {
        xl2: "1.125rem",
      },
    },
  },
  plugins: [],
};