import forms from "@tailwindcss/forms";

export default {
  darkMode: "selector",
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  plugins: [forms],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      screens: {
        xs: "380px",
      },
      fontSize: {
        xxs: "0.5rem",
      },
      colors: {
        // Defining a new, vibrant color palette
        background: {
          light: "#F0F4F8", // A very light, cool gray
          dark: "#1A202C", // A deep, dark gray
        },
        surface: {
          DEFAULT: "#FFFFFF", // White for cards and containers
          secondary: "#E2E8F0", // Light gray for secondary elements
          input: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#4C51BF", // A deep, vibrant purple
          accent: "#F687B3", // A bright, playful pink
          light: "#EBF8FF", // A soft light blue
        },
        secondary: {
          DEFAULT: "#38A169", // A calming green
        },
        text: {
          primary: "#2D3748", // A dark, legible gray
          secondary: "#718096", // A softer gray for secondary text
          disabled: "#A0AEC0", // A very light gray for disabled text
        },
        // Keeping a few standard colors for utility
        white: "#FFFFFF",
        black: "#000000",
        transparent: "transparent",
        // Adding specific functional colors for alerts, etc.
        success: "#38A169", // Green for success messages
        danger: "#E53E3E", // Red for error messages
        warning: "#DD6B20", // Orange for warnings
      },
    },
    transitionDuration: {
      "0": "0ms",
    },
  },
};