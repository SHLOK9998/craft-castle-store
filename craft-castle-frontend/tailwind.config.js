/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // ── Customer (Heritage Festive) ──────────────
      colors: {
        // Customer palette
        "cf-bg":        "#FAF5EC",
        "cf-primary":   "#610000",
        "cf-primary-c": "#8b0000",
        "cf-secondary": "#FF9933",
        "cf-gold":      "#D4AF37",
        "cf-saffron":   "#FF9933",
        "cf-surface":   "#ffffff",
        "cf-on-surface":"#261816",
        "cf-outline":   "#8e706b",
        "cf-wa":        "#25D366",
        // Admin palette
        "ca-bg":        "#f9f9f9",
        "ca-primary":   "#610000",
        "ca-primary-c": "#8b0000",
        "ca-gold":      "#D4AF37",
        "ca-surface":   "#ffffff",
        "ca-on-surface":"#1a1c1c",
        "ca-border":    "#e2e2e2",
        "ca-sidebar":   "#f3f3f3",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        inter:    ["Inter", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
        admin:     "1440px",
      },
      boxShadow: {
        card:  "0 2px 4px rgba(0,0,0,0.05)",
        modal: "0 8px 16px rgba(0,0,0,0.10)",
        wa:    "0 4px 12px rgba(37,211,102,0.3)",
      },
    },
  },
  plugins: [],
}
