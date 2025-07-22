/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main Theme Colors based on your image
        'theme-bg': '#E6E7F9',       // Light lavender background
        'theme-surface': '#F0F1FF', // Surface of cards and modals
        'theme-primary': '#A881D5',   // Main purple for buttons/highlights
        'theme-secondary': '#8DD5E3', // Light blue
        'theme-accent': '#FCE29F',    // Yellow accent

        // Text Colors
        'text-primary': '#3D3B62',   // Dark purple for main text
        'text-secondary': '#8E8CB1', // Lighter purple for secondary text

        // Specific pastel colors for other elements if needed
        'pastel-pink': '#FFD1DC',
        'pastel-green': '#B2F2BB',
      },
      borderRadius: {
        '2xl': '24px',
        'xl': '20px',
        'lg': '16px',
      },
      boxShadow: {
        // This creates the soft 3D / claymorphic effect
        'clay': '7px 7px 14px #c3c4d5, -7px -7px 14px #ffffff',
        'clay-inset': 'inset 7px 7px 14px #c3c4d5, inset -7px -7px 14px #ffffff',
        'clay-button-active': 'inset 3px 3px 6px #c3c4d5, inset -3px -3px 6px #ffffff',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}