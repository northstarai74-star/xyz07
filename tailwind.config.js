/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Marigold & indigo. Every pairing below clears WCAG AA (4.5:1); the
      // tightest is muted-foreground on background at 5.7:1.
      colors: {
        background: "#fdfbf6",        // warm cream, so white cards lift off it
        foreground: "#1b2a4a",        // deep indigo reads softer than black on cream
        card: "#ffffff",
        "card-foreground": "#1b2a4a",
        primary: "#22345c",           // indigo: buttons, links, focus rings
        "primary-foreground": "#fdfbf6",
        secondary: "#f3ede2",         // sand: image placeholders, section bands
        accent: "#e8a33d",            // marigold, for small hits of colour only
        "accent-foreground": "#1b2a4a", // dark on marigold - white would fail at 2.2:1
        border: "#e4dacb",
        "muted-foreground": "#6b6455",
        ink: "#16223d",               // darker still, for the full-bleed hero band
        "ink-foreground": "#fdfbf6",
      },
      fontFamily: {
        display: ["system-ui", "sans-serif"],
        sans: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
