/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // primary greens
        primary: {
          DEFAULT: "#2D6A4F",
          light: "#52B788",
          lighter: "#B7E4C7",
          dark: "#1B4332",
        },
        // backgrounds
        background: {
          DEFAULT: "#FAFAF8",
          card: "#FFFFFF",
          surface: "#F4F1E8",
        },
        // borders
        border: {
          DEFAULT: "#E8E0D0",
          strong: "#D0C8B8",
        },
        // text
        text: {
          primary: "#1A1A2E",
          secondary: "#6B6B6B",
          muted: "#9CA3AF",
          inverse: "#FFFFFF",
        },
        // role badges
        admin: {
          bg: "#E9F5EE",
          text: "#2D6A4F",
        },
        adult: {
          bg: "#EEF2FF",
          text: "#4F46E5",
        },
        child: {
          bg: "#FEF9C3",
          text: "#A16207",
        },
        // accent
        amber: "#E9C46A",
        coral: "#E76F51",
        // status
        success: "#2D6A4F",
        error: "#E63946",
        warning: "#E9C46A",
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        bold: ["Inter_700Bold"],
      },
      borderRadius: {
        card: "12px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};